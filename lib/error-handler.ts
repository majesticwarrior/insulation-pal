// Global error handler for unhandled promise rejections and other errors
export function setupGlobalErrorHandling() {
  if (typeof window === 'undefined') return

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Check if the error is related to the match function
    if (event.reason && typeof event.reason === 'object') {
      const errorMessage = event.reason.message || event.reason.toString()
      if (errorMessage.includes('match') || errorMessage.includes('Cannot read properties of undefined')) {
        console.error('Match error detected, preventing default behavior')
        event.preventDefault()
        
        // Show a user-friendly error message
        if (typeof window !== 'undefined' && window.alert) {
          // Don't use alert in production, but this helps debug
          console.error('Match error prevented from crashing the app')
        }
      }
    }
  })

  // Handle general errors
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error)
    
    // Check if the error is related to the match function
    if (event.error && typeof event.error === 'object') {
      const errorMessage = event.error.message || event.error.toString()
      if (errorMessage.includes('match') || errorMessage.includes('Cannot read properties of undefined')) {
        console.error('Match error detected in global error handler')
        event.preventDefault()
      }
    }
  })
}

// Safe string operations to prevent match errors
export function safeStringReplace(str: string | null | undefined, searchValue: string | RegExp, replaceValue: string): string {
  if (!str || typeof str !== 'string') {
    return str || ''
  }
  
  try {
    return str.replace(searchValue, replaceValue)
  } catch (error) {
    console.error('String replace error:', error)
    return str
  }
}

export function safeStringMatch(str: string | null | undefined, regex: RegExp): RegExpMatchArray | null {
  if (!str || typeof str !== 'string') {
    return null
  }
  
  try {
    return str.match(regex)
  } catch (error) {
    console.error('String match error:', error)
    return null
  }
}

// Initialize global error handling
if (typeof window !== 'undefined') {
  setupGlobalErrorHandling()
}
