'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface AssignmentStats {
  total: number
  pending: number
  accepted: number
  expired: number
}

export default function LeadReassignmentAdmin() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<AssignmentStats | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkExpiredLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/lead-reassignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        setStats(result.stats)
        setLastChecked(new Date())
        toast.success('Lead reassignment check completed successfully!')
      } else {
        toast.error('Failed to check expired leads: ' + result.error)
      }
    } catch (error) {
      console.error('Error checking expired leads:', error)
      toast.error('Error checking expired leads')
    } finally {
      setLoading(false)
    }
  }

  const getStats = async () => {
    try {
      const response = await fetch('/api/lead-reassignment')
      const result = await response.json()

      if (result.success) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lead Reassignment Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage lead assignments to ensure customers always get multiple quotes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span>Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={checkExpiredLeads}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check & Reassign Expired Leads
                </>
              )}
            </Button>
            
            <Button 
              onClick={getStats}
              variant="outline"
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              Refresh Statistics
            </Button>

            {lastChecked && (
              <p className="text-sm text-gray-500 text-center">
                Last checked: {lastChecked.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Assignment Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Assignments</span>
                  <Badge variant="outline">{stats.total}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                    Pending
                  </span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    {stats.pending}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Accepted
                  </span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {stats.accepted}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                    Expired
                  </span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    {stats.expired}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Click "Refresh Statistics" to load data
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">1. Initial Assignment</h3>
              <p className="text-sm text-blue-700">
                When a customer submits a quote request, 3 contractors are randomly assigned with a 24-hour response deadline.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">2. Monitor Expiry</h3>
              <p className="text-sm text-yellow-700">
                The system continuously monitors for assignments that exceed their 24-hour deadline without a response.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">3. Auto Reassign</h3>
              <p className="text-sm text-green-700">
                Expired assignments are automatically reassigned to new contractors to ensure customers get multiple quotes.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Key Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 24-hour response deadline (reduced from 48 hours)</li>
              <li>• Automatic reassignment of expired leads</li>
              <li>• Ensures customers always get at least 3 quotes</li>
              <li>• Excludes contractors already assigned to the same lead</li>
              <li>• Maintains contractor credit system</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
