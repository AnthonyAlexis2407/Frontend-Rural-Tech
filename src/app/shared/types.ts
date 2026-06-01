export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  name: string;
  email: string;
  location?: string;
  role: UserRole;
}

export interface CatalogCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  modules: number;
  level: string;
  instructor: string;
  image: string;
  color: string;
  available: boolean;
}

export interface FaqItem {
  id: number;
  questionKey: string;
  answerKey: string;
  open: boolean;
}

export type AuthResult =
  | { success: true }
  | { success: false; error: 'invalid' | 'not_found' | 'exists' };
