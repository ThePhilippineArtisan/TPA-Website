import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const MIME_TYPES = {
    'webp': 'image/webp',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'mp4': 'video/mp4'
}

function getMimeType(key) {
    const ext = key.split('.').pop()?.toLowerCase() || ''
    return MIME_TYPES[ext] || 'application/octet-stream'
}

export async function onRequest(context) {
    const { request, env, next } = context
    const url = new URL(request.url)

    const isMediaHost = url.hostname === 'media.philartisan.org' || url.hostname.startsWith('media.')
    const isMediaPath = url.pathname.startsWith('/media/')

    // If this request is not for media assets, pass through to Vite SPA / other functions
    if (!isMediaHost && !isMediaPath) {
        return next()
    }

    // Determine the R2 object key
    let key = url.pathname
    if (isMediaPath) {
        key = key.replace(/^\/media\//, '')
    } else {
        key = key.replace(/^\/+/, '')
    }

    // Do not intercept API endpoints
    if (key.startsWith('api/')) {
        return next()
    }

    if (!key) {
        return new Response('Media asset path is required', { status: 400 })
    }

    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400',
            }
        })
    }

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Cache-Control': 'public, max-age=31536000, immutable',
    }

    // Strategy 1: Direct Cloudflare Pages R2 bucket binding (if bound in dashboard)
    if (env.R2_BUCKET || env.ARTICLE_PHOTOS) {
        const bucket = env.R2_BUCKET || env.ARTICLE_PHOTOS
        try {
            const object = await bucket.get(key)
            if (object) {
                const headers = new Headers(corsHeaders)
                object.writeHttpMetadata(headers)
                headers.set('etag', object.httpEtag)
                if (!headers.get('Content-Type')) {
                    headers.set('Content-Type', getMimeType(key))
                }
                return new Response(object.body, { headers })
            }
        } catch (bindingErr) {
            console.warn('R2 bucket binding read failed, attempting S3 client fallback...', bindingErr)
        }
    }

    // Strategy 2: S3 Client via environment credentials
    if (env.R2_ENDPOINT && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY) {
        try {
            const r2Client = new S3Client({
                region: 'auto',
                endpoint: env.R2_ENDPOINT,
                credentials: {
                    accessKeyId: env.R2_ACCESS_KEY_ID,
                    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
                },
            })

            const targetBucket = env.R2_BUCKET_NAME || 'article-photos'
            const getCmd = new GetObjectCommand({
                Bucket: targetBucket,
                Key: key,
            })

            const s3Res = await r2Client.send(getCmd)
            const contentType = s3Res.ContentType || getMimeType(key)

            const responseHeaders = {
                ...corsHeaders,
                'Content-Type': contentType,
                'ETag': s3Res.ETag || '',
            }

            if (s3Res.ContentLength) {
                responseHeaders['Content-Length'] = String(s3Res.ContentLength)
            }

            return new Response(s3Res.Body, {
                status: 200,
                headers: responseHeaders
            })
        } catch (err) {
            if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
                return new Response('File not found in storage', { status: 404, headers: corsHeaders })
            }
            console.error('Error serving R2 object via S3 SDK:', err)
            return new Response(`Error retrieving media: ${err.message}`, { status: 500, headers: corsHeaders })
        }
    }

    return new Response('R2 storage is not configured on this environment.', { status: 500, headers: corsHeaders })
}
