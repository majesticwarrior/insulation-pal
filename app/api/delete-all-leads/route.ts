import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(req: NextRequest) {
  try {
    console.log('🗑️ Deleting all leads and lead assignments...')

    // Delete all lead assignments first (foreign key constraint)
    const { error: assignmentError } = await supabase
      .from('lead_assignments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (assignmentError) {
      console.error('❌ Error deleting lead assignments:', assignmentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete lead assignments',
        details: assignmentError 
      }, { status: 500 })
    }

    console.log('✅ Lead assignments deleted successfully')

    // Delete all leads
    const { error: leadError } = await supabase
      .from('leads')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (leadError) {
      console.error('❌ Error deleting leads:', leadError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete leads',
        details: leadError 
      }, { status: 500 })
    }

    console.log('✅ All leads deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'All leads and lead assignments deleted successfully!'
    })

  } catch (error: any) {
    console.error('❌ Error deleting leads:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
