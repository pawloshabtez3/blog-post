'use client'

import { useState } from 'react'
import { verifySupabaseConnection, verifyRLSPolicies } from '@/lib/supabase/verify'

export default function TestSupabasePage() {
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [rlsResult, setRlsResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    const result = await verifySupabaseConnection()
    setConnectionResult(result)
    setLoading(false)
  }

  const testRLS = async () => {
    setLoading(true)
    const result = await verifyRLSPolicies()
    setRlsResult(result)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Supabase Setup Verification
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Connection Test
          </h2>
          <p className="text-gray-600 mb-4">
            Verify that Supabase client can connect and environment variables are set correctly.
          </p>
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          {connectionResult && (
            <div
              className={`mt-4 p-4 rounded ${
                connectionResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`font-semibold ${
                  connectionResult.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {connectionResult.success ? '✓ Success' : '✗ Failed'}
              </p>
              <p
                className={
                  connectionResult.success ? 'text-green-700' : 'text-red-700'
                }
              >
                {connectionResult.message}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            RLS Policies Test
          </h2>
          <p className="text-gray-600 mb-4">
            Verify that Row Level Security policies are configured correctly.
          </p>
          <button
            onClick={testRLS}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test RLS Policies'}
          </button>

          {rlsResult && (
            <div
              className={`mt-4 p-4 rounded ${
                rlsResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`font-semibold ${
                  rlsResult.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {rlsResult.success ? '✓ Success' : '✗ Failed'}
              </p>
              <p className={rlsResult.success ? 'text-green-700' : 'text-red-700'}>
                {rlsResult.message}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Setup Instructions
          </h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-2">
            <li>Create a Supabase project at https://supabase.com</li>
            <li>Execute the SQL schema from supabase-schema.sql</li>
            <li>Copy .env.local.example to .env.local</li>
            <li>Add your Supabase URL and anon key to .env.local</li>
            <li>Restart the development server</li>
            <li>Run the tests above to verify setup</li>
          </ol>
          <p className="mt-4 text-sm text-blue-700">
            See SUPABASE_SETUP.md for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  )
}
