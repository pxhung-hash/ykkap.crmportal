/**
 * Supabase Connection Test Component
 * Use this to verify your Supabase setup is working correctly
 */

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../utils/supabaseClient';
import { materials } from '../utils/supabaseHelpers';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function SupabaseConnectionTest() {
  const [testResults, setTestResults] = useState<{
    connection: 'pending' | 'success' | 'error';
    auth: 'pending' | 'success' | 'error';
    database: 'pending' | 'success' | 'error';
    materials: 'pending' | 'success' | 'error';
    error?: string;
    materialCount?: number;
  }>({
    connection: 'pending',
    auth: 'pending',
    database: 'pending',
    materials: 'pending',
  });

  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = { ...testResults };

    // Test 1: Connection
    try {
      const { data, error } = await supabase.from('materials').select('count').limit(1);
      if (error) throw error;
      results.connection = 'success';
    } catch (error: any) {
      results.connection = 'error';
      results.error = error.message;
      setTestResults(results);
      setTesting(false);
      return;
    }

    // Test 2: Auth
    try {
      const { data: { session } } = await supabase.auth.getSession();
      results.auth = session ? 'success' : 'pending';
    } catch (error: any) {
      results.auth = 'error';
      results.error = error.message;
    }

    // Test 3: Database Query
    try {
      const { count, error } = await supabase
        .from('product_categories')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      results.database = 'success';
    } catch (error: any) {
      results.database = 'error';
      results.error = error.message;
    }

    // Test 4: Materials Helper
    try {
      const data = await materials.getAll();
      results.materials = 'success';
      results.materialCount = data.length;
    } catch (error: any) {
      results.materials = 'error';
      results.error = error.message;
    }

    setTestResults(results);
    setTesting(false);
  };

  const StatusIcon = ({ status }: { status: 'pending' | 'success' | 'error' }) => {
    if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-600" />;
    return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>
            Verify that your Supabase backend is properly configured and connected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusIcon status={testResults.connection} />
                <span className="font-medium">Supabase Connection</span>
              </div>
              <span className="text-sm text-gray-600">
                {testResults.connection === 'success' ? 'Connected' : 
                 testResults.connection === 'error' ? 'Failed' : 'Not tested'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusIcon status={testResults.auth} />
                <span className="font-medium">Authentication System</span>
              </div>
              <span className="text-sm text-gray-600">
                {testResults.auth === 'success' ? 'Logged in' : 
                 testResults.auth === 'error' ? 'Error' : 'No session'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusIcon status={testResults.database} />
                <span className="font-medium">Database Tables</span>
              </div>
              <span className="text-sm text-gray-600">
                {testResults.database === 'success' ? 'Accessible' : 
                 testResults.database === 'error' ? 'Not found' : 'Not tested'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusIcon status={testResults.materials} />
                <span className="font-medium">Sample Data (Materials)</span>
              </div>
              <span className="text-sm text-gray-600">
                {testResults.materials === 'success' ? `${testResults.materialCount} items found` : 
                 testResults.materials === 'error' ? 'Query failed' : 'Not tested'}
              </span>
            </div>
          </div>

          {testResults.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-900 mb-1">Error Details:</p>
              <p className="text-xs text-red-700 font-mono">{testResults.error}</p>
            </div>
          )}

          <div className="pt-4">
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Run Connection Test'
              )}
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Run database migrations in Supabase SQL Editor</li>
              <li>Create test users in Authentication panel</li>
              <li>Add users to public.users table</li>
              <li>Run this test to verify everything works</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900 font-medium">
                📚 See <code className="bg-blue-100 px-1 rounded">SUPABASE_SETUP_GUIDE.md</code> for detailed instructions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
