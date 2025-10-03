/**
 * Escrow Payment Service for Per Job Completed Payment System
 */

import { supabase } from './supabase'

export interface EscrowJob {
  id: string
  contractor_id: string
  customer_id: string
  job_title: string
  job_description?: string
  service_type?: string
  total_amount: number
  commission_rate: number
  commission_amount: number
  contractor_payment: number
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  start_date?: string
  completion_date?: string
  payment_released_date?: string
  customer_notes?: string
  contractor_notes?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface CreateEscrowJobData {
  contractor_id: string
  customer_id: string
  job_title: string
  job_description?: string
  service_type?: string
  total_amount: number
  customer_notes?: string
}

/**
 * Create a new escrow job
 */
export async function createEscrowJob(data: CreateEscrowJobData): Promise<EscrowJob> {
  try {
    const commissionRate = 10.0 // 10% commission
    const commissionAmount = data.total_amount * (commissionRate / 100)
    const contractorPayment = data.total_amount - commissionAmount

    const { data: job, error } = await supabase
      .from('escrow_jobs')
      .insert({
        contractor_id: data.contractor_id,
        customer_id: data.customer_id,
        job_title: data.job_title,
        job_description: data.job_description,
        service_type: data.service_type,
        total_amount: data.total_amount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        contractor_payment: contractorPayment,
        customer_notes: data.customer_notes,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return job
  } catch (error) {
    console.error('Error creating escrow job:', error)
    throw error
  }
}

/**
 * Get escrow jobs for a contractor
 */
export async function getContractorEscrowJobs(contractorId: string): Promise<EscrowJob[]> {
  try {
    const { data: jobs, error } = await supabase
      .from('escrow_jobs')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return jobs || []
  } catch (error) {
    console.error('Error fetching contractor escrow jobs:', error)
    throw error
  }
}

/**
 * Update escrow job status
 */
export async function updateEscrowJobStatus(
  jobId: string, 
  status: EscrowJob['status'],
  additionalData?: Partial<EscrowJob>
): Promise<EscrowJob> {
  try {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    }

    // Add completion date if job is completed
    if (status === 'completed') {
      updateData.completion_date = new Date().toISOString()
      updateData.payment_released_date = new Date().toISOString()
    }

    // Add start date if job is in progress
    if (status === 'in_progress' && !additionalData?.start_date) {
      updateData.start_date = new Date().toISOString()
    }

    // Merge any additional data
    if (additionalData) {
      Object.assign(updateData, additionalData)
    }

    const { data: job, error } = await supabase
      .from('escrow_jobs')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single()

    if (error) throw error
    return job
  } catch (error) {
    console.error('Error updating escrow job status:', error)
    throw error
  }
}

/**
 * Get escrow job by ID
 */
export async function getEscrowJob(jobId: string): Promise<EscrowJob | null> {
  try {
    const { data: job, error } = await supabase
      .from('escrow_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      throw error
    }
    return job
  } catch (error) {
    console.error('Error fetching escrow job:', error)
    throw error
  }
}

/**
 * Calculate commission for a given amount
 */
export function calculateCommission(totalAmount: number, commissionRate: number = 10): {
  commissionAmount: number
  contractorPayment: number
} {
  const commissionAmount = totalAmount * (commissionRate / 100)
  const contractorPayment = totalAmount - commissionAmount
  
  return {
    commissionAmount: Math.round(commissionAmount * 100) / 100, // Round to 2 decimal places
    contractorPayment: Math.round(contractorPayment * 100) / 100
  }
}

/**
 * Get escrow job statistics for a contractor
 */
export async function getContractorEscrowStats(contractorId: string): Promise<{
  totalJobs: number
  completedJobs: number
  pendingJobs: number
  inProgressJobs: number
  totalEarnings: number
  totalCommissions: number
}> {
  try {
    const { data: jobs, error } = await supabase
      .from('escrow_jobs')
      .select('status, contractor_payment, commission_amount')
      .eq('contractor_id', contractorId)

    if (error) throw error

    const stats = {
      totalJobs: jobs.length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      pendingJobs: jobs.filter(j => j.status === 'pending').length,
      inProgressJobs: jobs.filter(j => j.status === 'in_progress').length,
      totalEarnings: jobs
        .filter(j => j.status === 'completed')
        .reduce((sum, job) => sum + job.contractor_payment, 0),
      totalCommissions: jobs
        .filter(j => j.status === 'completed')
        .reduce((sum, job) => sum + job.commission_amount, 0)
    }

    return stats
  } catch (error) {
    console.error('Error fetching contractor escrow stats:', error)
    throw error
  }
}
