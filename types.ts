export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ResumeAnalysis {
  analysis: string;
  suggestions: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

export interface ScheduledEvent {
  date: string;
  topic: string;
  activities: string[];
}

export interface VideoSegment {
  segmentName: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  description: string;
  mockDownloadUrl?: string; // Added for simulated download functionality
}

export interface FileData {
  data: string; // Base64 encoded string
  mimeType: string;
}

export interface CourseObjective {
  objective: string;
}

export interface CourseTopic {
  title: string;
  objectives: CourseObjective[];
}

export interface CourseModule {
  title: string;
  description: string;
  topics: CourseTopic[];
}

export type CourseOutline = CourseModule[];