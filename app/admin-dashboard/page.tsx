'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated, clearAdminSession } from '@/lib/admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Users, Clock, CheckCircle, XCircle, Eye, DollarSign, LogOut, Edit, Plus, Star, UserCog, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'

interface Contractor {
  id: string
  user_id?: string
  business_name: string
  email: string
  license_number?: string
  status: string
  credits: number
  created_at: string
  contact_phone?: string
  contact_email?: string
  business_address?: string
  business_city?: string
  business_state?: string
  business_zip?: string
  total_reviews: number
  average_rating: number
  total_completed_projects?: number
  profile_image?: string
  bio?: string
  founded_year?: number
  employee_count?: number
  license_verified?: boolean
  insurance_verified?: boolean
  certifications?: string[]
}

interface Review {
  id?: string
  contractor_id: string
  customer_name: string
  customer_email?: string
  customer_image?: string
  rating: number
  title?: string
  comment?: string
  service_type?: string
  location?: string
  verified: boolean
  created_at?: string
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
  
  // Profile editing state
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Contractor>>({})
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Review addition state
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewFormData, setReviewFormData] = useState<Review>({
    contractor_id: '',
    customer_name: '',
    customer_email: '',
    customer_image: '',
    rating: 5,
    title: '',
    comment: '',
    service_type: '',
    location: '',
    verified: true
  })
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [customerImageFile, setCustomerImageFile] = useState<File | null>(null)
  const [customerImagePreview, setCustomerImagePreview] = useState<string>('')
  
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
      
      // Fetch all contractors with complete profile data
      const { data: contractorsData, error } = await (supabase as any)
        .from('contractors')
        .select(`
          id,
          user_id,
          business_name,
          license_number,
          status,
          credits,
          created_at,
          contact_phone,
          contact_email,
          business_address,
          business_city,
          business_state,
          business_zip,
          total_reviews,
          average_rating,
          total_completed_projects,
          profile_image,
          bio,
          founded_year,
          employee_count,
          license_verified,
          insurance_verified,
          certifications
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
    console.log('🗑️ Delete contractor called:', { contractorId, businessName })
    
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${businessName}"?\n\n` +
      `This will:\n` +
      `• Remove the contractor from the database\n` +
      `• Delete all associated data\n` +
      `• Allow them to re-register with the same email\n\n` +
      `This action cannot be undone.`
    )

    if (!confirmed) {
      console.log('🚫 Delete cancelled by user')
      return
    }

    try {
      console.log('🔍 Fetching contractor user_id for:', contractorId)
      
      // First, get the user_id to delete from users table too
      const { data: contractor, error: fetchError } = await (supabase as any)
        .from('contractors')
        .select('user_id')
        .eq('id', contractorId)
        .single()

      if (fetchError) {
        console.error('❌ Error fetching contractor:', fetchError)
        throw fetchError
      }

      console.log('✅ Found contractor data:', contractor)

      if (contractor?.user_id) {
        console.log('🗑️ Deleting from contractors table...')
        
        // Delete from contractors table (will cascade to related tables)
        const { data: deletedContractor, error: contractorError, count } = await (supabase as any)
          .from('contractors')
          .delete()
          .eq('id', contractorId)
          .select()

        console.log('🔍 Delete contractor result:', { deletedContractor, contractorError, count })

        if (contractorError) {
          console.error('❌ Error deleting contractor:', contractorError)
          throw contractorError
        }

        // Verify the contractor was actually deleted
        if (!deletedContractor || deletedContractor.length === 0) {
          console.error('❌ Contractor was not deleted - no rows affected')
          throw new Error('Contractor deletion failed - no rows were affected. This may be due to database permissions.')
        }

        console.log('✅ Contractor deleted successfully:', deletedContractor)
        console.log('🗑️ Deleting from users table...')

        // Delete from users table
        const { data: deletedUser, error: userError } = await (supabase as any)
          .from('users')
          .delete()
          .eq('id', contractor.user_id)
          .select()

        console.log('🔍 Delete user result:', { deletedUser, userError })

        if (userError) {
          console.error('❌ Error deleting user:', userError)
          throw userError
        }

        // Verify the user was actually deleted
        if (!deletedUser || deletedUser.length === 0) {
          console.error('❌ User was not deleted - no rows affected')
          throw new Error('User deletion failed - no rows were affected. This may be due to database permissions.')
        }

        console.log('✅ User deleted successfully:', deletedUser)
      } else {
        console.log('⚠️ No user_id found for contractor')
        throw new Error('No user_id found for contractor')
      }

      // Verify deletion by trying to fetch the contractor again
      console.log('🔍 Verifying deletion...')
      const { data: verifyDeleted, error: verifyError } = await (supabase as any)
        .from('contractors')
        .select('id')
        .eq('id', contractorId)
        .single()

      if (verifyDeleted) {
        console.error('❌ Verification failed - contractor still exists:', verifyDeleted)
        throw new Error('Deletion verification failed - contractor still exists in database')
      }

      console.log('✅ Deletion verified - contractor no longer exists')
      toast.success(`Contractor "${businessName}" has been permanently deleted`)
      console.log('🔄 Reloading contractors...')
      loadContractors() // Reload data
    } catch (error) {
      console.error('💥 Delete contractor error:', error)
      toast.error(`Failed to delete contractor: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    router.push('/admin-login')
  }

  // Profile editing functions
  const openEditDialog = (contractor: Contractor) => {
    setSelectedContractor(contractor)
    setEditFormData({
      business_name: contractor.business_name,
      license_number: contractor.license_number || '',
      contact_phone: contractor.contact_phone || '',
      contact_email: contractor.contact_email || '',
      business_address: contractor.business_address || '',
      business_city: contractor.business_city || '',
      business_state: contractor.business_state || '',
      business_zip: contractor.business_zip || '',
      bio: contractor.bio || '',
      founded_year: contractor.founded_year || new Date().getFullYear(),
      employee_count: contractor.employee_count || 1,
      license_verified: contractor.license_verified || false,
      insurance_verified: contractor.insurance_verified || false
    })
    setIsEditDialogOpen(true)
  }

  const updateContractorProfile = async () => {
    if (!selectedContractor) return

    setIsUpdating(true)
    try {
      const { error } = await (supabase as any)
        .from('contractors')
        .update(editFormData)
        .eq('id', selectedContractor.id)

      if (error) throw error

      toast.success('Contractor profile updated successfully')
      setIsEditDialogOpen(false)
      loadContractors()
    } catch (error) {
      console.error('Error updating contractor profile:', error)
      toast.error('Failed to update contractor profile')
    } finally {
      setIsUpdating(false)
    }
  }

  // Review addition functions
  const openReviewDialog = (contractor: Contractor) => {
    setReviewFormData({
      contractor_id: contractor.id,
      customer_name: '',
      customer_email: '',
      customer_image: '',
      rating: 5,
      title: '',
      comment: '',
      service_type: 'attic',
      location: contractor.business_city ? `${contractor.business_city}, ${contractor.business_state}` : '',
      verified: true
    })
    setCustomerImageFile(null)
    setCustomerImagePreview('')
    setIsReviewDialogOpen(true)
  }

  const handleCustomerImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      setCustomerImageFile(file)
      setCustomerImagePreview(preview)
    }
    reader.readAsDataURL(file)
  }

  const uploadCustomerImageToSupabase = async (file: File): Promise<string> => {
    try {
      console.log('🔄 Uploading customer image to Supabase Storage...', file.name)
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `customer-images/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('contractor_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Supabase Storage upload error:', error)
        throw new Error(`Upload failed: ${error.message}`)
      }

      console.log('✅ Customer image uploaded successfully:', data.path)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('contractor_images')
        .getPublicUrl(filePath)

      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      console.log('✅ Public URL generated:', urlData.publicUrl)
      return urlData.publicUrl
      
    } catch (error) {
      console.error('💥 Customer image upload failed:', error)
      throw error
    }
  }

  const addReview = async () => {
    if (!reviewFormData.customer_name.trim() || !reviewFormData.comment?.trim()) {
      toast.error('Customer name and comment are required')
      return
    }

    setIsAddingReview(true)
    try {
      let customerImageUrl = ''

      // Upload customer image if provided
      if (customerImageFile) {
        customerImageUrl = await uploadCustomerImageToSupabase(customerImageFile)
      }

      const { error } = await (supabase as any)
        .from('reviews')
        .insert({
          contractor_id: reviewFormData.contractor_id,
          customer_name: reviewFormData.customer_name,
          customer_email: reviewFormData.customer_email || null,
          customer_image: customerImageUrl || null,
          rating: reviewFormData.rating,
          title: reviewFormData.title || null,
          comment: reviewFormData.comment,
          service_type: reviewFormData.service_type || null,
          location: reviewFormData.location || null,
          verified: reviewFormData.verified
        })

      if (error) throw error

      // Update contractor's review stats
      const contractor = contractors.find(c => c.id === reviewFormData.contractor_id)
      if (contractor) {
        const newTotalReviews = (contractor.total_reviews || 0) + 1
        const currentTotalRating = (contractor.average_rating || 0) * (contractor.total_reviews || 0)
        const newAverageRating = (currentTotalRating + reviewFormData.rating) / newTotalReviews

        await (supabase as any)
          .from('contractors')
          .update({
            total_reviews: newTotalReviews,
            average_rating: parseFloat(newAverageRating.toFixed(2))
          })
          .eq('id', reviewFormData.contractor_id)
      }

      toast.success('Review added successfully')
      setIsReviewDialogOpen(false)
      setReviewFormData({
        contractor_id: '',
        customer_name: '',
        customer_email: '',
        customer_image: '',
        rating: 5,
        title: '',
        comment: '',
        service_type: '',
        location: '',
        verified: true
      })
      setCustomerImageFile(null)
      setCustomerImagePreview('')
      loadContractors()
    } catch (error) {
      console.error('Error adding review:', error)
      toast.error('Failed to add review')
    } finally {
      setIsAddingReview(false)
    }
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
            <TabsTrigger value="profiles">Profile Management</TabsTrigger>
            <TabsTrigger value="reviews">Add Reviews</TabsTrigger>
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
                            <div className="flex space-x-1 items-center whitespace-nowrap">
                              {contractor.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                                >
                                  Approve
                                </Button>
                              )}
                              {contractor.status === 'approved' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="text-xs px-2 py-1"
                                  onClick={() => updateContractorStatus(contractor.id, 'suspended')}
                                >
                                  Suspend
                                </Button>
                              )}
                              {contractor.status === 'suspended' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                                >
                                  Reactivate
                                </Button>
                              )}
                              {contractor.status === 'rejected' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                                >
                                  Approve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCredits(contractor.id, contractor.business_name, contractor.credits || 0)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1"
                              >
                                Edit Credits
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(contractor)}
                                className="border-green-300 text-green-600 hover:bg-green-50 text-xs px-2 py-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openReviewDialog(contractor)}
                                className="border-purple-300 text-purple-600 hover:bg-purple-50 text-xs px-2 py-1"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteContractor(contractor.id, contractor.business_name)}
                                className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-2 py-1"
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
                            <div className="flex space-x-1 items-center whitespace-nowrap">
                              <Button
                                size="sm"
                                onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs px-2 py-1"
                                onClick={() => updateContractorStatus(contractor.id, 'rejected')}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCredits(contractor.id, contractor.business_name, contractor.credits || 0)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1"
                              >
                                Edit Credits
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteContractor(contractor.id, contractor.business_name)}
                                className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-2 py-1"
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

          {/* Profile Management Tab */}
          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>
                  View and edit detailed contractor profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead>Business Details</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractors.map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{contractor.business_name}</div>
                              <div className="text-sm text-gray-500">
                                License: {contractor.license_number || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>📧 {contractor.contact_email || 'N/A'}</div>
                              <div>📞 {contractor.contact_phone || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{contractor.business_address || 'N/A'}</div>
                              <div>
                                {contractor.business_city && contractor.business_state
                                  ? `${contractor.business_city}, ${contractor.business_state} ${contractor.business_zip || ''}`
                                  : 'N/A'
                                }
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge 
                                variant={contractor.license_verified ? "default" : "secondary"}
                                className={contractor.license_verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              >
                                {contractor.license_verified ? "License ✓" : "License ✗"}
                              </Badge>
                              <Badge 
                                variant={contractor.insurance_verified ? "default" : "secondary"}
                                className={contractor.insurance_verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              >
                                {contractor.insurance_verified ? "Insurance ✓" : "Insurance ✗"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Founded: {contractor.founded_year || 'N/A'}</div>
                              <div>Employees: {contractor.employee_count || 'N/A'}</div>
                              <div>Projects: {contractor.total_completed_projects || 0}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(contractor)}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Add Manual Reviews</CardTitle>
                <CardDescription>
                  Add reviews for contractors manually to help build their reputation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Current Reviews</TableHead>
                        <TableHead>Average Rating</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractors.filter(c => c.status === 'approved').map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">
                            {contractor.business_name}
                          </TableCell>
                          <TableCell>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                              {contractor.total_reviews || 0} reviews
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="font-semibold">
                                {contractor.average_rating ? contractor.average_rating.toFixed(1) : '0.0'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {contractor.business_city && contractor.business_state
                              ? `${contractor.business_city}, ${contractor.business_state}`
                              : 'Not specified'
                            }
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => openReviewDialog(contractor)}
                              className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768] text-xs px-2 py-1"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {contractors.filter(c => c.status === 'approved').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No approved contractors available for reviews
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

        {/* Edit Contractor Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Contractor Profile</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={editFormData.business_name || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, business_name: e.target.value }))}
                    placeholder="Business Name"
                  />
                </div>

                <div>
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={editFormData.license_number || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, license_number: e.target.value }))}
                    placeholder="License Number"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={editFormData.contact_phone || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={editFormData.contact_email || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="contact@business.com"
                  />
                </div>
              </div>

              {/* Location & Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location & Business Details</h3>
                
                <div>
                  <Label htmlFor="business_address">Business Address</Label>
                  <Input
                    id="business_address"
                    value={editFormData.business_address || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, business_address: e.target.value }))}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="business_city">City</Label>
                    <Input
                      id="business_city"
                      value={editFormData.business_city || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, business_city: e.target.value }))}
                      placeholder="Phoenix"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business_state">State</Label>
                    <Input
                      id="business_state"
                      value={editFormData.business_state || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, business_state: e.target.value }))}
                      placeholder="AZ"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="business_zip">ZIP Code</Label>
                  <Input
                    id="business_zip"
                    value={editFormData.business_zip || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, business_zip: e.target.value }))}
                    placeholder="85001"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="founded_year">Founded Year</Label>
                    <Input
                      id="founded_year"
                      type="number"
                      value={editFormData.founded_year || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, founded_year: parseInt(e.target.value) || undefined }))}
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employee_count">Employee Count</Label>
                    <Input
                      id="employee_count"
                      type="number"
                      value={editFormData.employee_count || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, employee_count: parseInt(e.target.value) || undefined }))}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Verification Status</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editFormData.license_verified || false}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, license_verified: e.target.checked }))}
                      />
                      <span>License Verified</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editFormData.insurance_verified || false}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, insurance_verified: e.target.checked }))}
                      />
                      <span>Insurance Verified</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Company Bio</h3>
                <div>
                  <Label htmlFor="bio">Bio / Description</Label>
                  <Textarea
                    id="bio"
                    value={editFormData.bio || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe the company, services, and experience..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={updateContractorProfile}
                disabled={isUpdating}
                className="bg-[#0a4768] hover:bg-[#0a4768]/90"
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Manual Review</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={reviewFormData.customer_name}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_email">Customer Email</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={reviewFormData.customer_email || ''}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Customer Image Upload */}
              <div>
                <Label>Customer Image</Label>
                <div className="mt-2">
                  {customerImagePreview ? (
                    <div className="relative inline-block">
                      <Image
                        src={customerImagePreview}
                        alt="Customer preview"
                        width={120}
                        height={120}
                        className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setCustomerImageFile(null)
                          setCustomerImagePreview('')
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-gray-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 text-center">
                        Upload customer image<br />
                        <span className="text-xs text-gray-500">(Optional, max 5MB)</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleCustomerImageSelect(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating *</Label>
                  <Select
                    value={reviewFormData.rating.toString()}
                    onValueChange={(value) => setReviewFormData(prev => ({ ...prev, rating: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                      <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                      <SelectItem value="1">⭐ (1 star)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select
                    value={reviewFormData.service_type || ''}
                    onValueChange={(value) => setReviewFormData(prev => ({ ...prev, service_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attic">Attic Insulation</SelectItem>
                      <SelectItem value="wall">Wall Insulation</SelectItem>
                      <SelectItem value="basement">Basement Insulation</SelectItem>
                      <SelectItem value="crawl_space">Crawl Space Insulation</SelectItem>
                      <SelectItem value="spray_foam">Spray Foam Insulation</SelectItem>
                      <SelectItem value="removal">Insulation Removal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={reviewFormData.title || ''}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Great service!"
                />
              </div>

              <div>
                <Label htmlFor="comment">Review Comment *</Label>
                <Textarea
                  id="comment"
                  value={reviewFormData.comment || ''}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Describe the customer's experience..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Project Location</Label>
                <Input
                  id="location"
                  value={reviewFormData.location || ''}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Phoenix, AZ"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={reviewFormData.verified}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, verified: e.target.checked }))}
                />
                <Label htmlFor="verified">Mark as Verified Review</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={addReview}
                disabled={isAddingReview}
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
              >
                {isAddingReview ? 'Adding Review...' : 'Add Review'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
