import { useState, useEffect, useCallback } from 'react';
import { admin_skin_result_service } from '../service/admin_skin_result_service';


export function useAdminSkinHistory() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const data = await admin_skin_result_service.getAllSkinResultsWithDetails();
    setResults(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { results, loading, refresh: fetchLogs };
}