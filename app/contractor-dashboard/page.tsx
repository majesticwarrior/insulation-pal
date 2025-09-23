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

  const loadDashboardData = async (contractorId: string) => {
    try {
      // Check if we're in demo mode
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

      if (isDemoMode) {
        // Demo mode - create mock data with static dates to avoid hydration issues
        const mockLeads: Lead[] = [
          {
            id: 'demo-lead-1',
            customer_name: 'John Smith',
            customer_email: 'john.smith@email.com',
            customer_phone: '(602) 555-1234',
            city: 'Phoenix',
            home_size_sqft: 2500,
            areas_needed: ['Attic', 'Walls'],
            insulation_types: ['Spray Foam'],
            status: 'sent',
            cost: 20,
            created_at: '2024-09-21T10:30:00.000Z'
          },
          {
            id: 'demo-lead-2',
            customer_name: 'Sarah Johnson',
            customer_email: 'sarah.j@email.com',
            customer_phone: '(602) 555-5678',
            city: 'Scottsdale',
            home_size_sqft: 3200,
            areas_needed: ['Attic', 'Basement'],
            insulation_types: ['Blown-in', 'Roll & Batt'],
            status: 'viewed',
            cost: 20,
            created_at: '2024-09-18T14:15:00.000Z'
          },
          {
            id: 'demo-lead-3',
            customer_name: 'Mike Davis',
            customer_email: 'mike.davis@email.com',
            customer_phone: '(602) 555-9101',
            city: 'Mesa',
            home_size_sqft: 1800,
            areas_needed: ['Crawl Space'],
            insulation_types: ['Foam Board'],
            status: 'hired',
            cost: 20,
            created_at: '2024-09-13T09:45:00.000Z'
          },
          {
            id: 'demo-lead-4',
            customer_name: 'Lisa Chen',
            customer_email: 'lisa.chen@email.com',
            customer_phone: '(602) 555-1122',
            city: 'Tempe',
            home_size_sqft: 2800,
            areas_needed: ['Attic', 'Garage'],
            insulation_types: ['Spray Foam', 'Blown-in'],
            status: 'hired',
            cost: 20,
            created_at: '2024-09-08T16:20:00.000Z'
          }
        ]

        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800))

        setLeads(mockLeads)

        // Calculate stats
        const activeLeads = mockLeads.filter(lead => lead.status === 'sent' || lead.status === 'viewed').length
        const completedJobs = mockLeads.filter(lead => lead.status === 'hired').length
        const revenue = mockLeads
          .filter(lead => lead.status === 'hired')
          .reduce((sum, lead) => sum + 850, 0) // Simulate job revenue

        setStats({
          totalLeads: mockLeads.length,
          activeLeads,
          completedJobs,
          revenue,
          credits: contractor?.credits || 0,
          rating: 4.8
        })

        return
      }

      // Production mode - use Supabase
      const { data: leadsData, error: leadsError } = await supabase
        .from('lead_assignments')
        .select(`
          *,
          leads (*)
        `)
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false })

      if (leadsError) throw leadsError

      const formattedLeads = leadsData?.map(assignment => ({
        id: assignment.lead_id,
        customer_name: assignment.leads.customer_name,
        customer_email: assignment.leads.customer_email,
        customer_phone: assignment.leads.customer_phone,
        city: assignment.leads.city,
        home_size_sqft: assignment.leads.home_size_sqft,
        areas_needed: assignment.leads.areas_needed,
        insulation_types: assignment.leads.insulation_types,
        status: assignment.status,
        cost: assignment.cost,
        created_at: assignment.created_at
      })) || []

      setLeads(formattedLeads)

      // Calculate stats
      const activeLeads = formattedLeads.filter(lead => lead.status === 'sent' || lead.status === 'viewed').length
      const completedJobs = formattedLeads.filter(lead => lead.status === 'hired').length
      const revenue = formattedLeads
        .filter(lead => lead.status === 'hired')
        .reduce((sum, lead) => sum + lead.cost, 0)

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
    toast.success(`Responding to ${lead.customer_name}'s lead`, {
      description: 'Response functionality will be available soon. You can contact them directly via phone or email.'
    })
  }

  const handleUploadImages = () => {
    toast.info('Image Upload Coming Soon!', {
      description: 'Upload and manage your project photos to showcase your work to potential customers.'
    })
  }

  const handleBuyCredits = () => {
    toast.info('Credit Purchase Coming Soon!', {
      description: 'Secure payment integration for lead credits will be available soon. Each lead costs $20.'
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
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>
                  Manage your business information and service offerings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Logo and Basic Info */}
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center">Upload Logo</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Business Name</label>
                          <p className="text-gray-900 font-semibold">{contractor.business_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">County</label>
                          <p className="text-gray-900">{contractor.county}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">License Number</label>
                          <p className="text-gray-900">{contractor.license_number || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">BBB Accredited</label>
                          <div className="flex items-center">
                            <p className="text-gray-900">{contractor.bbb_accredited ? 'Yes' : 'No'}</p>
                            {contractor.bbb_accredited && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                BBB
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Us */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">About Us</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">{contractor.about || 'No description provided yet.'}</p>
                    </div>
                  </div>

                  {/* Services Offered */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-3">Services Offered</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Attic Insulation', 'Wall Insulation', 'Basement Insulation', 'Crawl Space Insulation', 'Garage Insulation'].map((service, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Types of Insulation Offered */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-3">Types of Insulation Offered</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Blown-in Insulation', 'Spray Foam Insulation', 'Roll & Batt Insulation', 'Foam Board Insulation', 'Radiant Barrier Insulation'].map((type, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-700">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-3">Service Areas</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Phoenix', 'Scottsdale', 'Mesa', 'Chandler', 'Gilbert', 'Tempe', 'Glendale', 'Peoria'].map((area, index) => (
                        <div key={index} className="flex items-center p-2 bg-yellow-50 rounded">
                          <MapPin className="w-3 h-3 text-yellow-600 mr-1" />
                          <span className="text-xs text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => toast.info('Profile editing functionality coming soon!')}
                    className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Project Gallery</CardTitle>
                <CardDescription>
                  Upload and manage photos of your completed projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No images uploaded yet</p>
                  <Button 
                    className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                    onClick={() => handleUploadImages()}
                  >
                    Upload Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Credits & Billing</CardTitle>
                <CardDescription>
                  Manage your lead credits and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-blue-900">Current Credits</h3>
                        <p className="text-blue-700">You have {stats.credits} credits remaining</p>
                      </div>
                      <Button 
                        className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                        onClick={() => handleBuyCredits()}
                      >
                        Buy More Credits
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Lead Pricing</h4>
                    <p className="text-gray-600 mb-4">Each qualified lead costs $20. Credits are deducted when leads are assigned to you.</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Regular leads</span>
                        <span className="font-medium">$20 per lead</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exclusive leads</span>
                        <span className="font-medium">$40 per lead</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </main>
  )
}
