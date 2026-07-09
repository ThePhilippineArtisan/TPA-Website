import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function onRequestPost(context){
    // akin to app.post('/', ???) of express

    try{
        const { request, env } = context

        // 1. Parse JSON body

        const { filename, contentType, folder, bucket } = await request.json()

        if(!filename || !contentType) {
            return new Response(
                JSON.stringify({error: 'filename and contentType are required'}),
                { status: 400, headers: { 'Content-Type': 'application/json'}}
            )
        }

        // 2. Initiate R2/S3 Client
        const r2Client = new S3Client({
            region: 'auto',
            endpoint: env.R2_ENDPOINT,
            credentials: {
                accessKeyId: env.R2_ACCESS_KEY_ID,
                secretAccessKey: env.R2_SECRET_ACCESS_KEY,
            },
        })

        // 3. Define file path & Key
        const key = folder ? `${folder}/${filename}` : filename

        const targetBucket = bucket || env.R2_BUCKET_NAME
        const command = new PutObjectCommand({ 
            Bucket: targetBucket,
            Key: key,
            ContentType: contentType,
        })

        // 4. Generate Presigned URL for Cloudflare R2
        const presignedUrl = await getSignedUrl(
            r2Client, 
            command, 
            { expiresIn: 300 } // 300 seconds
        )
        
        // 5. construct public access url 
        const envKey = `R2_PUBLIC_URL_${targetBucket.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`
        const publicUrlPrefix = env[envKey] || env.R2_PUBLIC_URL
        const publicUrl = `${publicUrlPrefix}/${key}`

        // 6. Return response
        return new Response(
            JSON.stringify({ presignedUrl, publicUrl, key}),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )   
    } catch(error){
        console.error('Error generating presigned URL: ', error)
        return new Response(
            JSON.stringify({error: error.message || 'Failed to generate presigned URL'}),
            { status: 500, headers: { 'Content-Type': 'application/json'}}
        )
    }
}

export async function onRequestOptions(){
    return new Response(null, {
        status: 204,
        headers: {
            // Allow adding 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    })
}