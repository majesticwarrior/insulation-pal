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
          
          // Try to load the logo image
          try {
            logoImg = new Image()
            logoImg.crossOrigin = 'anonymous'
            logoImg.src = '/insulation-pal-logo.png' // Path to logo in public folder
            
            await new Promise<void>((resolve) => {
              if (logoImg) {
                logoImg.onload = () => resolve()
                logoImg.onerror = () => {
                  // If logo fails to load, continue without logo
                  logoImg = null
                  resolve()
                }
              } else {
                resolve()
              }
            })
          } catch (error) {
            // If logo can't be loaded, continue without logo
            logoImg = null
          }

          // Add watermark - either logo or text
          if (logoImg) {
            // Add logo watermark in bottom right
            const logoSize = Math.min(img.width, img.height) * 0.15 // 15% of smaller dimension
            const padding = Math.min(img.width, img.height) * 0.02 // 2% padding
            const x = canvas.width - logoSize - padding
            const y = canvas.height - logoSize - padding
            
            // Draw logo with opacity
            ctx.globalAlpha = 0.6
            ctx.drawImage(logoImg, x, y, logoSize, logoSize)
            ctx.globalAlpha = 1.0
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

