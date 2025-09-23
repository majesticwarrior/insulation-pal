// Note: This is a basic implementation for watermarking
// In production, you might want to use a service like Cloudinary or AWS Lambda

import { createCanvas, loadImage } from 'canvas'

export interface WatermarkOptions {
  text: string
  fontSize?: number
  opacity?: number
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  color?: string
}

export async function addWatermark(
  imageBuffer: Buffer,
  options: WatermarkOptions = {}
): Promise<Buffer> {
  try {
    const {
      text = 'Insulation Pal',
      fontSize = 24,
      opacity = 0.7,
      position = 'bottom-right',
      color = 'white'
    } = options

    // Load the original image
    const originalImage = await loadImage(imageBuffer)
    
    // Create a canvas with the same dimensions as the original image
    const canvas = createCanvas(originalImage.width, originalImage.height)
    const ctx = canvas.getContext('2d')
    
    // Draw the original image
    ctx.drawImage(originalImage, 0, 0)
    
    // Set up text styling
    ctx.font = `${fontSize}px Arial, sans-serif`
    ctx.fillStyle = color
    ctx.globalAlpha = opacity
    
    // Add shadow for better visibility
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Calculate text dimensions
    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width
    const textHeight = fontSize
    
    // Calculate position based on option
    let x: number, y: number
    const padding = 20
    
    switch (position) {
      case 'bottom-right':
        x = canvas.width - textWidth - padding
        y = canvas.height - padding
        break
      case 'bottom-left':
        x = padding
        y = canvas.height - padding
        break
      case 'top-right':
        x = canvas.width - textWidth - padding
        y = textHeight + padding
        break
      case 'top-left':
        x = padding
        y = textHeight + padding
        break
      case 'center':
        x = (canvas.width - textWidth) / 2
        y = (canvas.height + textHeight) / 2
        break
      default:
        x = canvas.width - textWidth - padding
        y = canvas.height - padding
    }
    
    // Draw the watermark text
    ctx.fillText(text, x, y)
    
    // Convert canvas to buffer
    return canvas.toBuffer('image/jpeg', { quality: 0.9 })
  } catch (error) {
    console.error('Error adding watermark:', error)
    throw new Error('Failed to add watermark to image')
  }
}

export async function processContractorImage(
  imageBuffer: Buffer,
  contractorName?: string
): Promise<Buffer> {
  const watermarkText = contractorName 
    ? `${contractorName} - Insulation Pal`
    : 'Insulation Pal'
    
  return addWatermark(imageBuffer, {
    text: watermarkText,
    fontSize: Math.max(16, Math.min(32, Math.round(imageBuffer.length / 50000))), // Dynamic size based on image size
    opacity: 0.6,
    position: 'bottom-right',
    color: 'white'
  })
}

// Example usage for file upload handling
export async function handleImageUpload(
  file: File,
  contractorName?: string
): Promise<{ original: Buffer; watermarked: Buffer }> {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const originalBuffer = Buffer.from(arrayBuffer)
    
    // Add watermark
    const watermarkedBuffer = await processContractorImage(originalBuffer, contractorName)
    
    return {
      original: originalBuffer,
      watermarked: watermarkedBuffer
    }
  } catch (error) {
    console.error('Error processing image upload:', error)
    throw new Error('Failed to process image upload')
  }
}

// Utility to check if file is a valid image
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}

// Utility to check file size (in bytes)
export function isValidImageSize(file: File, maxSizeInMB: number = 5): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}
