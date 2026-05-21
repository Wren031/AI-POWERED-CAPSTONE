import { useState, useEffect, useCallback } from "react";
import { lifestyleServices } from "../services/lifestyleServices";
import type { LifestyleTip } from "../types/Lifestyle";
import toast from "react-hot-toast";

export function useLifestyle() {
  const [tips, setTips] = useState<LifestyleTip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTips = useCallback(async () => {
    try {
      setLoading(true);
      const data = await lifestyleServices.getTips();
      setTips(data);
    } catch (err) {
      toast.error("Failed to load lifestyle tips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTips(); }, [fetchTips]);

  const handleDelete = async (id: string) => {
    try {
      await lifestyleServices.deleteTip(id);
      setTips(prev => prev.filter(t => t.id !== id));
      toast.success("Tip removed");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return { tips, loading, fetchTips, handleDelete };
}