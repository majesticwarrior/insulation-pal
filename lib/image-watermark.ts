// Utility function to add watermark logo to images before upload
// Watermark appears in the bottom right corner

export const addWatermarkToImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Check if running in browser
    if (typeof window === 'undefined') {
      // Server-side: return original file
      resolve(file)
      return
    }

    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = async () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          // Set canvas dimensions
          canvas.width = img.width
          canvas.height = img.height

          // Draw original image
          ctx.drawImage(img, 0, 0)

          // Load and draw logo if available
          let logoImg: HTMLImageElement | null = null
          
          // Try to load the logo image with timeout
          try {
            logoImg = new Image()
            logoImg.crossOrigin = 'anonymous'
            
            // Set up load handlers before setting src
            const logoLoadPromise = new Promise<void>((resolve) => {
              if (logoImg) {
                logoImg.onload = () => {
                  console.log('✅ InsulationPal logo loaded successfully')
                  resolve()
                }
                logoImg.onerror = () => {
                  console.warn('⚠️ InsulationPal logo failed to load, using text watermark')
                  logoImg = null
                  resolve()
                }
              } else {
                resolve()
              }
            })
            
            // Set src after handlers are set up
            logoImg.src = '/insulation-pal-logo.png' // Path to logo in public folder
            
            // Wait for logo to load with 3 second timeout
            await Promise.race([
              logoLoadPromise,
              new Promise<void>((resolve) => {
                setTimeout(() => {
                  if (logoImg && !logoImg.complete) {
                    console.warn('⚠️ Logo load timeout, using text watermark')
                    logoImg = null
                  }
                  resolve()
                }, 3000)
              })
            ])
          } catch (error) {
            console.error('Error loading logo:', error)
            logoImg = null
          }

          // Add watermark - either logo or text (always add a watermark)
          if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
            // Add logo watermark in bottom right corner
            const logoSize = Math.min(img.width, img.height) * 0.15 // 15% of smaller dimension, max 200px
            const maxLogoSize = 200
            const finalLogoSize = Math.min(logoSize, maxLogoSize)
            const padding = Math.min(img.width, img.height) * 0.02 // 2% padding, min 10px
            const minPadding = 10
            const finalPadding = Math.max(padding, minPadding)
            const x = canvas.width - finalLogoSize - finalPadding
            const y = canvas.height - finalLogoSize - finalPadding
            
            // Draw logo with semi-transparent background for better visibility
            ctx.save()
            
            // Draw semi-transparent white background behind logo
            ctx.globalAlpha = 0.3
            ctx.fillStyle = 'white'
            ctx.fillRect(
              x - finalPadding * 0.5,
              y - finalPadding * 0.5,
              finalLogoSize + finalPadding,
              finalLogoSize + finalPadding
            )
            
            // Draw logo with opacity
            ctx.globalAlpha = 0.8
            ctx.drawImage(logoImg, x, y, finalLogoSize, finalLogoSize)
            
            ctx.restore()
            console.log('✅ Logo watermark applied to image')
          } else {
            // Fallback: text watermark if logo not available
            const fontSize = Math.max(img.width, img.height) / 25
            ctx.font = `bold ${fontSize}px Arial`
            ctx.fillStyle = '#F5DD22'
            ctx.textAlign = 'right'
            ctx.textBaseline = 'bottom'
            
            // Add semi-transparent background for text
            ctx.globalAlpha = 0.7
            const text = 'InsulationPal.com'
            const metrics = ctx.measureText(text)
            const textWidth = metrics.width
            const textHeight = fontSize
            
            // Draw background rectangle
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            const padding = fontSize * 0.3
            ctx.fillRect(
              canvas.width - textWidth - padding * 2 - fontSize * 0.5,
              canvas.height - textHeight - padding - fontSize * 0.5,
              textWidth + padding * 2,
              textHeight + padding * 2
            )
            
            // Draw text
            ctx.fillStyle = '#F5DD22'
            ctx.fillText(
              text,
              canvas.width - padding - fontSize * 0.5,
              canvas.height - padding - fontSize * 0.5
            )
            ctx.globalAlpha = 1.0
            console.log('✅ Text watermark applied to image')
          }

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'))
              return
            }

            // Create new File from blob
            const watermarkedFile = new File(
              [blob],
              file.name,
              { type: file.type }
            )
            resolve(watermarkedFile)
          }, file.type)

        } catch (error) {
          // If watermarking fails, return original file
          console.error('Error adding watermark:', error)
          resolve(file)
        }
      }

      img.onerror = () => {
        // If image load fails, return original file
        resolve(file)
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

