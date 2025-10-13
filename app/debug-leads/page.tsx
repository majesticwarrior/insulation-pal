'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugLeadsPage() {
  const [data, setData] = useState<any>(null)
  const [testResult, setTestResult] = useState<string>('')
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError('')
      
      const [contractorsRes, leadsRes, assignmentsRes, areasRes] = await Promise.all([
        supabase.from('contractors').select('id, business_name, credits, status').eq('status', 'approved'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('lead_assignments').select('*, contractors(business_name), leads(customer_name, city, state)').order('created_at', { ascending: false }).limit(20),
        supabase.from('contractor_service_areas').select('id, city, state, contractor_id, contractors(business_name, credits)')
      ])

      setData({
        contractors: contractorsRes.data || [],
        leads: leadsRes.data || [],
        assignments: assignmentsRes.data || [],
        areas: areasRes.data || []
      })
    } catch (err: any) {
      setError(`Error loading data: ${err.message}`)
    }
  }

  const handleTestClick = async (leadId: string, city: string, state: string) => {
    setTesting(true)
    setTestResult(`Testing assignment for lead ${leadId} in ${city}, ${state}...\n\n`)
    
    try {
      // Normalize state
      const stateAbbr = state === 'Arizona' ? 'AZ' : state
      setTestResult(prev => prev + `State normalized: ${state} => ${stateAbbr}\n\n`)
      
      // Get service areas
      const { data: areas } = await supabase
        .from('contractor_service_areas')
        .select('contractor_id')
        .eq('city', city)
        .eq('state', stateAbbr)
      
      setTestResult(prev => prev + `Found ${areas?.length || 0} service areas\n`)
      
      if (!areas || areas.length === 0) {
        setTestResult(prev => prev + `No contractors serve ${city}, ${stateAbbr}`)
        setTesting(false)
        return
      }
      
      // Get contractors with credits
      const contractorIds = areas.map(a => a.contractor_id)
      const { data: contractors } = await supabase
        .from('contractors')
        .select('id, business_name, credits')
        .in('id', contractorIds)
        .eq('status', 'approved')
        .gt('credits', 0)
      
      setTestResult(prev => prev + `Found ${contractors?.length || 0} contractors with credits\n`)
      
      if (!contractors || contractors.length === 0) {
        setTestResult(prev => prev + `No contractors with credits in ${city}`)
        setTesting(false)
        return
      }
      
      contractors.forEach(c => {
        setTestResult(prev => prev + `  - ${c.business_name}: ${c.credits} credits\n`)
      })
      
      // Create assignments
      const selected = contractors.slice(0, 3)
      const assignments = selected.map(c => ({
        lead_id: leadId,
        contractor_id: c.id,
        status: 'pending',
        cost: 20.00
      }))
      
      const { data: result, error: assignError } = await supabase
        .from('lead_assignments')
        .insert(assignments)
        .select()
      
      if (assignError) {
        setTestResult(prev => prev + `\nERROR: ${assignError.message}`)
      } else {
        setTestResult(prev => prev + `\nSUCCESS! Created ${result?.length || 0} assignments!`)
        await loadData()
      }
    } catch (err: any) {
      setTestResult(prev => prev + `\nERROR: ${err.message}`)
    } finally {
      setTesting(false)
    }
  }

  if (!data) {
    return <div className="p-8">Loading...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>
  }

  const contractorsWithCredits = data.contractors.filter((c: any) => c.credits > 0)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Lead Assignment Debug</h1>

      {/* Test Results */}
      {testResult && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Test Results:</h2>
          <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          <button
            type="button"
            onClick={() => setTestResult('')}
            className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm"
          >
            Clear
          </button>
        </div>
      )}

      {/* Contractors */}
      <div className="mb-6 p-4 bg-green-50 rounded border">
        <h2 className="font-bold text-lg mb-2">
          Contractors with Credits: {contractorsWithCredits.length}
        </h2>
        {contractorsWithCredits.map((c: any) => (
          <div key={c.id} className="text-sm py-1">
            ✓ {c.business_name} - {c.credits} credits
          </div>
        ))}
      </div>

      {/* Service Areas */}
      <div className="mb-6 p-4 bg-blue-50 rounded border">
        <h2 className="font-bold text-lg mb-2">
          Service Areas: {data.areas.length}
        </h2>
        <div className="text-sm space-y-1">
          {Object.entries(
            data.areas.reduce((acc: any, area: any) => {
              const key = `${area.city}, ${area.state}`
              if (!acc[key]) acc[key] = []
              acc[key].push({
                name: area.contractors?.business_name,
                credits: area.contractors?.credits
              })
              return acc
            }, {})
          ).map(([location, contractors]: [string, any]) => (
            <div key={location}>
              <span className="font-semibold">{location}:</span>{' '}
              {contractors.map((c: any, i: number) => (
                <span key={i} className={c.credits > 0 ? 'text-green-600' : 'text-red-600'}>
                  {c.name} ({c.credits}){i < contractors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="mb-6 p-4 bg-purple-50 rounded border">
        <h2 className="font-bold text-lg mb-2">
          Recent Leads: {data.leads.length}
        </h2>
        {data.leads.map((lead: any) => {
          const leadAssignments = data.assignments.filter((a: any) => a.lead_id === lead.id)
          return (
            <div key={lead.id} className="mb-3 p-3 bg-white rounded border">
              <div className="font-semibold">{lead.customer_name}</div>
              <div className="text-sm text-gray-600">
                {lead.city}, {lead.state} - {new Date(lead.created_at).toLocaleString()}
              </div>
              <div className="mt-2">
                {leadAssignments.length > 0 ? (
                  <div className="text-green-600 text-sm">
                    ✅ Assigned to: {leadAssignments.map((a: any) => a.contractors?.business_name).join(', ')}
                  </div>
                ) : (
                  <div>
                    <div className="text-red-600 text-sm mb-2">❌ Not assigned</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleTestClick(lead.id, lead.city, lead.state)
                      }}
                      disabled={testing}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {testing ? 'Testing...' : 'Test Assignment'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Assignments */}
      <div className="mb-6 p-4 bg-gray-50 rounded border">
        <h2 className="font-bold text-lg mb-2">
          Recent Assignments: {data.assignments.length}
        </h2>
        {data.assignments.map((a: any) => (
          <div key={a.id} className="text-sm py-1">
            {a.contractors?.business_name} ← {a.leads?.customer_name} ({a.leads?.city}) - {a.status}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => loadData()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  )
}
