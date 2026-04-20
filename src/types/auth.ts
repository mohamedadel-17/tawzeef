export type UserRole = "admin" | "user";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cvUrl?: string;
}