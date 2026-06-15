// ─── Course & Module ───────────────────────────────────────────────────────────

export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Module {
  id: string;
  title: string;
  lessons: string[]; // lesson IDs
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: Level;
  tags: string[];
  estimatedHours: number;
  modules: Module[];
}

// ─── Lesson Types ──────────────────────────────────────────────────────────────

export type LessonType = 'text' | 'video' | 'code' | 'quiz';

export interface LessonBase {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  order: number;
}

export interface TextLesson extends LessonBase {
  type: 'text';
  content: string; // MDX/Markdown string
}

export interface VideoChapter {
  time: number; // seconds
  title: string;
}

export interface VideoLesson extends LessonBase {
  type: 'video';
  videoUrl: string;
  description?: string;
  chapters: VideoChapter[];
  transcript?: string;
}

export interface CodeTest {
  input: string;
  expected: string;
}

export interface CodeLesson extends LessonBase {
  type: 'code';
  language: string;
  description: string;
  instructions: string;
  starterCode: string;
  solution: string;
  tests?: CodeTest[];
  hints: string[];
}

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number; // index of correct option
  explain: string;
}

export interface QuizLesson extends LessonBase {
  type: 'quiz';
  questions: QuizQuestion[];
}

export type Lesson = TextLesson | VideoLesson | CodeLesson | QuizLesson;

// ─── User Progress ─────────────────────────────────────────────────────────────

export interface UserProgress {
  courseId: string;
  completedLessons: string[]; // lesson IDs
  lastLesson?: string; // last visited lesson ID
  score?: number; // quiz score (0-100)
  updatedAt: string; // ISO date string
}

// ─── API Payloads ──────────────────────────────────────────────────────────────

export interface CreateLessonPayload {
  courseId: string;
  lesson: Lesson;
}

export interface UpdateLessonPayload {
  lesson: Lesson;
}

export interface CreateCoursePayload {
  course: Course;
}

export interface UpdateCoursePayload {
  course: Partial<Course>;
}
