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
import { Shield, Users, Clock, CheckCircle, XCircle, Eye, DollarSign, LogOut, Edit, Plus, Star, UserCog, Key } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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
  bbb_accredited?: boolean
  certifications?: string[]
  users?: {
    name?: string
    email?: string
  }
}

interface Review {
  id?: string
  contractor_id: string
  customer_name: string
  customer_email?: string
  rating: number
  comment?: string
  verified: boolean
  created_at?: string
  contractor_name?: string
  title?: string
  service_type?: string
  project_cost?: number
  location?: string
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
    rating: 5,
    comment: '',
    verified: true
  })
  const [isAddingReview, setIsAddingReview] = useState(false)
  
  // Review management state
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isViewReviewDialogOpen, setIsViewReviewDialogOpen] = useState(false)
  const [isDeletingReview, setIsDeletingReview] = useState(false)
  const [isEditReviewDialogOpen, setIsEditReviewDialogOpen] = useState(false)
  
  // Password reset state
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false)
  const [selectedContractorForPasswordReset, setSelectedContractorForPasswordReset] = useState<Contractor | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [isUpdatingReview, setIsUpdatingReview] = useState(false)
  const [selectedContractorForReviews, setSelectedContractorForReviews] = useState<string>('')
  const [isManageReviewsDialogOpen, setIsManageReviewsDialogOpen] = useState(false)
  
  // Filtering state
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([])
  
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
      
      // Fetch all contractors with complete profile data and user information
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
          certifications,
          users(
            name,
            email
          )
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

  // Filtering functions
  const updateAvailableStates = (contractors: Contractor[]) => {
    const stateSet = new Set(contractors.map(c => c.business_state).filter((state): state is string => Boolean(state)))
    const states = Array.from(stateSet).sort()
    setAvailableStates(states)
  }

  const updateAvailableCities = (contractors: Contractor[], state?: string) => {
    const filteredByState = state ? contractors.filter(c => c.business_state === state) : contractors
    const citySet = new Set(filteredByState.map(c => c.business_city).filter((city): city is string => Boolean(city)))
    const cities = Array.from(citySet).sort()
    setAvailableCities(cities)
  }

  const applyFilters = () => {
    let filtered = [...contractors]

    if (selectedState) {
      filtered = filtered.filter(c => c.business_state === selectedState)
    }

    if (selectedCity) {
      filtered = filtered.filter(c => c.business_city === selectedCity)
    }

    setFilteredContractors(filtered)
  }

  const clearFilters = () => {
    setSelectedState('')
    setSelectedCity('')
    setFilteredContractors(contractors)
  }

  // Update filters when contractors change
  useEffect(() => {
    updateAvailableStates(contractors)
    setFilteredContractors(contractors)
  }, [contractors])

  // Update cities when state changes
  useEffect(() => {
    updateAvailableCities(contractors, selectedState)
    if (selectedState) {
      setSelectedCity('') // Reset city when state changes
    }
  }, [selectedState, contractors])

  // Apply filters when state or city changes
  useEffect(() => {
    applyFilters()
  }, [selectedState, selectedCity, contractors])

  // Update stats based on filtered contractors
  useEffect(() => {
    const totalContractors = filteredContractors.length
    const pending = filteredContractors.filter(c => c.status === 'pending').length
    const approved = filteredContractors.filter(c => c.status === 'approved').length
    const suspended = filteredContractors.filter(c => c.status === 'suspended').length

    setStats({
      total: totalContractors,
      pending,
      approved,
      suspended
    })
  }, [filteredContractors])

  const loadReviews = async (contractorId?: string) => {
    try {
      setIsLoadingReviews(true)
      
      if (!contractorId) {
        setReviews([])
        return
      }
      
      // Fetch reviews for specific contractor
      const { data: reviewsData, error } = await (supabase as any)
        .from('reviews')
        .select(`
          id,
          contractor_id,
          customer_id,
          customer_name,
          customer_email,
          rating,
          comment,
          verified,
          created_at,
          title,
          service_type,
          project_cost,
          location,
          contractors(
            business_name
          ),
          users(
            name,
            email
          )
        `)
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error loading reviews with contractors:', error)
        console.log('🔄 Trying to load reviews without contractor info...')
        
        // Fallback: load reviews without contractor info
        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('reviews')
          .select(`
            id,
            contractor_id,
            customer_id,
            customer_name,
            customer_email,
            rating,
            comment,
            verified,
            created_at,
            title,
            service_type,
            project_cost,
            location,
            users(
              name,
              email
            )
          `)
          .eq('contractor_id', contractorId)
          .order('created_at', { ascending: false })
        
        if (fallbackError) throw fallbackError
        
        const transformedReviews = fallbackData?.map((review: any) => ({
          ...review,
          contractor_name: 'Unknown Contractor',
          customer_name: review.customer_name || review.users?.name || 'Anonymous',
          customer_email: review.customer_email || review.users?.email || null
        })) || []
        
        console.log('📋 Loaded reviews (fallback):', transformedReviews)
        setReviews(transformedReviews)
        return
      }

      // Transform the data to include contractor name and customer info
      const transformedReviews = reviewsData?.map((review: any) => ({
        ...review,
        contractor_name: review.contractors?.business_name || 'Unknown',
        customer_name: review.customer_name || review.users?.name || 'Anonymous',
        customer_email: review.customer_email || review.users?.email || null
      })) || []

      console.log('📋 Loaded reviews:', transformedReviews)
      console.log('📋 Review IDs:', transformedReviews.map((r: any) => r.id))
      
      setReviews(transformedReviews)

    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setIsLoadingReviews(false)
    }
  }

  const viewReview = (review: Review) => {
    setSelectedReview(review)
    setIsViewReviewDialogOpen(true)
  }

  const editReview = (review: Review) => {
    setSelectedReview(review)
    setReviewFormData({
      contractor_id: review.contractor_id,
      customer_name: review.customer_name || '',
      customer_email: review.customer_email || '',
      rating: review.rating,
      comment: review.comment || '',
      verified: review.verified
    })
    setIsEditReviewDialogOpen(true)
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeletingReview(true)
      
      console.log('🗑️ Attempting to delete review:', reviewId)
      
      // Delete the review
      const { data, error } = await (supabase as any)
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .select()

      console.log('🗑️ Delete result:', { data, error })

      if (error) {
        console.error('❌ Delete error details:', error)
        throw error
      }

      console.log('✅ Review deleted successfully')

      // Reload reviews and contractors to update counts
      await loadReviews(selectedContractorForReviews)
      await loadContractors()
      
      toast.success('Review deleted successfully')
      
    } catch (error) {
      console.error('❌ Error deleting review:', error)
      toast.error(`Failed to delete review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeletingReview(false)
    }
  }

  const updateReview = async () => {
    if (!selectedReview?.id) return

    try {
      setIsUpdatingReview(true)
      
      console.log('🔄 Updating review:', selectedReview.id)
      
      // Update the review
      const { error } = await (supabase as any)
        .from('reviews')
        .update({
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
          verified: reviewFormData.verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedReview.id)

      if (error) throw error

      console.log('✅ Review updated successfully')

      // Reload reviews and contractors to update counts
      await loadReviews(selectedContractorForReviews)
      await loadContractors()
      
      toast.success('Review updated successfully')
      setIsEditReviewDialogOpen(false)
      setSelectedReview(null)
      
    } catch (error) {
      console.error('❌ Error updating review:', error)
      toast.error(`Failed to update review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUpdatingReview(false)
    }
  }

  const updateContractorStatus = async (contractorId: string, newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from('contractors')
        .update({ status: newStatus })
        .eq('id', contractorId)

      if (error) throw error

      // If contractor was approved, send approval email
      if (newStatus === 'approved') {
        try {
          // Get contractor details
          const { data: contractor, error: fetchError } = await (supabase as any)
            .from('contractors')
            .select('email, business_name, contact_email')
            .eq('id', contractorId)
            .single()

          if (!fetchError && contractor) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
            const emailToSend = contractor.contact_email || contractor.email
            
            // Send approval email
            const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: emailToSend,
                subject: 'Congratulations! You\'re Approved - InsulationPal',
                template: 'contractor-approved',
                data: {
                  name: contractor.business_name,
                  email: emailToSend,
                  password: 'Use the password you created during registration',
                  loginUrl: `${siteUrl}/contractor-login`
                }
              })
            })
            
            if (response.ok) {
              console.log('✅ Approval email sent successfully to contractor')
            } else {
              console.error('❌ Failed to send approval email')
            }
          }
        } catch (emailError) {
          console.error('Error sending approval email:', emailError)
          // Don't fail the status update if email fails
        }
      }

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

  const resetContractorPassword = async () => {
    if (!selectedContractorForPasswordReset || !newPassword) {
      toast.error('Please select a contractor and enter a new password')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsResettingPassword(true)
    try {
      const response = await fetch('/api/admin-reset-contractor-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractorId: selectedContractorForPasswordReset.id,
          newPassword: newPassword,
          adminId: 'admin' // You might want to get this from admin session
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success(result.message)
        setIsPasswordResetDialogOpen(false)
        setNewPassword('')
        setSelectedContractorForPasswordReset(null)
      } else {
        toast.error(result.error || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('An error occurred while resetting the password')
    } finally {
      setIsResettingPassword(false)
    }
  }

  const openPasswordResetDialog = (contractor: Contractor) => {
    setSelectedContractorForPasswordReset(contractor)
    setNewPassword('')
    setIsPasswordResetDialogOpen(true)
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

      // Only delete from users table if user_id exists
      if (contractor?.user_id) {
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
        console.log('ℹ️ No user_id found for contractor - skipping user deletion')
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
      insurance_verified: contractor.insurance_verified || false,
      bbb_accredited: contractor.bbb_accredited || false
    })
    setIsEditDialogOpen(true)
  }

  const updateContractorProfile = async () => {
    if (!selectedContractor) return

    setIsUpdating(true)
    try {
      // Update contractor profile
      const { error: contractorError } = await (supabase as any)
        .from('contractors')
        .update(editFormData)
        .eq('id', selectedContractor.id)

      if (contractorError) throw contractorError

      // If contact_email was changed, also update the users table email
      if (editFormData.contact_email && editFormData.contact_email !== selectedContractor.contact_email) {
        const { error: userError } = await (supabase as any)
          .from('users')
          .update({ email: editFormData.contact_email })
          .eq('id', selectedContractor.user_id)

        if (userError) {
          console.error('Error updating user email:', userError)
          toast.error('Contractor profile updated, but failed to update login email. Please contact support.')
        } else {
          toast.success('Contractor profile and login email updated successfully')
        }
      } else {
        toast.success('Contractor profile updated successfully')
      }

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
      rating: 5,
      comment: '',
      verified: true
    })
    setIsReviewDialogOpen(true)
  }

  // Test database functions
  const testDatabaseFunctions = async () => {
    console.log('🧪 Starting comprehensive database test...')
    
    try {
      // Test 1: Can we read reviews table?
      console.log('📋 Test 1: Reading reviews table...')
      const { data: reviewsData, error: reviewsError } = await (supabase as any)
        .from('reviews')
        .select('id, customer_name, rating')
        .limit(5)
      
      if (reviewsError) {
        console.error('❌ Test 1 FAILED - Cannot read reviews table:', reviewsError)
      } else {
        console.log('✅ Test 1 PASSED - Reviews table accessible, sample data:', reviewsData)
      }

      // Test 2: Can we read contractors table?
      console.log('📋 Test 2: Reading contractors table...')
      const { data: contractorsData, error: contractorsError } = await (supabase as any)
        .from('contractors')
        .select('id, business_name')
        .eq('status', 'approved')
        .limit(3)
      
      if (contractorsError) {
        console.error('❌ Test 2 FAILED - Cannot read contractors table:', contractorsError)
      } else {
        console.log('✅ Test 2 PASSED - Contractors table accessible, sample data:', contractorsData)
      }

      // Test 3: Test simple RPC function with valid contractor ID
      if (contractorsData && contractorsData.length > 0) {
        const testContractorId = contractorsData[0].id
        console.log('📋 Test 3: Testing simple_admin_review with valid contractor ID:', testContractorId)
        
        const { data: simpleData, error: simpleError } = await (supabase as any)
          .rpc('simple_admin_review', {
            contractor_id_param: testContractorId,
            customer_name_param: 'TEST USER - ADMIN DASHBOARD',
            rating_param: 5,
            comment_param: 'This is a test review from admin dashboard - please ignore',
            verified_param: true
          })
        
        if (simpleError) {
          console.error('❌ Test 3 FAILED - Simple RPC error:', simpleError)
          console.error('Error code:', simpleError.code)
          console.error('Error message:', simpleError.message)
        } else {
          console.log('✅ Test 3 PASSED - Simple RPC response:', simpleData)
          
          // If it succeeded, we should delete the test review
          if (simpleData && simpleData.success && simpleData.review_id) {
            console.log('🧹 Cleaning up test review...')
            const { error: deleteError } = await (supabase as any)
              .from('reviews')
              .delete()
              .eq('id', simpleData.review_id)
            
            if (deleteError) {
              console.warn('⚠️ Could not delete test review:', deleteError)
            } else {
              console.log('✅ Test review cleaned up successfully')
            }
          }
        }

        // Test 4: Test complex RPC function
        console.log('📋 Test 4: Testing admin_insert_review with valid contractor ID:', testContractorId)
        
        const { data: complexData, error: complexError } = await (supabase as any)
          .rpc('admin_insert_review', {
            p_contractor_id: testContractorId,
            p_customer_name: 'TEST USER 2 - ADMIN DASHBOARD',
            p_rating: 4,
            p_customer_email: 'test@example.com',
            p_comment: 'This is a test review from admin dashboard complex function - please ignore',
            p_verified: true
          })
        
        if (complexError) {
          console.error('❌ Test 4 FAILED - Complex RPC error:', complexError)
          console.error('Error code:', complexError.code)
          console.error('Error message:', complexError.message)
        } else {
          console.log('✅ Test 4 PASSED - Complex RPC response:', complexData)
          
          // Clean up the test review
          if (complexData) {
            console.log('🧹 Cleaning up complex test review...')
            const { error: deleteError } = await (supabase as any)
              .from('reviews')
              .delete()
              .eq('id', complexData)
            
            if (deleteError) {
              console.warn('⚠️ Could not delete complex test review:', deleteError)
            } else {
              console.log('✅ Complex test review cleaned up successfully')
            }
          }
        }

        // Test 5: Test direct insertion
        console.log('📋 Test 5: Testing direct insertion...')
        
        const { data: directData, error: directError } = await (supabase as any)
          .from('reviews')
          .insert({
            contractor_id: testContractorId,
            lead_id: null,
            customer_name: 'TEST USER 3 - DIRECT INSERT',
            customer_email: 'direct@example.com',
            rating: 3,
            comment: 'This is a test review from direct insertion - please ignore',
            verified: true
          })
          .select()
        
        if (directError) {
          console.error('❌ Test 5 FAILED - Direct insertion error:', directError)
          console.error('Error code:', directError.code)
          console.error('Error message:', directError.message)
        } else {
          console.log('✅ Test 5 PASSED - Direct insertion response:', directData)
          
          // Clean up the test review
          if (directData && directData.length > 0) {
            console.log('🧹 Cleaning up direct test review...')
            const { error: deleteError } = await (supabase as any)
              .from('reviews')
              .delete()
              .eq('id', directData[0].id)
            
            if (deleteError) {
              console.warn('⚠️ Could not delete direct test review:', deleteError)
            } else {
              console.log('✅ Direct test review cleaned up successfully')
            }
          }
        }
      }

      console.log('🧪 Database test completed! Check console for detailed results.')
      toast.success('Database test completed - check console for results')
      
    } catch (error) {
      console.error('❌ Database test failed with exception:', error)
      toast.error('Database test failed - check console for details')
    }
  }


  const addReview = async () => {
    if (!reviewFormData.customer_name.trim() || !reviewFormData.comment?.trim()) {
      toast.error('Customer name and comment are required')
      return
    }

    if (!reviewFormData.contractor_id) {
      toast.error('Contractor ID is required')
      return
    }

    // Validate contractor exists
    const contractor = contractors.find(c => c.id === reviewFormData.contractor_id)
    if (!contractor) {
      toast.error('Selected contractor not found')
      return
    }

    console.log('🔍 Contractor validation:', {
      contractor_exists: !!contractor,
      contractor_id: contractor?.id,
      contractor_name: contractor?.business_name
    })

    setIsAddingReview(true)
    try {
      console.log('🔄 Attempting to insert review with data:', {
        contractor_id: reviewFormData.contractor_id,
        customer_name: reviewFormData.customer_name,
        customer_email: reviewFormData.customer_email || null,
        rating: reviewFormData.rating,
        comment: reviewFormData.comment,
        verified: reviewFormData.verified
      })

      // First, let's test if we can read from the reviews table
      console.log('🔍 Testing reviews table access...')
      const { data: testRead, error: readError } = await (supabase as any)
        .from('reviews')
        .select('id')
        .limit(1)

      if (readError) {
        console.error('❌ Cannot read from reviews table:', readError)
        toast.error(`Cannot access reviews table: ${readError.message}`)
        return
      }
      
      console.log('✅ Reviews table is accessible, found records:', testRead?.length || 0)

      // Ensure data types are correct
      const insertData = {
        contractor_id: reviewFormData.contractor_id,
        lead_id: null,
        customer_name: reviewFormData.customer_name.trim(),
        customer_email: reviewFormData.customer_email?.trim() || null,
        rating: parseInt(reviewFormData.rating.toString()), // Ensure integer
        comment: reviewFormData.comment?.trim() || null,
        verified: Boolean(reviewFormData.verified)
      }

      console.log('🔄 Final insert data with correct types:', insertData)

      // Test if simple RPC function exists
      console.log('🔍 Testing if simple_admin_review function exists...')
      try {
        const { data: simpleTestData, error: simpleTestError } = await (supabase as any)
          .rpc('simple_admin_review', {
            contractor_id_param: '00000000-0000-0000-0000-000000000000', // dummy UUID
            customer_name_param: 'test',
            rating_param: 5
          })
        
        if (simpleTestError && simpleTestError.code === '42883') {
          console.error('❌ Simple RPC function does not exist!', simpleTestError)
        } else if (simpleTestError) {
          console.log('✅ Simple RPC function exists, got error:', simpleTestError.message)
        } else {
          console.log('✅ Simple RPC function exists, response:', simpleTestData)
        }
      } catch (e) {
        console.error('❌ Error testing simple RPC function:', e)
      }

      // Test if complex RPC function exists
      console.log('🔍 Testing if admin_insert_review function exists...')
      try {
        const { data: testData, error: testError } = await (supabase as any)
          .rpc('admin_insert_review', {
            p_contractor_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
            p_customer_name: 'test',
            p_rating: 5
          })
        
        if (testError && testError.code === '42883') {
          console.error('❌ Complex RPC function does not exist!', testError)
        } else if (testError && testError.message?.includes('does not exist')) {
          // Expected error for dummy contractor ID
          console.log('✅ Complex RPC function exists but contractor validation failed (expected)')
        } else if (testError) {
          console.log('✅ Complex RPC function exists, got validation error:', testError.message)
        } else {
          console.log('✅ Complex RPC function exists and test passed')
        }
      } catch (e) {
        console.error('❌ Error testing complex RPC function:', e)
      }

      // Try simple admin function first
      console.log('🔄 Trying simple admin RPC function...')
      console.log('🔗 RPC URL: simple_admin_review')
      console.log('📋 RPC Parameters:', {
        contractor_id_param: insertData.contractor_id,
        customer_name_param: insertData.customer_name,
        rating_param: insertData.rating,
        comment_param: insertData.comment,
        verified_param: insertData.verified
      })
      
      const { data: simpleData, error: simpleError } = await (supabase as any)
        .rpc('simple_admin_review', {
          contractor_id_param: insertData.contractor_id,
          customer_name_param: insertData.customer_name,
          rating_param: insertData.rating,
          comment_param: insertData.comment,
          verified_param: insertData.verified
        })

      if (simpleError) {
        console.error('❌ Simple RPC failed, trying complex RPC...', simpleError)
        
        // Fallback to original RPC function
        const { data, error } = await (supabase as any)
          .rpc('admin_insert_review', {
            p_contractor_id: insertData.contractor_id,
            p_customer_name: insertData.customer_name,
            p_rating: insertData.rating,
            p_customer_email: insertData.customer_email,
            p_comment: insertData.comment,
            p_verified: insertData.verified
          })
      } else {
        console.log('✅ Simple RPC response:', simpleData)
        
        // Check if the response indicates success or error
        if (simpleData && simpleData.success === false) {
          console.error('❌ Simple RPC returned error:', simpleData.error)
          throw new Error(simpleData.error)
        } else if (simpleData && simpleData.success === true) {
          console.log('✅ Simple RPC succeeded with review ID:', simpleData.review_id)
          toast.success('Review added successfully (simple method)')
          setIsReviewDialogOpen(false)
          setReviewFormData({
            contractor_id: '',
            customer_name: '',
            customer_email: '',
            rating: 5,
            comment: '',
            verified: true
          })
          loadContractors()
          return
        }
      }

      // Continue with original complex RPC if simple one failed
      const { data, error } = simpleError ? 
        await (supabase as any).rpc('admin_insert_review', {
          p_contractor_id: insertData.contractor_id,
          p_customer_name: insertData.customer_name,
          p_rating: insertData.rating,
          p_customer_email: insertData.customer_email,
          p_comment: insertData.comment,
          p_verified: insertData.verified
        }) : { data: simpleData, error: null }

      if (error) {
        console.error('❌ Admin RPC function failed:', error)
        console.error('❌ RPC Error details:', JSON.stringify(error, null, 2))
        console.error('❌ RPC Error message:', error instanceof Error ? error.message : 'Unknown error')
        console.error('❌ RPC Error code:', error.code)
        console.error('❌ RPC Error hint:', error.hint)
        console.error('❌ RPC Error details:', error.details)
        
        // If RPC fails, try direct insertion as fallback
        console.log('🔄 RPC failed, trying direct insertion as fallback...')
        
        try {
          const { data: directData, error: directError } = await (supabase as any)
            .from('reviews')
            .insert({
              contractor_id: insertData.contractor_id,
              lead_id: null,
              customer_name: insertData.customer_name,
              customer_email: insertData.customer_email,
              rating: insertData.rating,
              comment: insertData.comment,
              verified: insertData.verified
            })
            .select()
          
          if (directError) {
            console.error('❌ Direct insertion also failed:', directError)
            toast.error(`Both RPC and direct insertion failed: ${directError.message}`)
            throw directError
          }
          
          console.log('✅ Direct insertion succeeded as fallback:', directData)
          
          // Manually update contractor stats since we bypassed RPC
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
          
          toast.success('Review added successfully (via fallback method)')
          
        } catch (fallbackError) {
          console.error('❌ Fallback method also failed:', fallbackError)
          toast.error(`All methods failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          throw error
        }
      } else {
        console.log('✅ Admin review inserted successfully with ID:', data)
        toast.success('Review added successfully')
      }

      // Note: Contractor stats are automatically updated by the RPC function or fallback method

      setIsReviewDialogOpen(false)
      setReviewFormData({
        contractor_id: '',
        customer_name: '',
        customer_email: '',
        rating: 5,
        comment: '',
        verified: true
      })
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
        <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>Contractor Management</CardTitle>
              <CardDescription>
                Manage contractor profiles, status, and reviews
              </CardDescription>
            </CardHeader>
              <CardContent>
                {/* Filter Controls */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <Label htmlFor="state-filter">Filter by State</Label>
                      <Select value={selectedState || 'all'} onValueChange={(val) => setSelectedState(val === 'all' ? '' : val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All States" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          {availableStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <Label htmlFor="city-filter">Filter by City</Label>
                      <Select 
                        value={selectedCity || 'all'} 
                        onValueChange={(val) => setSelectedCity(val === 'all' ? '' : val)}
                        disabled={!selectedState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedState ? "All Cities" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {availableCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        disabled={!selectedState && !selectedCity}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                  
                  {(selectedState || selectedCity) && (
                    <div className="mt-3 text-sm text-gray-600">
                      Showing {filteredContractors.length} of {contractors.length} contractors
                      {selectedState && ` in ${selectedState}`}
                      {selectedCity && `, ${selectedCity}`}
                    </div>
                  )}
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Customer Email</TableHead>
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
                      {filteredContractors.map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">
                            {contractor.business_name}
                          </TableCell>
                          <TableCell>
                            {contractor.users?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {contractor.users?.email || 'N/A'}
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
                            <div className="flex flex-wrap gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(contractor)}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit Profile
                              </Button>
                              
                              {contractor.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Activate
                                </Button>
                              )}
                              
                              {contractor.status === 'suspended' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateContractorStatus(contractor.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Re-activate
                                </Button>
                              )}
                              
                              {contractor.status === 'approved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateContractorStatus(contractor.id, 'suspended')}
                                  className="text-orange-600 hover:bg-orange-50"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Suspend
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCredits(contractor.id, contractor.business_name, contractor.credits || 0)}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <DollarSign className="h-3 w-3 mr-1" />
                                Edit Credits
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openPasswordResetDialog(contractor)}
                                className="text-orange-600 hover:bg-orange-50"
                              >
                                <Key className="h-3 w-3 mr-1" />
                                Reset Password
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedContractorForReviews(contractor.id)
                                  loadReviews(contractor.id)
                                  setIsManageReviewsDialogOpen(true)
                                }}
                                className="text-purple-600 hover:bg-purple-50"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Manage Reviews
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteContractor(contractor.id, contractor.business_name)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
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
        </div>

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
                  <Label>Verification & Accreditation</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(editFormData.license_verified && editFormData.insurance_verified) || false}
                        onChange={(e) => setEditFormData(prev => ({ 
                          ...prev, 
                          license_verified: e.target.checked,
                          insurance_verified: e.target.checked
                        }))}
                      />
                      <span className="font-medium">🛡️ Licensed, Bonded & Insured</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editFormData.bbb_accredited || false}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, bbb_accredited: e.target.checked }))}
                      />
                      <span className="font-medium">🏆 BBB Accredited</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={updateContractorProfile}
                disabled={isUpdating}
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
              >
                {isUpdating ? 'Updating...' : 'Update Contractor'}
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

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={addReview}
                disabled={isAddingReview}
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
              >
                {isAddingReview ? 'Adding...' : 'Add Review'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Review Dialog */}
        <Dialog open={isEditReviewDialogOpen} onOpenChange={setIsEditReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_customer_name">Customer Name *</Label>
                  <Input
                    id="edit_customer_name"
                    value={reviewFormData.customer_name}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_customer_email">Customer Email</Label>
                  <Input
                    id="edit_customer_email"
                    type="email"
                    value={reviewFormData.customer_email || ''}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit_rating">Rating *</Label>
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
                <Label htmlFor="edit_comment">Review Comment *</Label>
                <Textarea
                  id="edit_comment"
                  value={reviewFormData.comment || ''}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Describe the customer's experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_verified"
                  checked={reviewFormData.verified}
                  onChange={(e) => setReviewFormData(prev => ({ ...prev, verified: e.target.checked }))}
                />
                <Label htmlFor="edit_verified">Mark as Verified Review</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditReviewDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={updateReview}
                disabled={isUpdatingReview}
                className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
              >
                {isUpdatingReview ? 'Updating...' : 'Update Review'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Review Dialog */}
        <Dialog open={isViewReviewDialogOpen} onOpenChange={setIsViewReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            
            {selectedReview && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Customer Name</Label>
                    <p className="text-lg">{selectedReview.customer_name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Customer Email</Label>
                    <p className="text-lg">{selectedReview.customer_email || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Rating</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{selectedReview.rating}/5</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Review Comment</Label>
                  <p className="text-lg bg-gray-50 p-3 rounded-md">
                    {selectedReview.comment || 'No comment provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Verified</Label>
                    <Badge variant={selectedReview.verified ? "default" : "secondary"}>
                      {selectedReview.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date</Label>
                    <p className="text-lg">
                      {selectedReview.created_at ? new Date(selectedReview.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedReview.service_type && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Service Type</Label>
                    <p className="text-lg">{selectedReview.service_type}</p>
                  </div>
                )}

                {selectedReview.project_cost && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Project Cost</Label>
                    <p className="text-lg">${selectedReview.project_cost}</p>
                  </div>
                )}

                {selectedReview.location && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="text-lg">{selectedReview.location}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsViewReviewDialogOpen(false)}
              >
                Close
              </Button>
              {selectedReview && (
                <Button
                  onClick={() => {
                    setIsViewReviewDialogOpen(false)
                    editReview(selectedReview)
                  }}
                  className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                >
                  Edit Review
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Reviews Dialog */}
        <Dialog open={isManageReviewsDialogOpen} onOpenChange={setIsManageReviewsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Reviews</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Contractor Info */}
              {selectedContractorForReviews && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">
                    Reviews for: {contractors.find(c => c.id === selectedContractorForReviews)?.business_name}
                  </h3>
                </div>
              )}

              {/* Add Review Button */}
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (!selectedContractorForReviews) {
                      toast.error('Please select a contractor first')
                      return
                    }
                    setReviewFormData({
                      contractor_id: selectedContractorForReviews,
                      customer_name: '',
                      customer_email: '',
                      rating: 5,
                      comment: '',
                      verified: true
                    })
                    setIsReviewDialogOpen(true)
                  }}
                  className="bg-[#F5DD22] hover:bg-[#f0d000] text-[#0a4768]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </div>

              {/* Reviews List */}
              {isLoadingReviews ? (
                <div className="flex justify-center py-8">
                  <div className="text-gray-500">Loading reviews...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No reviews found for this contractor
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold">{review.customer_name || 'Anonymous'}</span>
                              <Badge variant={review.verified ? "default" : "secondary"}>
                                {review.verified ? "Verified" : "Unverified"}
                              </Badge>
                            </div>
                            {review.customer_email && (
                              <div className="text-sm text-gray-500 mb-2">{review.customer_email}</div>
                            )}
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold">{review.rating}/5</span>
                            </div>
                            <div className="text-gray-700">{review.comment || 'No comment'}</div>
                            <div className="text-sm text-gray-500 mt-2">
                              {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewReview(review)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {review.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editReview(review)}
                                className="text-green-600 hover:bg-green-50"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            )}
                            {review.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => review.id && deleteReview(review.id)}
                                disabled={isDeletingReview}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsManageReviewsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Password Reset Dialog */}
        <Dialog open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Contractor Password</DialogTitle>
            </DialogHeader>
            
            {selectedContractorForPasswordReset && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Contractor Information</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Business:</strong> {selectedContractorForPasswordReset.business_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {selectedContractorForPasswordReset.email}
                  </p>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Warning:</strong> This will immediately reset the contractor's password. 
                    They will need to use this new password to log in, and they will be notified via email.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPasswordResetDialogOpen(false)
                  setNewPassword('')
                  setSelectedContractorForPasswordReset(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={resetContractorPassword}
                disabled={isResettingPassword || !newPassword}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isResettingPassword ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
