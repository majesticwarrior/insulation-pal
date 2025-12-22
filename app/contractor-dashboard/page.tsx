'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Star, 
  TrendingUp, 
  Bell, 
  Settings,
  FileText,
  Image,
  CreditCard,
  LogOut,
  CheckCircle,
  MapPin,
  Award
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LeadResponseModal } from '@/components/dashboard/LeadResponseModal'
import { ProfileEditForm } from '@/components/dashboard/ProfileEditForm'
import { ImageUploadManager } from '@/components/dashboard/ImageUploadManager'
import { CreditPurchaseManager } from '@/components/dashboard/CreditPurchaseManager'
import { toast } from 'sonner'
import { LeadsList } from './components/LeadsList'
import ErrorBoundary from '@/components/ErrorBoundary'
import '@/lib/error-handler'

interface Lead {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  city: string
  home_size_sqft: number
  areas_needed: string[]
  insulation_types: string[]
  status: string
  cost: number
  created_at: string
}

interface Contractor {
  id: string
  business_name: string
  license_number?: string
  payment_preference?: string
  bio?: string
  founded_year?: number
  employee_count?: number
  business_address?: string
  business_city?: string
  business_state?: string
  business_zip?: string
  credits: number
  certifications?: string[]
  [key: string]: any // For any additional properties
}

function ContractorDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    completedJobs: 0,
    revenue: 0,
    credits: 0,
    rating: 0
  })
  const [ratingSummary, setRatingSummary] = useState({
    compositeScore: 0,
    reviewScore: 0,
    reviewCount: 0,
    responseScore: 0,
    responseSampleSize: 0,
    averageResponseMinutes: null as number | null
  })
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('leads')

  // Handle URL parameters to switch to leads tab if needed
  useEffect(() => {
    const leadAssignmentId = searchParams?.get('leadAssignmentId')
    if (leadAssignmentId) {
      setActiveTab('leads')
    }
  }, [searchParams])

  useEffect(() => {
    console.log('🔍 Dashboard useEffect triggered')
    
    try {
      // Check for admin login in new window
      const tempLoginData = localStorage.getItem('contractor_temp_login')
      if (tempLoginData) {
        console.log('🔐 Found temp login data from admin')
        try {
          const { key, data } = JSON.parse(tempLoginData)
          
          // Store in regular contractor key
          localStorage.setItem('contractor', JSON.stringify(data))
          
          // Clean up temp data
          localStorage.removeItem('contractor_temp_login')
          localStorage.removeItem(key)
          
          console.log('✅ Admin login data transferred successfully')
        } catch (e) {
          console.error('Error parsing temp login data:', e)
        }
      }
      
      const contractorData = localStorage.getItem('contractor')
      console.log('📱 localStorage contractor data:', contractorData)
      
      if (!contractorData) {
        console.log('❌ No contractor data in localStorage, redirecting to login')
        // Show a message to the user before redirecting
        toast.info('Please log in to access your dashboard', {
          description: 'You will be redirected to the login page.'
        })
        setTimeout(() => {
          router.push('/contractor-login')
        }, 2000)
        return
      }

      const parsedContractor = JSON.parse(contractorData)
      console.log('👤 Parsed contractor from localStorage:', parsedContractor)
      console.log('💳 Contractor credits from localStorage:', parsedContractor?.credits)
      
      // Validate contractor data before setting
      if (parsedContractor && parsedContractor.id) {
        setContractor(parsedContractor)
        loadDashboardData(parsedContractor.id)
      } else {
        throw new Error('Invalid contractor data structure')
      }

      // Check for payment success in URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const paymentStatus = urlParams.get('payment')
      const isDemo = urlParams.get('demo')
      
      if (paymentStatus === 'success') {
        if (isDemo === 'true') {
          toast.success('Demo payment completed successfully!', {
            description: 'Credits have been added to your account.'
          })
        } else {
          toast.success('Payment completed successfully!', {
            description: 'Credits have been added to your account.'
          })
        }
        // Refresh the page to update credits
        setTimeout(() => {
          window.location.href = '/contractor-dashboard'
        }, 2000)
      } else if (paymentStatus === 'cancelled') {
        toast.info('Payment was cancelled.', {
          description: 'You can try again anytime.'
        })
      }
    } catch (error) {
      console.error('❌ Error parsing contractor data:', error)
      toast.error('Invalid session data. Please log in again.')
      localStorage.removeItem('contractor')
      router.push('/contractor-login')
    }
  }, [router])

  const fetchContractorRating = async (contractorIdValue: string) => {
    try {
      const response = await fetch(`/api/contractors/${contractorIdValue}/rating`)

      if (!response.ok) {
        console.error('❌ Failed to fetch contractor rating:', response.status)
        return
      }

      const payload = await response.json()

      if (!payload?.success || !payload.data) {
        console.error('❌ Invalid rating payload:', payload)
        return
      }

      setRatingSummary(payload.data)
      setStats((previous) => ({
        ...previous,
        rating: payload.data.compositeScore || previous.rating
      }))
    } catch (error) {
      console.error('❌ Error fetching contractor rating:', error)
    }
  }

  const formatResponseTime = (minutes: number | null) => {
    if (minutes === null) {
      return 'No data yet'
    }

    if (minutes < 60) {
      return `${Math.max(1, Math.round(minutes))} min`
    }

    if (minutes < 1440) {
      const hours = Math.round(minutes / 60)
      return `${hours} hr${hours === 1 ? '' : 's'}`
    }

    const days = Math.round(minutes / 1440)
    return `${days} day${days === 1 ? '' : 's'}`
  }

  const loadDashboardData = async (contractorIdParam?: string) => {
    try {
      console.log('🔄 loadDashboardData called with contractorId:', contractorIdParam)
      
      // Use the contractor ID from sample data for demo purposes
      // In production, this would come from authentication
      const contractorId = contractorIdParam || '2eb88780-76ae-4bb9-a99e-70e8cf9d3ced' // Koala Insulation from your database
      console.log('🎯 Using contractor ID:', contractorId)
      
      // First, fetch fresh contractor data to get updated credits
      console.log('📡 Fetching contractor data from Supabase...')
      let contractorData: any
      let contractorError: any
      try {
        const result = await (supabase as any)
          .from('contractors')
          .select('*')
          .eq('id', contractorId)
          .single()
        contractorData = result.data
        contractorError = result.error
      } catch (error) {
        console.error('❌ Error fetching contractor data:', error)
        contractorError = error
      }

      console.log('📥 Contractor data response:', { contractorData, contractorError })

      if (contractorError) {
        console.error('❌ Error fetching contractor data:', contractorError)
      } else if (contractorData) {
        console.log('✅ Fresh contractor data from database:', contractorData)
        console.log('💳 Fresh credits from database:', contractorData.credits)
        
        // Update contractor state with fresh data
        setContractor(contractorData)
        // Update localStorage with fresh data
        localStorage.setItem('contractor', JSON.stringify(contractorData))
        console.log('📱 Updated localStorage with fresh contractor data')
        await fetchContractorRating(contractorData.id)
      } else {
        console.log('⚠️ No contractor data returned from database')
      }
      
      // TEMPORARY: Skip lead assignments query to fix 500 error and focus on credits
      console.log('🔍 Skipping lead assignments query temporarily to fix 500 error')
      console.log('💡 Focus: Get contractor data and credits working first')
      // Note: Leads are now handled by the LeadsList component
      console.log('📋 Lead data is now handled by LeadsList component')

      // Calculate stats (simplified since leads are handled separately)
      const activeLeads = 0  // Will be calculated by LeadsList component
      const completedJobs = 0  // Will be calculated by LeadsList component  
      const revenue = 0  // Will be calculated separately

      const finalCredits = contractorData?.credits || contractor?.credits || 0
      console.log('📊 Calculating stats:')
      console.log('💳 Credits from contractorData:', contractorData?.credits)
      console.log('💳 Credits from contractor state:', contractor?.credits)
      console.log('💳 Final credits value:', finalCredits)

      setStats((previous) => ({
        totalLeads: 0, // Will be updated by LeadsList component
        activeLeads,
        completedJobs,
        revenue,
        credits: finalCredits,
        rating:
          previous.rating ||
          ratingSummary.compositeScore ||
          contractorData?.average_rating ||
          0
      }))

      console.log('📈 Stats updated:', {
        totalLeads: 0,
        activeLeads,
        completedJobs,
        revenue,
        credits: finalCredits,
        rating:
          ratingSummary.compositeScore ||
          contractorData?.average_rating ||
          0
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('contractor')
    router.push('/contractor-login')
  }

  const handleViewDetails = (lead: Lead) => {
    toast.info(`Viewing details for ${lead.customer_name}'s lead`, {
      description: `${lead.areas_needed.join(', ')} - ${lead.home_size_sqft} sq ft in ${lead.city}`
    })
  }

  const handleRespond = (lead: Lead) => {
    setSelectedLead(lead)
    setIsResponseModalOpen(true)
  }

  const handleLeadResponse = (leadId: string, response: 'accept' | 'decline') => {
    // Update the lead in the local state
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: response === 'accept' ? 'accepted' : 'declined' }
        : lead
    ))

    // Refresh the dashboard data
    if (contractor) {
      loadDashboardData(contractor.id)
    }
  }

  // Function to refresh contractor data (useful for credit updates)
  const refreshContractorData = async () => {
    if (contractor?.id) {
      await loadDashboardData(contractor.id)
    }
  }

  const handleUploadImages = () => {
    toast.info('Image Upload Coming Soon!', {
      description: 'Upload and manage your project photos to showcase your work to potential customers.'
    })
  }


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      sent: 'default',
      viewed: 'secondary',
      responded: 'outline',
      hired: 'default'
    }
    
    const colors: Record<string, string> = {
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-purple-100 text-purple-800',
      hired: 'bg-green-100 text-green-800'
    }

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4768] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[#0a4768] mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Please wait while we load your contractor information.</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!contractor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0a4768] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contractor dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0a4768] truncate">
              Welcome back, {contractor.business_name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your leads and grow your business</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notify</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex-1 sm:flex-none text-xs sm:text-sm">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Leads</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.activeLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Completed Jobs</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Credits</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.credits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-2">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {stats.rating ? stats.rating.toFixed(1) : '—'}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {ratingSummary.reviewCount} reviews · Avg response {formatResponseTime(ratingSummary.averageResponseMinutes)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0">
            <TabsTrigger value="leads" className="text-xs sm:text-sm">Leads</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="images" className="text-xs sm:text-sm">Images</TabsTrigger>
            <TabsTrigger value="packages" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Lead Packages</span>
              <span className="sm:hidden">Packages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {contractor?.id && <LeadsList contractorId={contractor.id} contractorCredits={contractor.credits} />}
          </TabsContent>

          <TabsContent value="profile">
{contractor && (
              <ProfileEditForm 
                contractor={contractor} 
                onUpdate={(updatedContractor) => {
                  console.log('📢 Dashboard onUpdate callback received:', updatedContractor)
                  console.log('🔄 Updating contractor state...')
                  setContractor(updatedContractor)
                  console.log('💾 Updating localStorage...')
                  localStorage.setItem('contractor', JSON.stringify(updatedContractor))
                  console.log('✅ Dashboard contractor state and localStorage updated')
                  console.log('🔍 New localStorage value:', localStorage.getItem('contractor'))
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="images">
            <ImageUploadManager contractorId={contractor?.id || '2eb88780-76ae-4bb9-a99e-70e8cf9d3ced'} />
          </TabsContent>

          <TabsContent value="packages">
            <CreditPurchaseManager 
              contractorId={contractor?.id || '2eb88780-76ae-4bb9-a99e-70e8cf9d3ced'}
              currentCredits={stats.credits}
              onCreditsUpdate={(newCredits) => {
                setStats(prev => ({ ...prev, credits: newCredits }))
                // Also update contractor object if needed
                if (contractor) {
                  setContractor((prev: Contractor | null) => prev ? { ...prev, credits: newCredits } : null)
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />

      {/* Lead Response Modal */}
      <LeadResponseModal
        lead={selectedLead}
        isOpen={isResponseModalOpen}
        onClose={() => {
          setIsResponseModalOpen(false)
          setSelectedLead(null)
        }}
        onResponse={handleLeadResponse}
        contractorId={contractor?.id || '2eb88780-76ae-4bb9-a99e-70e8cf9d3ced'}
      />
      </main>
    </ErrorBoundary>
  )
}

export default function ContractorDashboard() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a4768] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[#0a4768] mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Please wait while we load your contractor information.</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <ContractorDashboardContent />
    </Suspense>
  )
}
