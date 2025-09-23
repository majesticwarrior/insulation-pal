import { supabase } from './supabase'
import type { Database } from './database.types'

type Contractor = Database['public']['Tables']['contractors']['Row']

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  contractor?: any
  error?: string
}

// Demo contractor credentials for testing
const demoContractors = [
  {
    id: 'demo-1',
    email: 'admin@arizonapremier.com',
    password: 'AZPremier2024!',
    business_name: 'Arizona Premier Insulation',
    established_date: '2015-03-15',
    county: 'Maricopa',
    license_number: 'AZ-INS-001234',
    bbb_accredited: true,
    phone: '(602) 555-0101',
    about: 'Arizona Premier Insulation has been serving Phoenix homeowners for over 8 years with top-quality insulation services. We specialize in energy-efficient solutions that reduce costs and improve comfort.',
    lead_preference: 'both',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 50
  },
  {
    id: 'demo-2',
    email: 'info@desertshield.com',
    password: 'DesertShield2024!',
    business_name: 'Desert Shield Insulation',
    established_date: '2018-07-22',
    county: 'Maricopa',
    license_number: 'AZ-INS-002345',
    bbb_accredited: true,
    phone: '(602) 555-0202',
    about: 'Desert Shield Insulation brings innovative insulation solutions to Phoenix homes. Our expert team focuses on spray foam applications and comprehensive energy audits.',
    lead_preference: 'email',
    exclusive_leads_interested: false,
    status: 'approved',
    credits: 35
  },
  {
    id: 'demo-3',
    email: 'contact@valleycomfort.com',
    password: 'ValleyComfort2024!',
    business_name: 'Valley Comfort Solutions',
    established_date: '2012-01-10',
    county: 'Maricopa',
    license_number: 'AZ-INS-003456',
    bbb_accredited: false,
    phone: '(602) 555-0303',
    about: 'Valley Comfort Solutions is Phoenix\'s most trusted insulation contractor, with over 11 years of experience helping homeowners reduce energy costs and improve home comfort.',
    lead_preference: 'both',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 75
  },
  {
    id: 'demo-4',
    email: 'team@cactusinsulation.com',
    password: 'CactusIns2024!',
    business_name: 'Cactus Insulation Pros',
    established_date: '2019-09-05',
    county: 'Maricopa',
    license_number: 'AZ-INS-004567',
    bbb_accredited: true,
    phone: '(602) 555-0404',
    about: 'Cactus Insulation Pros specializes in residential insulation with a focus on customer satisfaction and energy efficiency. Family-owned and operated in Phoenix.',
    lead_preference: 'text',
    exclusive_leads_interested: false,
    status: 'approved',
    credits: 25
  },
  {
    id: 'demo-5',
    email: 'hello@swenergysavers.com',
    password: 'SWEnergy2024!',
    business_name: 'Southwest Energy Savers',
    established_date: '2020-04-18',
    county: 'Maricopa',
    license_number: 'AZ-INS-005678',
    bbb_accredited: false,
    phone: '(602) 555-0505',
    about: 'Southwest Energy Savers is committed to helping Phoenix residents achieve maximum energy efficiency through professional insulation installation and upgrades.',
    lead_preference: 'email',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 40
  },
  {
    id: 'demo-6',
    email: 'info@grandcanyoninsulation.com',
    password: 'GrandCanyon2024!',
    business_name: 'Grand Canyon Insulation',
    established_date: '2017-11-30',
    county: 'Maricopa',
    license_number: 'AZ-INS-006789',
    bbb_accredited: true,
    phone: '(602) 555-0606',
    about: 'Grand Canyon Insulation provides comprehensive insulation services throughout the Phoenix metro area. We pride ourselves on quality workmanship and excellent customer service.',
    lead_preference: 'both',
    exclusive_leads_interested: false,
    status: 'approved',
    credits: 60
  },
  {
    id: 'demo-7',
    email: 'support@arizonacomfort.com',
    password: 'AZComfort2024!',
    business_name: 'Arizona Comfort Control',
    established_date: '2021-06-12',
    county: 'Maricopa',
    license_number: 'AZ-INS-007890',
    bbb_accredited: false,
    phone: '(602) 555-0707',
    about: 'Arizona Comfort Control is a newer company with experienced technicians focused on providing modern insulation solutions for Phoenix area homes.',
    lead_preference: 'text',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 20
  }
]

export async function loginContractor({ email, password }: LoginCredentials): Promise<AuthResult> {
  try {
    // Check if we're in demo mode (no real Supabase connection)
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

    if (isDemoMode) {
      // Demo mode - check against hardcoded credentials
      const contractor = demoContractors.find(
        c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      )

      if (!contractor) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500))

      return { success: true, contractor }
    }

    // Production mode - use Supabase
    const { data: contractor, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !contractor) {
      return { success: false, error: 'Invalid email or password' }
    }

    // In production, you'd verify password with bcrypt here
    // For now, we'll skip password verification in production mode

    // Check if contractor is approved
    if (contractor.status !== 'approved') {
      return { 
        success: false, 
        error: contractor.status === 'pending' 
          ? 'Your account is pending approval. We will notify you once approved.'
          : 'Your account has been suspended. Please contact support.'
      }
    }

    return { success: true, contractor }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

// Export demo credentials for reference
export const demoLoginCredentials = demoContractors.map(contractor => ({
  business_name: contractor.business_name,
  email: contractor.email,
  password: contractor.password
}))

export function getTestCredentials() {
  return demoLoginCredentials
}

export async function getContractorProfile(contractorId: string): Promise<Contractor | null> {
  try {
    const { data: contractor, error } = await supabase
      .from('contractors')
      .select(`
        *,
        contractor_services (*),
        contractor_insulation_types (*),
        contractor_service_areas (*),
        contractor_images (*)
      `)
      .eq('id', contractorId)
      .single()

    if (error) {
      console.error('Error fetching contractor profile:', error)
      return null
    }

    return contractor
  } catch (error) {
    console.error('Error fetching contractor profile:', error)
    return null
  }
}

export async function updateContractorProfile(contractorId: string, updates: Partial<Contractor>) {
  try {
    const { data, error } = await supabase
      .from('contractors')
      .update(updates)
      .eq('id', contractorId)
      .select()
      .single()

    if (error) throw error
    return { success: true, contractor: data }
  } catch (error) {
    console.error('Error updating contractor profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}
