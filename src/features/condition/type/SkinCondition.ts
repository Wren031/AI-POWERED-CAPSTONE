export interface SkinCondition {
  id: number;
  name: string;
  created_at: string;
}

export type ConditionInsert = {
  name: string;
};