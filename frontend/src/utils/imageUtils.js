import { supabase } from '../supabaseClient'

/**
 *  Matsalove AI!
 * 
 *  Compress an image file using HTML5 canvas api to convert into webp/jpeg
 * 
 *  @param {File} file - Original file submitted by uploader
 *  @param {number} maxWidth - Maximum width of the compressed image (1200px)
 *  @param {number} maxHeight - Maximum height of the compressed image (1200px)
 *  @param {number} quality - Compression quality between 0.0 to 1.0 (0.8)
 *  @param {string} outputFormat - Output MIME type (image/webp)
 *  @returns {Promise<Blob>} - resolve with compressed image blob
 */

export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8, outputFormat = 'image/webp') => {
    return new Promise((resolve, reject) => {
        if(!file.type.startsWith("image/")) { // if the uploaded image is not an image
            reject(new Error("File is not an image."))
            return
        }

        const startTime = performance.now()

        const reader = new FileReader() // create a reader to convert image into base64 string
        reader.readAsDataURL(file)

        reader.onload = (e) => { // onload, trigger this
            const img = new Image() // creates a virtual <img> element tag in memory
            img.src = e.target.result // assign base64 string as a result to load the photo and access width and height
        
            img.onload = () => { // assign and calculate aspect ratio
                const canvas = document.createElement("canvas")
                let width = img.width
                let height = img.height 

                if(width > height) {
                    if(width > maxWidth) {
                        height = Math.round((height * maxWidth) / width)
                        width = maxWidth
                    }
                } else {
                    if(height > maxHeight){
                        width = Math.round((width * maxHeight) / height)
                        height = maxHeight
                    }
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext("2d") // obtains brush/drawing tool
                if(!ctx){
                    reject(new Error("Failed to get canvas 2d context"))
                    return
                }
                
                // draw image onto the canvas (to downscale)
                ctx.drawImage(img, 0, 0, width, height)

                // convert canvas drawing into webp/jpeg

                canvas.toBlob(
                    (blob) => {
                        if(blob){
                            const endTime = performance.now()
                            const durationMs = (endTime - startTime).toFixed(0)

                            console.log(
                            `[Image Compression] Compressed "${file.name}" in ${durationMs}ms. ` +
                            `Original: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ` +
                            `Optimized (${outputFormat.split('/')[1]}): ${(blob.size / 1024).toFixed(0)}KB`
                            )

                            resolve(blob)
                        } else {
                            reject(new Error("Image compression failed"))
                        }
                    },
                    outputFormat,
                    quality
                )
            }

            img.onerror = (error) => reject(error)
        }

        reader.onerror = (error) => reject(error)
    })
}

/**
 * Upload an image (File or Blob) to Cloudflare R2 storage.
 * 
 * Attempts direct presigned URL PUT first (fastest direct-to-storage upload).
 * If direct upload fails (e.g. CORS restrictions on R2 endpoint), gracefully
 * falls back to the same-origin server proxy endpoint (/api/media/upload).
 * 
 * @param {Object} options
 * @param {Blob|File} options.file - The Blob or File object to upload
 * @param {string} [options.filename] - The target filename (e.g., "cover.webp")
 * @param {string} [options.folder] - Target subfolder in bucket (e.g. "pubmats", "releases/covers")
 * @param {string} [options.contentType] - MIME type, default "image/webp"
 * @param {string} [options.bucket] - R2 bucket name, default "article-photos"
 * @returns {Promise<{ publicUrl: string, key: string }>}
 */
export const uploadToR2Storage = async ({
    file,
    filename,
    folder = "pubmats",
    contentType = "image/webp",
    bucket = "article-photos"
}) => {
    if (!file) {
        throw new Error("No file or blob provided for upload.")
    }

    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const safeFilename = filename || (file.name ? file.name.replace(/\.[^/.]+$/, "") + ".webp" : "upload.webp")

    // Strategy 1: Attempt direct presigned URL PUT (fastest direct-to-R2 upload)
    try {
        const presignRes = await fetch("/api/media/presign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                filename: safeFilename,
                contentType,
                folder,
                bucket
            })
        })

        if (presignRes.ok) {
            const data = await presignRes.json()
            const presignedUrl = data.presignedUrl
            const publicUrl = data.publicUrl
            const key = data.key

            if (presignedUrl) {
                const uploadRes = await fetch(presignedUrl, {
                    method: "PUT",
                    headers: { "Content-Type": contentType },
                    body: file
                })

                if (uploadRes.ok) {
                    return { publicUrl, key }
                }
            }
        }
    } catch (directErr) {
        console.warn("Direct R2 presigned upload failed (likely CORS or network), attempting server proxy fallback...", directErr)
    }

    // Strategy 2: Fallback to same-origin /api/media/upload endpoint (bypasses R2 CORS)
    try {
        const formData = new FormData()
        formData.append("file", file, safeFilename)
        formData.append("filename", safeFilename)
        formData.append("folder", folder)
        formData.append("bucket", bucket)

        const proxyRes = await fetch("/api/media/upload", {
            method: "POST",
            headers: {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: formData
        })

        if (proxyRes.ok) {
            const proxyData = await proxyRes.json()
            return proxyData
        }
    } catch (proxyErr) {
        console.warn("Server proxy upload fallback also failed:", proxyErr)
    }

    // If both failed:
    throw new Error(
        "Upload blocked by Cloudflare R2 CORS policy. Please configure CORS for origin 'https://philartisan.org' on the 'article-photos' bucket in Cloudflare Dashboard."
    )
}
