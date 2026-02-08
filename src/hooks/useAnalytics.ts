import { useState, useEffect } from 'react';
import { useNhostClient } from '@nhost/react';
import { Analytics } from '../lib/nhost';
import { useAuth } from './useAuth';

const ANALYTICS_QUERY = `
  query GetAnalytics($userId: uuid!) {
    analytics(where: { user_id: { _eq: $userId } }, limit: 1) {
      id
      user_id
      total_applications
      active_applications
      interviews_scheduled
      rejected_applications
      last_updated
    }
  }
`;

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const nhost = useNhostClient();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await nhost.graphql.request(ANALYTICS_QUERY, {
        userId: user.id,
      });

      if (error) throw new Error(Array.isArray(error) ? error[0]?.message : error.message);
      setAnalytics((data as any)?.analytics?.[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}