'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { diagnoseSupabaseConfig } from '@/lib/supabase-diagnostic'

export default function SupabaseDebugPage() {
  const [diagnosis, setDiagnosis] = useState<any>(null)
  const [connectionTest, setConnectionTest] = useState<any>(null)

  useEffect(() => {
    // Run diagnostics
    const diag = diagnoseSupabaseConfig()
    setDiagnosis(diag)

    // Test connection
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      console.log('🔍 Testing Supabase connection...')
      
      const { data, error } = await supabase
        .from('contractors')
        .select('id')
        .limit(1)

      setConnectionTest({
        success: !error,
        error: error?.message || null,
        data: data?.length || 0,
        timestamp: new Date().toISOString()
      })

      if (error) {
        console.error('❌ Connection test failed:', error)
      } else {
        console.log('✅ Connection test passed:', data?.length || 0, 'records found')
      }
    } catch (err: any) {
      console.error('🚨 Critical connection error:', err)
      setConnectionTest({
        success: false,
        error: err.message,
        data: 0,
        timestamp: new Date().toISOString()
      })
    }
  }

  if (!diagnosis) {
    return <div className="p-8">Loading diagnostics...</div>
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Supabase Configuration Diagnostics</h1>
      
      {/* Environment Status */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Environment:</strong> {diagnosis.diagnosis.environment}
          </div>
          <div>
            <strong>Demo Mode:</strong> {diagnosis.diagnosis.isDemoMode ? '🚨 YES' : '✅ NO'}
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Configuration Details</h2>
        <div className="space-y-2 text-sm font-mono">
          <div>
            <strong>URL:</strong> {diagnosis.config.url}
          </div>
          <div>
            <strong>Anon Key:</strong> {diagnosis.config.anonKey}
          </div>
          <div>
            <strong>Service Key:</strong> {diagnosis.config.serviceKey}
          </div>
        </div>
      </div>

      {/* Validation Results */}
      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Has URL:</strong> {diagnosis.diagnosis.hasUrl ? '✅' : '❌'}
          </div>
          <div>
            <strong>Has Anon Key:</strong> {diagnosis.diagnosis.hasAnonKey ? '✅' : '❌'}
          </div>
          <div>
            <strong>URL is Placeholder:</strong> {diagnosis.diagnosis.urlIsPlaceholder ? '❌' : '✅'}
          </div>
          <div>
            <strong>Key is Placeholder:</strong> {diagnosis.diagnosis.anonKeyIsPlaceholder ? '❌' : '✅'}
          </div>
        </div>
      </div>

      {/* Connection Test */}
      <div className={`rounded-lg p-6 mb-6 ${connectionTest?.success ? 'bg-green-50' : 'bg-red-50'}`}>
        <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
        {connectionTest ? (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Status:</strong> {connectionTest.success ? '✅ Success' : '❌ Failed'}
            </div>
            <div>
              <strong>Timestamp:</strong> {connectionTest.timestamp}
            </div>
            {connectionTest.error && (
              <div>
                <strong>Error:</strong> {connectionTest.error}
              </div>
            )}
            {connectionTest.success && (
              <div>
                <strong>Records Found:</strong> {connectionTest.data}
              </div>
            )}
          </div>
        ) : (
          <div>Testing connection...</div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <div className="space-y-2 text-sm">
          {diagnosis.recommendations.map((rec: string, index: number) => (
            <div key={index}>{rec}</div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-x-4">
        <button 
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retest Connection
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Refresh Diagnostics
        </button>
      </div>
    </div>
  )
}
