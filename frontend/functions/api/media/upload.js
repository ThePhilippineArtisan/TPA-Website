import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
])

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin') || ''
    const isAllowed = 
        origin === 'https://philartisan.org' || 
        origin.endsWith('.philartisan.org') || 
        origin.startsWith('http://localhost:')
    
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : 'https://philartisan.org',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
}

export async function onRequestPost(context) {
    const { request, env } = context
    const corsHeaders = getCorsHeaders(request)

    try {
        // 1. Authenticate Request via Supabase JWT
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Missing or invalid Authorization header' }),
                { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            )
        }

        const token = authHeader.split(' ')[1]
        const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL
        const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            return new Response(
                JSON.stringify({ error: 'Server configuration error: Missing Supabase credentials' }),
                { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            )
        }

        const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': supabaseAnonKey
            }
        })

        if (!userRes.ok) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Invalid authentication session' }),
                { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            )
        }

        // 2. Parse Multipart Form Data
        const formData = await request.formData()
        const file = formData.get('file')
        const filename = formData.get('filename') || (file ? file.name : '')
        const folder = formData.get('folder') || ''
        const customBucket = formData.get('bucket') || ''

        if (!file || !filename) {
            return new Response(
                JSON.stringify({ error: 'file and filename are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            )
        }

        const contentType = file.type || 'image/webp'

        // 3. Validate MIME Type
        if (!ALLOWED_MIME_TYPES.has(contentType.toLowerCase())) {
            return new Response(
                JSON.stringify({ error: 'Forbidden: Unsupported or unsafe file type' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            )
        }

        // 4. Sanitize Filename & Folder
        const cleanFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/\.{2,}/g, '.')
        const cleanFolder = folder ? folder.replace(/[^a-zA-Z0-9_/-]/g, '').replace(/\/{2,}/g, '/').replace(/^\/|\/$/g, '') : ''
        const key = cleanFolder ? `${cleanFolder}/${cleanFilename}` : cleanFilename

        // 5. Restrict target bucket
        const targetBucket = customBucket || env.R2_BUCKET_NAME || 'article-photos'

        const fileBytes = new Uint8Array(await file.arrayBuffer())

        // 6. Direct R2 Worker binding check (if configured in Cloudflare Pages)
        const bucketBinding = env.R2_BUCKET || env.ARTICLE_PHOTOS
        if (bucketBinding && typeof bucketBinding.put === 'function') {
            await bucketBinding.put(key, fileBytes, {
                httpMetadata: { contentType }
            })
        } else {
            // 7. S3 Client Fallback via R2 API credentials
            const r2Client = new S3Client({
                region: 'auto',
                endpoint: env.R2_ENDPOINT,
                credentials: {
                    accessKeyId: env.R2_ACCESS_KEY_ID,
                    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
                },
            })

            const command = new PutObjectCommand({
                Bucket: targetBucket,
                Key: key,
                Body: fileBytes,
                ContentType: contentType,
            })

            await r2Client.send(command)
        }

        const publicUrlPrefix = env.R2_PUBLIC_URL || ''
        const publicUrl = publicUrlPrefix ? `${publicUrlPrefix}/${key}` : key

        return new Response(
            JSON.stringify({ publicUrl, key }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            }
        )
    } catch (error) {
        console.error('Error uploading file to storage:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Failed to upload file to storage' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
    }
}

export async function onRequestOptions(context) {
    const { request } = context
    const corsHeaders = getCorsHeaders(request)
    return new Response(null, {
        status: 204,
        headers: corsHeaders
    })
}
