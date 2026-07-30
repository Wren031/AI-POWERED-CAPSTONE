import { useEffect, useState } from "react";
import type { Recommendation } from "../types/Recommendation";
import { recommendationService } from "../services/recommendationService";
import { delay } from "../../../utils/delay";

export default function useRecommendations() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selected, setSelected] = useState<Recommendation | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await recommendationService.getAll();
      await delay(500);
      setData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (newRec: Recommendation) => {
    try {
      setIsSaving(true);
      await recommendationService.create(newRec);
      await delay(500);
      await fetchData();
    } catch (error) {
      console.error("Add error:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (updatedRec: Recommendation) => {
    try {
      setIsSaving(true);
      await recommendationService.update(updatedRec);
      await delay(500);
      await fetchData();
      setSelected(null);
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      await recommendationService.delete(id);
      await delay(500);
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (rec: Recommendation) => setSelected(rec);

  return {
    data,
    loading,
    isDeleting,
    isSaving,
    selected,
    setSelected,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleEdit,
  };
}