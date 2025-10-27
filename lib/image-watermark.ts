// Utility function to add watermark to images before upload

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
      
      img.onload = () => {
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

          // Add watermark
          ctx.globalAlpha = 0.3 // Semi-transparent watermark
          ctx.font = `bold ${Math.max(img.width, img.height) / 15}px Arial`
          ctx.fillStyle = '#F5DD22'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          
          // Center text
          const text = 'InsulationPal.com'
          const x = canvas.width / 2
          const y = canvas.height / 2
          
          // Add text shadow for visibility
          ctx.shadowColor = '#000'
          ctx.shadowBlur = 10
          ctx.fillText(text, x, y)

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
          console.error('Error adding watermark:', error)
          // If watermarking fails, return original file
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

