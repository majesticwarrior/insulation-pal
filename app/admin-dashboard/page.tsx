'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated, clearAdminSession } from '@/lib/admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Shield, Users, Clock, CheckCircle, XCircle, Eye, DollarSign, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Contractor {
  id: string
  business_name: string
  email: string
  license_number: string
  status: string
  credits: number
  created_at: string
  contact_phone: string
  business_city: string
  business_state: string
  total_reviews: number
  average_rating: number
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    suspended: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check admin authentication
    if (!isAdminAuthenticated()) {
      router.push('/admin-login')
      return
    }

    loadContractors()
  }, [router])

  const loadContractors = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all contractors
      const { data: contractorsData, error } = await (supabase as any)
        .from('contractors')
        .select(`
          id,
          business_name,
          email,
          license_number,
          status,
          credits,
          created_at,
          contact_phone,
          business_city,
          business_state,
          total_reviews,
          average_rating
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setContractors(contractorsData || [])

      // Calculate stats
      const totalContractors = contractorsData?.length || 0
      const pending = contractorsData?.filter((c: any) => c.status === 'pending')?.length || 0
      const approved = contractorsData?.filter((c: any) => c.status === 'approved')?.length || 0
      const suspended = contractorsData?.filter((c: any) => c.status === 'suspended')?.length || 0

      setStats({
        total: totalContractors,
        pending,
        approved,
        suspended
      })

    } catch (error) {
      console.error('Error loading contractors:', error)
      toast.error('Failed to load contractor data')
    } finally {
      setIsLoading(false)
    }
  }

  const updateContractorStatus = async (contractorId: string, newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from('contractors')
        .update({ status: newStatus })
        .eq('id', contractorId)

      if (error) throw error

      toast.success(`Contractor ${newStatus === 'approved' ? 'approved' : newStatus}`)
      loadContractors() // Reload data
    } catch (error) {
      console.error('Error updating contractor status:', error)
      toast.error('Failed to update contractor status')
    }
  }

  const updateCredits = async (contractorId: string, businessName: string, currentCredits: number) => {
    const newCredits = window.prompt(
      `Update credits for "${businessName}"\n\nCurrent credits: ${currentCredits}\nEnter new credit amount:`,
      currentCredits.toString()
    )

    if (newCredits === null) return // User cancelled
    
    const creditAmount = parseInt(newCredits)
    if (isNaN(creditAmount) || creditAmount < 0) {
      toast.error('Please enter a valid number (0 or greater)')
      return
    }

    try {
      const { error } = await (supabase as any)
        .from('contractors')
        .update({ credits: creditAmount })
        .eq('id', contractorId)

      if (error) throw error

      toast.success(`Credits updated to ${creditAmount} for "${businessName}"`)
      loadContractors() // Reload data
    } catch (error) {
      console.error('Error updating credits:', error)
      toast.error('Failed to update credits')
    }
  }

  const deleteContractor = async (contractorId: string, businessName: string) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${businessName}"?\n\n` +
      `This will:\n` +
      `• Remove the contractor from the database\n` +
      `• Delete all associated data\n` +
      `• Allow them to re-register with the same email\n\n` +
      `This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      // First, get the user_id to delete from users table too
      const { data: contractor } = await (supabase as any)
        .from('contractors')
        .select('user_id')
        .eq('id', contractorId)
        .single()

      if (contractor?.user_id) {
        // Delete from contractors table (will cascade to related tables)
        const { error: contractorError } = await (supabase as any)
          .from('contractors')
          .delete()
          .eq('id', contractorId)

        if (contractorError) throw contractorError

        // Delete from users table
        const { error: userError } = await (supabase as any)
          .from('users')
          .delete()
          .eq('id', contractor.user_id)

        if (userError) throw userError
      }

      toast.success(`Contractor "${businessName}" has been permanently deleted`)
      loadContractors() // Reload data
    } catch (error) {
      console.error('Error deleting contractor:', error)
      toast.error('Failed to delete contractor')
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    router.push('/admin-login')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>
      case 'suspended':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Suspended</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-[#0a4768] mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-[#0a4768] mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-[#0a4768]">Admin Dashboard</h1>
                <p className="text-gray-600">InsulationPal Management Portal</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Contractors</p>
                  <p className="text-2xl font-bold text-[#0a4768]">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="contractors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="contractors">Contractor Management</TabsTrigger>
            <TabsTrigger value="pending">Pending Approvals ({stats.pending})</TabsTrigger>
          </TabsList>

          <TabsContent value="contractors">
            <Card>
              <CardHeader>
                <CardTitle>All Contractors</CardTitle>
                <CardDescription>
                  Manage contractor profiles, billing, and account status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>License #</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractors.map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">
                            {contractor.business_name}
                          </TableCell>
                          <TableCell>{contractor.email}</TableCell>
                          <TableCell>{contractor.license_number || 'N/A'}</TableCell>
                          <TableCell>
                            {contractor.business_city && contractor.business_state
                              ? `${contractor.business_city}, ${contractor.business_state}`
                              : 'Not specified'
                            }
                          </TableCell>
                          <TableCell>{getStatusBadge(contractor.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                {contractor.credits || 0} credits
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {contractor.total_reviews || 0} 
                            {contractor.average_rating && (
                              <span className="text-sm text-gray-500 ml-1">
                                ({contractor.average_rating.toFixed(1)} ⭐)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 flex-wrap gap-y-2">
                              {contractor.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                              )}
                              {contractor.status === 'approved' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateContractorStatus(contractor.id, 'suspended')}
                                >
                                  Suspend
                                </Button>
                              )}
                              {contractor.status === 'suspended' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Reactivate
                                </Button>
                              )}
                              {contractor.status === 'rejected' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCredits(contractor.id, contractor.business_name, contractor.credits || 0)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                Edit Credits
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteContractor(contractor.id, contractor.business_name)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Contractor Approvals</CardTitle>
                <CardDescription>
                  Review and approve new contractor registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>License #</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractors
                        .filter(contractor => contractor.status === 'pending')
                        .map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">
                            {contractor.business_name}
                          </TableCell>
                          <TableCell>{contractor.email}</TableCell>
                          <TableCell>{contractor.contact_phone || 'N/A'}</TableCell>
                          <TableCell>{contractor.license_number || 'N/A'}</TableCell>
                          <TableCell>
                            {new Date(contractor.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 flex-wrap gap-y-2">
                              <Button
                                size="sm"
                                onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateContractorStatus(contractor.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCredits(contractor.id, contractor.business_name, contractor.credits || 0)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                Edit Credits
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteContractor(contractor.id, contractor.business_name)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {contractors.filter(contractor => contractor.status === 'pending').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No pending contractor approvals
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
