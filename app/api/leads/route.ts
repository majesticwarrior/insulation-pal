import { NextRequest, NextResponse } from 'next/server'
import { quoteSchema } from '@/lib/schemas/quote'
import { assignLeadToContractors } from '@/lib/lead-assignment'
import { createServerClient } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export const POST = async (request: NextRequest) => {
  let requestBody: unknown

  try {
    requestBody = await request.json()
  } catch (error) {
    console.error('🚨 Failed to parse lead submission payload:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON payload.'
      },
      { status: 400 }
    )
  }

  const validationResult = quoteSchema.safeParse(requestBody)

  if (!validationResult.success) {
    console.error('🚨 Lead submission validation failed:', validationResult.error.flatten())
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed.',
        details: validationResult.error.flatten()
      },
      { status: 400 }
    )
  }

  const formData = validationResult.data

  const isDemoMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder') ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')

  if (isDemoMode) {
    console.log('🚨 Lead submission running in demo mode. Payload:', formData)
    return NextResponse.json(
      {
        success: true,
        leadId: null,
        mode: 'demo'
      },
      { status: 200 }
    )
  }

  const supabaseClient = createServerClient()

  type LeadInsert = Database['public']['Tables']['leads']['Insert']

  const leadPayload: LeadInsert = {
    home_size_sqft: parseInt(formData.homeSize, 10),
    areas_needed: formData.areas,
    insulation_types: formData.insulationTypes,
    additional_services: formData.additionalServices || [],
    ceiling_fan_count: formData.ceilingFanCount ? parseInt(formData.ceilingFanCount, 10) : null,
    project_type: formData.projectType || 'residential',
    attic_insulation_depth: formData.atticInsulationDepth || null,
    quote_preference: formData.quotePreference,
    customer_name: formData.customerName,
    customer_email: formData.customerEmail,
    customer_phone: formData.customerPhone,
    city: formData.city,
    state: formData.state,
    zip_code: formData.zipCode,
    property_address: formData.address
  }

  try {
    const { data: lead, error: insertError } = await supabaseClient
      .from('leads')
      .insert<LeadInsert[]>([leadPayload])
      .select()
      .single()

    if (insertError) {
      console.error('🚨 Failed to insert lead:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: insertError.message ?? 'Failed to create lead.'
        },
        { status: 500 }
      )
    }

    try {
      await assignLeadToContractors(lead, supabaseClient)
    } catch (assignmentError) {
      console.error('🚨 Failed to assign lead to contractors:', assignmentError)
      return NextResponse.json(
        {
          success: false,
          error:
            (assignmentError as Error)?.message ??
            'Lead created, but contractor assignment failed.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('🚨 Unexpected error while processing lead submission:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected server error. Please try again.'
      },
      { status: 500 }
    )
  }
}

