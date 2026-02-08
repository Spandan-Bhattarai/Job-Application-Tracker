import { useState, useEffect } from 'react';
import { useNhostClient } from '@nhost/react';
import { Application } from '../lib/nhost';
import { useAuth } from './useAuth';

const APPLICATIONS_QUERY = `
  query GetApplications($userId: uuid!) {
    applications(where: { user_id: { _eq: $userId } }, order_by: { date_applied: desc }) {
      id
      user_id
      company_name
      position
      date_applied
      status
      notes
      recontact_date
      custom_tags
      is_archived
      created_at
      updated_at
    }
  }
`;

const INSERT_APPLICATION = `
  mutation InsertApplication($object: applications_insert_input!) {
    insert_applications_one(object: $object) {
      id
      user_id
      company_name
      position
      date_applied
      status
      notes
      recontact_date
      custom_tags
      is_archived
      created_at
      updated_at
    }
  }
`;

const UPDATE_APPLICATION = `
  mutation UpdateApplication($id: uuid!, $userId: uuid!, $updates: applications_set_input!) {
    update_applications(where: { id: { _eq: $id }, user_id: { _eq: $userId } }, _set: $updates) {
      returning {
        id
        user_id
        company_name
        position
        date_applied
        status
        notes
        recontact_date
        custom_tags
        is_archived
        created_at
        updated_at
      }
    }
  }
`;

const DELETE_APPLICATION = `
  mutation DeleteApplication($id: uuid!, $userId: uuid!) {
    delete_applications(where: { id: { _eq: $id }, user_id: { _eq: $userId } }) {
      affected_rows
    }
  }
`;

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const nhost = useNhostClient();

  const fetchApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await nhost.graphql.request(APPLICATIONS_QUERY, {
        userId: user.id,
      });

      if (error) throw new Error(Array.isArray(error) ? error[0]?.message : error.message);
      setApplications((data as any)?.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const addApplication = async (application: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Don't include user_id - Hasura sets it automatically from the session
      const { data, error } = await nhost.graphql.request(INSERT_APPLICATION, {
        object: application,
      });

      if (error) throw new Error(Array.isArray(error) ? error[0]?.message : error.message);
      
      const newApp = (data as any)?.insert_applications_one;
      if (newApp) {
        setApplications(prev => [newApp, ...prev]);
      }
      return { data: newApp, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { error };
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Remove id, user_id, created_at, updated_at from updates as they shouldn't be updated
      const { id: _, user_id: __, created_at: ___, updated_at: ____, ...cleanUpdates } = updates as Application;
      
      const { data, error } = await nhost.graphql.request(UPDATE_APPLICATION, {
        id,
        userId: user.id,
        updates: cleanUpdates,
      });

      if (error) throw new Error(Array.isArray(error) ? error[0]?.message : error.message);
      
      const updatedApp = (data as any)?.update_applications?.returning?.[0];
      if (updatedApp) {
        setApplications(prev => prev.map(app => app.id === id ? updatedApp : app));
      }
      return { data: updatedApp, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { error };
    }
  };

  const deleteApplication = async (id: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await nhost.graphql.request(DELETE_APPLICATION, {
        id,
        userId: user.id,
      });

      if (error) throw new Error(Array.isArray(error) ? error[0]?.message : error.message);
      
      setApplications(prev => prev.filter(app => app.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { error };
    }
  };

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications,
  };
}