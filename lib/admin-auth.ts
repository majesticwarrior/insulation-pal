import { supabase } from '@/lib/supabase'

export interface AdminCredentials {
  username: string
  password: string
}

export interface AdminSession {
  id: string
  username: string
  isAuthenticated: boolean
}

// Hardcoded admin credentials as requested
const ADMIN_CREDENTIALS = {
  username: 'InsulationPalAdmin',
  password: 'IUt_)94&^%2#4r*-f45G'
}

export async function authenticateAdmin(credentials: AdminCredentials): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  try {
    // Check credentials
    if (credentials.username !== ADMIN_CREDENTIALS.username || credentials.password !== ADMIN_CREDENTIALS.password) {
      return {
        success: false,
        error: 'Invalid admin credentials'
      }
    }

    // Create admin session
    const session: AdminSession = {
      id: 'admin-session',
      username: credentials.username,
      isAuthenticated: true
    }

    return {
      success: true,
      session
    }
  } catch (error) {
    console.error('Admin authentication error:', error)
    return {
      success: false,
      error: 'Authentication failed'
    }
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionData = localStorage.getItem('adminSession')
    if (!sessionData) return null
    
    return JSON.parse(sessionData)
  } catch {
    return null
  }
}

export function setAdminSession(session: AdminSession): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('adminSession', JSON.stringify(session))
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('adminSession')
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession()
  return session?.isAuthenticated === true
}
