'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ContractorDashboard() {
  const router = useRouter()
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    completedJobs: 0,
    revenue: 0,
    credits: 0,
    rating: 4.8
  })
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)

  useEffect(() => {
    console.log('🔍 Dashboard useEffect triggered')
    const contractorData = localStorage.getItem('contractor')
    console.log('📱 localStorage contractor data:', contractorData)
    
    if (!contractorData) {
      console.log('❌ No contractor data in localStorage, redirecting to login')
      router.push('/contractor-login')
      return
    }

    const parsedContractor = JSON.parse(contractorData)
    console.log('👤 Parsed contractor from localStorage:', parsedContractor)
    console.log('💳 Contractor credits from localStorage:', parsedContractor.credits)
    
    setContractor(parsedContractor)
    loadDashboardData(parsedContractor.id)
  }, [router])

  const loadDashboardData = async (contractorIdParam?: string) => {
    try {
      console.log('🔄 loadDashboardData called with contractorId:', contractorIdParam)
      
      // Use the contractor ID from sample data for demo purposes
      // In production, this would come from authentication
      const contractorId = contractorIdParam || '33333333-3333-3333-3333-333333333331' // Elite Insulation Services
      console.log('🎯 Using contractor ID:', contractorId)
      
      // First, fetch fresh contractor data to get updated credits
      console.log('📡 Fetching contractor data from Supabase...')
      const { data: contractorData, error: contractorError } = await (supabase as any)
        .from('contractors')
        .select('*')
        .eq('id', contractorId)
        .single()

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

      setStats({
        totalLeads: 0, // Will be updated by LeadsList component
        activeLeads,
        completedJobs,
        revenue,
        credits: finalCredits,
        rating: 4.8 // This would come from reviews
      })

      console.log('📈 Stats updated:', {
        totalLeads: 0,
        activeLeads,
        completedJobs,
        revenue,
        credits: finalCredits,
        rating: 4.8
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
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!contractor) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0a4768]">
              Welcome back, {contractor.business_name}
            </h1>
            <p className="text-gray-600">Manage your leads and grow your business</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Credits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.credits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {contractor?.id && <LeadsList contractorId={contractor.id} />}
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
            <ImageUploadManager contractorId={contractor?.id || '33333333-3333-3333-3333-333333333331'} />
          </TabsContent>

          <TabsContent value="billing">
            <CreditPurchaseManager 
              contractorId={contractor?.id || '33333333-3333-3333-3333-333333333331'}
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
        contractorId={contractor?.id || '33333333-3333-3333-3333-333333333331'}
      />
    </main>
  )
}
