export interface Teacher {
  id: string;
  name: string;
  photoUrl: string | null;
  displayOrder: number;
  subject?: string;
}

export interface Vote {
  id: string;
  teacherId: string;
  createdAt: string; // ISO 8601 string
  eventName: string;
}

export type VotingStatus = 'OPEN' | 'LOCKED';

export interface AppSetting {
  key: string;
  value: string | number | boolean;
  updatedAt: string;
}

export interface AppMetadata {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  updatedAt: string;
}

export interface TeacherResult extends Teacher {
  votes: number;
  percentage: number;
  rank: number;
}

export interface ElectionResults {
  results: TeacherResult[];
  totalVotes: number;
  winners: TeacherResult[];
  isTie: boolean;
  lastVoteAt: string | null;
}

export type AppView = 
  | 'student-welcome'
  | 'student-voting'
  | 'student-confirm'
  | 'student-success'
  | 'admin-login'
  | 'admin-dashboard'
  | 'results';
