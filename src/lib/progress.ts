import type { UserProgress } from './types';

const STORAGE_PREFIX = 'lms_progress_';

function getKey(courseId: string): string {
  return `${STORAGE_PREFIX}${courseId}`;
}

/**
 * Get progress for a course from localStorage
 */
export function getProgress(courseId: string): UserProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getKey(courseId));
    if (!raw) return null;
    return JSON.parse(raw) as UserProgress;
  } catch {
    return null;
  }
}

/**
 * Initialize progress for a course if it doesn't exist
 */
function initProgress(courseId: string): UserProgress {
  return {
    courseId,
    completedLessons: [],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Save progress to localStorage
 */
function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    progress.updatedAt = new Date().toISOString();
    localStorage.setItem(getKey(progress.courseId), JSON.stringify(progress));
  } catch (err) {
    console.error('[progress] Failed to save progress:', err);
  }
}

/**
 * Mark a lesson as completed
 */
export function markComplete(courseId: string, lessonId: string): UserProgress {
  const progress = getProgress(courseId) ?? initProgress(courseId);
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  progress.lastLesson = lessonId;
  saveProgress(progress);
  return progress;
}

/**
 * Mark a lesson as incomplete (uncomplete)
 */
export function markIncomplete(courseId: string, lessonId: string): UserProgress {
  const progress = getProgress(courseId) ?? initProgress(courseId);
  progress.completedLessons = progress.completedLessons.filter(
    (id) => id !== lessonId
  );
  saveProgress(progress);
  return progress;
}

/**
 * Update the last visited lesson
 */
export function updateLastLesson(courseId: string, lessonId: string): void {
  const progress = getProgress(courseId) ?? initProgress(courseId);
  progress.lastLesson = lessonId;
  saveProgress(progress);
}

/**
 * Update quiz score for a course
 */
export function updateScore(courseId: string, score: number): UserProgress {
  const progress = getProgress(courseId) ?? initProgress(courseId);
  // Keep the highest score
  if (progress.score === undefined || score > progress.score) {
    progress.score = score;
  }
  saveProgress(progress);
  return progress;
}

/**
 * Check if a specific lesson is completed
 */
export function isLessonComplete(courseId: string, lessonId: string): boolean {
  const progress = getProgress(courseId);
  if (!progress) return false;
  return progress.completedLessons.includes(lessonId);
}

/**
 * Calculate completion percentage
 */
export function getCompletionPercent(
  courseId: string,
  totalLessons: number
): number {
  if (totalLessons === 0) return 0;
  const progress = getProgress(courseId);
  if (!progress) return 0;
  const completed = progress.completedLessons.length;
  return Math.round((completed / totalLessons) * 100);
}

/**
 * Reset progress for a course
 */
export function resetProgress(courseId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getKey(courseId));
}

/**
 * Get all course progress records from localStorage
 */
export function getAllProgress(): UserProgress[] {
  if (typeof window === 'undefined') return [];
  const results: UserProgress[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) results.push(JSON.parse(raw) as UserProgress);
      } catch {
        // ignore malformed entries
      }
    }
  }
  return results;
}
