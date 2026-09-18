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

    // If this request is not for media assets, check if it's an article / media-segment page for social meta tags
    if (!isMediaHost && !isMediaPath) {
        const articleMatch = (request.method === 'GET' || request.method === 'HEAD')
            ? url.pathname.match(/^\/(?:article|media-segment)\/(\d+)/)
            : null

        if (articleMatch) {
            return handleArticleSocialMeta(context, articleMatch[1], url)
        }

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

class ElementModifier {
    constructor(attribute, value) {
        this.attribute = attribute
        this.value = value
    }
    element(el) {
        if (this.value) {
            el.setAttribute(this.attribute, this.value)
        }
    }
}

class ContentModifier {
    constructor(content) {
        this.content = content
    }
    element(el) {
        if (this.content) {
            el.setInnerContent(this.content)
        }
    }
}

function extractExcerpt(body, maxLength = 160) {
    if (!body) return "Read the full story on The Philippine Artisan."
    const clean = body
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
    if (!clean) return "Read the full story on The Philippine Artisan."
    if (clean.length <= maxLength) return clean
    return clean.substring(0, maxLength).trim() + "…"
}

function extractCoverPhoto(article, origin) {
    if (article.article_media && article.article_media.length > 0) {
        const sorted = [...article.article_media].sort((a, b) => (a.media_order || 0) - (b.media_order || 0))
        const url = sorted[0]?.media?.media_url
        if (url) {
            if (url.startsWith('http://') || url.startsWith('https://')) return url
            return `${origin}${url.startsWith('/') ? '' : '/'}${url}`
        }
    }
    return `${origin}/TPA-Cover.webp`
}

async function handleArticleSocialMeta(context, articleId, url) {
    const { env, next } = context
    const response = await next()

    // Only transform HTML responses
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
        return response
    }

    try {
        const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || 'https://uapnaylpxunquhievzzm.supabase.co'
        const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcG5heWxweHVucXVoaWV2enptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTgzMjIsImV4cCI6MjA4MjA3NDMyMn0.QR1h6BhxDoTVyLnITNCNtqMzcfDmLR2Lf2GihZjB4h8'

        const apiRes = await fetch(
            `${supabaseUrl}/rest/v1/article?article_id=eq.${articleId}&select=article_id,article_headline,article_body,article_type,article_media(media_order,media(media_url))&is_published=eq.true&limit=1`,
            {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            }
        )

        if (!apiRes.ok) {
            return response
        }

        const data = await apiRes.json()
        const article = Array.isArray(data) ? data[0] : null
        if (!article || !article.article_headline) {
            return response
        }

        const headline = article.article_headline
        const excerpt = extractExcerpt(article.article_body)
        const coverImage = extractCoverPhoto(article, url.origin)
        const canonicalUrl = url.href

        return new HTMLRewriter()
            .on('title', new ContentModifier(`${headline} | The Philippine Artisan`))
            .on('link[rel="canonical"]', new ElementModifier('href', canonicalUrl))
            .on('meta[name="description"]', new ElementModifier('content', excerpt))
            .on('meta[property="og:title"]', new ElementModifier('content', headline))
            .on('meta[property="og:description"]', new ElementModifier('content', excerpt))
            .on('meta[property="og:image"]', new ElementModifier('content', coverImage))
            .on('meta[property="og:url"]', new ElementModifier('content', canonicalUrl))
            .on('meta[property="og:type"]', new ElementModifier('content', 'article'))
            .on('meta[name="twitter:title"]', new ElementModifier('content', headline))
            .on('meta[name="twitter:description"]', new ElementModifier('content', excerpt))
            .on('meta[name="twitter:image"]', new ElementModifier('content', coverImage))
            .transform(response)
    } catch (err) {
        console.error('Error rewriting social metadata for article:', err)
        return response
    }
}

