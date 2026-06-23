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
