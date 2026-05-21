import { useState, useEffect, useCallback, useMemo } from "react";
import { conditionService } from "../services/conditionService";
import { delay } from "../../../utils/delay";

interface ConditionPayload {
  name: string;
  description: string;
}

export default function useCondition() {
  const [conditions, setConditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const totalConditions = useMemo(() => conditions.length, [conditions]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      const data = await conditionService.getAll();
      const elapsed = Date.now() - startTime;
      if (elapsed < 800) await delay(800 - elapsed);
      setConditions(data);
    } catch (error) {
      console.error("Failed to fetch conditions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addCondition = async (payload: ConditionPayload) => {
    try {
      setIsSaving(true);
      await delay(500); 
      const newCondition = await conditionService.create(payload);
      setConditions((prev) => [newCondition, ...prev]);
      return true;
    } catch (error) {
      console.error("Error adding condition:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

const updateCondition = async (id: number, payload: ConditionPayload) => {
  try {
    setIsSaving(true);
    await delay(500);
    const updated = await conditionService.update(id, payload);
    
    if (updated) {
      setConditions((prev) => {
        // Create a NEW array reference para mo-trigger ang UI update
        const updatedList = prev.map((c) => (c.id === id ? updated : c));
        return [...updatedList]; 
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating condition:", error);
    return false;
  } finally {
    setIsSaving(false);
  }
};

  const deleteCondition = async (id: number) => {
    try {
      await conditionService.remove(id);
      setConditions((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting condition:", error);
    }
  };

  return {
    conditions,
    totalConditions,
    loading,
    isSaving,
    showAdd,
    setShowAdd,
    addCondition,
    updateCondition,
    deleteCondition,
    refresh: fetchData
  };
}