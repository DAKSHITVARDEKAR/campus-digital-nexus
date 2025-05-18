
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ElectionList from '@/components/elections/ElectionList';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Election } from '@/models/election';
import { useAuth } from '@/contexts/AuthContext';
import useElectionApi from '@/hooks/useElectionApi';
import AccessibleElectionCard from '@/components/elections/AccessibleElectionCard';
import { AccessibilityContext } from '@/contexts/AccessibilityContext';
import UserRoleSwitcher from '@/components/elections/UserRoleSwitcher';

const Elections: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const { user, hasPermission } = useAuth();
  const { loading, error, getElections } = useElectionApi();
  const { highContrast, largeText } = React.useContext(AccessibilityContext);

  useEffect(() => {
    const fetchElections = async () => {
      const result = await getElections();
      if (result && Array.isArray(result)) {
        setElections(result as Election[]);
      }
    };

    fetchElections();
  }, [getElections]);

  const isElectionAdmin = user && hasPermission('manage', 'election');

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${largeText ? 'text-4xl' : ''}`}>Student Council Elections</h1>
            <p className={`text-gray-600 mt-1 ${largeText ? 'text-lg' : ''}`}>
              View upcoming and active elections, cast your vote, and see results
            </p>
          </div>
          {isElectionAdmin && (
            <Button>
              <Plus size={16} className="mr-1" />
              Create Election
            </Button>
          )}
        </div>
        
        <div className="mb-6">
          <UserRoleSwitcher />
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-6 animate-pulse">
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : elections.length > 0 ? (
          <div>
            {highContrast ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elections.map(election => (
                  <AccessibleElectionCard key={election.id} data={election} />
                ))}
              </div>
            ) : (
              <ElectionList elections={elections} loading={loading} error={error} />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No elections available</h3>
            <p className="text-gray-600 mb-6">
              There are currently no upcoming or active elections.
            </p>
            {isElectionAdmin && (
              <Button>
                <Plus size={16} className="mr-1" />
                Create New Election
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Elections;
