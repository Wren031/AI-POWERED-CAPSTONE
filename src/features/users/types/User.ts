import type { UserStatus } from "./UserStatus";

export interface User {
  id: number;
  avatar_url: string;
  first_name: string;
  middle_name: string;
  last_name: string
  suffix: string;
  date_of_birth: number;
  gender: string;
  phone_number: string;
  address: string;
  status: UserStatus;
  created_at: string;
  updated_at: string
}