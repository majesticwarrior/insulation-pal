'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Eye,
  Upload
} from 'lucide-react'

interface EscrowJob {
  id: string
  job_title: string
  job_description?: string
  service_type?: string
  total_amount: number
  commission_amount: number
  contractor_payment: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  start_date?: string
  completion_date?: string
  payment_released_date?: string
  customer_notes?: string
  contractor_notes?: string
  created_at: string
  updated_at: string
}

interface EscrowJobsManagerProps {
  contractorId: string
  isVisible: boolean
}

export function EscrowJobsManager({ contractorId, isVisible }: EscrowJobsManagerProps) {
  const [jobs, setJobs] = useState<EscrowJob[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<EscrowJob | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [newJob, setNewJob] = useState({
    job_title: '',
    job_description: '',
    service_type: '',
    total_amount: '',
    customer_notes: ''
  })

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('escrow_jobs')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error loading escrow jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isVisible) {
      loadJobs()
    }
  }, [contractorId, isVisible])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'In Progress', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      disputed: { label: 'Disputed', variant: 'destructive' as const, color: 'bg-orange-100 text-orange-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const createJob = async () => {
    if (!newJob.job_title || !newJob.total_amount) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      const totalAmount = parseFloat(newJob.total_amount)
      const commissionRate = 10.0 // 10% commission
      const commissionAmount = totalAmount * (commissionRate / 100)
      const contractorPayment = totalAmount - commissionAmount

      const { error } = await supabase
        .from('escrow_jobs')
        .insert({
          contractor_id: contractorId,
          job_title: newJob.job_title,
          job_description: newJob.job_description || null,
          service_type: newJob.service_type || null,
          total_amount: totalAmount,
          commission_amount: commissionAmount,
          contractor_payment: contractorPayment,
          customer_notes: newJob.customer_notes || null,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Job created successfully!')
      setIsCreateModalOpen(false)
      setNewJob({
        job_title: '',
        job_description: '',
        service_type: '',
        total_amount: '',
        customer_notes: ''
      })
      loadJobs()
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error('Failed to create job')
    } finally {
      setIsCreating(false)
    }
  }

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      const updateData: any = { status }
      
      if (status === 'completed') {
        updateData.completion_date = new Date().toISOString()
        updateData.payment_released_date = new Date().toISOString()
      }

      const { error } = await supabase
        .from('escrow_jobs')
        .update(updateData)
        .eq('id', jobId)

      if (error) throw error

      toast.success('Job status updated successfully!')
      loadJobs()
    } catch (error) {
      console.error('Error updating job status:', error)
      toast.error('Failed to update job status')
    }
  }

  if (!isVisible) return null

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Escrow Jobs
              </CardTitle>
              <CardDescription>
                Manage jobs with escrow payment system
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#0a4768] hover:bg-[#0a4768]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No escrow jobs yet</p>
              <p className="text-sm">Create your first job to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{job.job_title}</h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedJob(job)
                        setIsViewModalOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Amount:</span>
                      <p className="font-medium">${job.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Commission (10%):</span>
                      <p className="font-medium text-red-600">-${job.commission_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Your Payment:</span>
                      <p className="font-medium text-green-600">${job.contractor_payment.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {job.status === 'in_progress' && (
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        size="sm"
                        onClick={() => updateJobStatus(job.id, 'completed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Job Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Escrow Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="job_title">Job Title *</Label>
              <Input
                id="job_title"
                value={newJob.job_title}
                onChange={(e) => setNewJob(prev => ({ ...prev, job_title: e.target.value }))}
                placeholder="e.g., Attic Insulation Installation"
              />
            </div>
            
            <div>
              <Label htmlFor="service_type">Service Type</Label>
              <Input
                id="service_type"
                value={newJob.service_type}
                onChange={(e) => setNewJob(prev => ({ ...prev, service_type: e.target.value }))}
                placeholder="e.g., Attic Insulation"
              />
            </div>
            
            <div>
              <Label htmlFor="total_amount">Total Job Amount *</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={newJob.total_amount}
                onChange={(e) => setNewJob(prev => ({ ...prev, total_amount: e.target.value }))}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                10% commission will be deducted from this amount
              </p>
            </div>
            
            <div>
              <Label htmlFor="job_description">Job Description</Label>
              <Textarea
                id="job_description"
                value={newJob.job_description}
                onChange={(e) => setNewJob(prev => ({ ...prev, job_description: e.target.value }))}
                placeholder="Describe the work to be performed..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="customer_notes">Customer Notes</Label>
              <Textarea
                id="customer_notes"
                value={newJob.customer_notes}
                onChange={(e) => setNewJob(prev => ({ ...prev, customer_notes: e.target.value }))}
                placeholder="Any special instructions or notes..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createJob}
                disabled={isCreating}
                className="bg-[#0a4768] hover:bg-[#0a4768]/90"
              >
                {isCreating ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Job Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Title</Label>
                  <p className="font-medium">{selectedJob.job_title}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedJob.status)}
                  </div>
                </div>
              </div>
              
              {selectedJob.service_type && (
                <div>
                  <Label>Service Type</Label>
                  <p className="font-medium">{selectedJob.service_type}</p>
                </div>
              )}
              
              {selectedJob.job_description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm">{selectedJob.job_description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label>Total Amount</Label>
                  <p className="font-semibold text-lg">${selectedJob.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Commission (10%)</Label>
                  <p className="font-semibold text-lg text-red-600">-${selectedJob.commission_amount.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Your Payment</Label>
                  <p className="font-semibold text-lg text-green-600">${selectedJob.contractor_payment.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Created</Label>
                  <p>{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                </div>
                {selectedJob.completion_date && (
                  <div>
                    <Label>Completed</Label>
                    <p>{new Date(selectedJob.completion_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {selectedJob.customer_notes && (
                <div>
                  <Label>Customer Notes</Label>
                  <p className="text-sm bg-blue-50 p-3 rounded">{selectedJob.customer_notes}</p>
                </div>
              )}
              
              {selectedJob.contractor_notes && (
                <div>
                  <Label>Your Notes</Label>
                  <p className="text-sm bg-green-50 p-3 rounded">{selectedJob.contractor_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
