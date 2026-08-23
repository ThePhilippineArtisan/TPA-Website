import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf'
])

export async function onRequestPost(context) {
    try {
        const { request, env } = context

        // 1. Authenticate Request via Supabase JWT
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Missing or invalid Authorization header' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const token = authHeader.split(' ')[1]
        const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL
        const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseAnonKey) {
            const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'apikey': supabaseAnonKey
                }
            })

            if (!userRes.ok) {
                return new Response(
                    JSON.stringify({ error: 'Unauthorized: Invalid authentication session' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                )
            }
        }

        // 2. Parse JSON body
        const { filename, contentType, folder } = await request.json()

        if (!filename || !contentType) {
            return new Response(
                JSON.stringify({ error: 'filename and contentType are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // 3. Validate MIME Type
        if (!ALLOWED_MIME_TYPES.has(contentType.toLowerCase())) {
            return new Response(
                JSON.stringify({ error: 'Forbidden: Unsupported or unsafe file type' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // 4. Sanitize Filename & Folder (Prevent Path Traversal)
        const cleanFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/\.{2,}/g, '.')
        const cleanFolder = folder ? folder.replace(/[^a-zA-Z0-9_-]/g, '') : ''
        const key = cleanFolder ? `${cleanFolder}/${cleanFilename}` : cleanFilename

        // 5. Restrict target bucket
        const targetBucket = env.R2_BUCKET_NAME || 'article-photos'

        // 6. Initiate R2 Client
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
            ContentType: contentType,
        })

        // 7. Generate Presigned URL
        const presignedUrl = await getSignedUrl(
            r2Client, 
            command, 
            { expiresIn: 300 }
        )
        
        const publicUrlPrefix = env.R2_PUBLIC_URL || ''
        const publicUrl = publicUrlPrefix ? `${publicUrlPrefix}/${key}` : key

        return new Response(
            JSON.stringify({ presignedUrl, publicUrl, key }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )   
    } catch(error) {
        console.error('Error generating presigned URL: ', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Failed to generate presigned URL' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}