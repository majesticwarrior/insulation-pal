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
  DollarSign, 
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

export default function ContractorDashboard() {
  const router = useRouter()
  const [contractor, setContractor] = useState<any>(null)
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
    const contractorData = localStorage.getItem('contractor')
    if (!contractorData) {
      router.push('/contractor-login')
      return
    }

    const parsedContractor = JSON.parse(contractorData)
    setContractor(parsedContractor)
    loadDashboardData(parsedContractor.id)
  }, [router])

  const loadDashboardData = async (contractorIdParam?: string) => {
    try {
      // Use the contractor ID from sample data for demo purposes
      // In production, this would come from authentication
      const contractorId = contractorIdParam || '33333333-3333-3333-3333-333333333331' // Elite Insulation Services
      
      // Fetch real data from Supabase
      const { data: leadsData, error: leadsError } = await (supabase as any)
        .from('lead_assignments')
        .select(`
          *,
          leads (*)
        `)
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false })

      if (leadsError) throw leadsError

      const formattedLeads = leadsData?.map((assignment: any) => ({
        id: assignment.lead_id,
        customer_name: assignment.leads?.customer_name,
        customer_email: assignment.leads?.customer_email,
        customer_phone: assignment.leads?.customer_phone,
        city: assignment.leads?.city,
        home_size_sqft: assignment.leads?.home_size_sqft,
        areas_needed: assignment.leads?.areas_needed,
        insulation_types: assignment.leads?.insulation_types,
        status: assignment.status,
        cost: assignment.cost,
        created_at: assignment.created_at
      })) || []

      setLeads(formattedLeads)

      // Calculate stats
      const activeLeads = formattedLeads.filter((lead: any) => lead.status === 'sent' || lead.status === 'viewed').length
      const completedJobs = formattedLeads.filter((lead: any) => lead.status === 'hired').length
      const revenue = formattedLeads
        .filter((lead: any) => lead.status === 'hired')
        .reduce((sum: number, lead: any) => sum + lead.cost, 0)

      setStats({
        totalLeads: formattedLeads.length,
        activeLeads,
        completedJobs,
        revenue,
        credits: contractor?.credits || 0,
        rating: 4.8 // This would come from reviews
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
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>
                  Manage your incoming leads and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No leads yet. We'll notify you when new leads come in!
                    </p>
                  ) : (
                    leads.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {lead.customer_name || 'Customer'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {lead.city} • {lead.home_size_sqft} sq ft
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(lead.status)}
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(lead.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Areas needed:</span>
                            <p className="text-gray-600">
                              {lead.areas_needed.join(', ')}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Insulation types:</span>
                            <p className="text-gray-600">
                              {lead.insulation_types.join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              Lead cost: {formatCurrency(lead.cost)}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(lead)}
                            >
                              View Details
                            </Button>
                            {lead.status === 'sent' && (
                              <Button 
                                size="sm" 
                                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                                onClick={() => handleRespond(lead)}
                              >
                                Respond
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
{contractor && (
              <ProfileEditForm 
                contractor={contractor} 
                onUpdate={(updatedContractor) => {
                  setContractor(updatedContractor)
                  // Update localStorage as well
                  localStorage.setItem('contractor', JSON.stringify(updatedContractor))
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
                  setContractor((prev: typeof contractor) => prev ? { ...prev, credits: newCredits } : null)
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
