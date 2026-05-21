import type { Recommendation } from "../../recommendations/types/Recommendation";
import type { User } from "../../users/types/User";

export interface UserScan {
  id: string;
  user: User;
  imageUrl: string;
  date: string;
  condition: string;
  accuracy: number;
  recommendation: Recommendation;
  created_at?: string;
}