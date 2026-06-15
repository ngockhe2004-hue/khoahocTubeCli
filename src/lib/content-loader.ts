import fs from 'fs';
import path from 'path';
import type { Course, Lesson } from './types';

// Base directory for all course content
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'courses');

/**
 * Ensures the content directory exists
 */
function ensureContentDir(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

/**
 * Read and parse a JSON file safely
 */
function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[content-loader] Failed to read ${filePath}:`, err);
    return null;
  }
}

/**
 * Get all courses (reads every meta.json under content/courses/*)
 */
export function getAllCourses(): Course[] {
  ensureContentDir();
  try {
    const courseDirs = fs
      .readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    const courses: Course[] = [];
    for (const dir of courseDirs) {
      const metaPath = path.join(CONTENT_DIR, dir, 'meta.json');
      const course = readJsonFile<Course>(metaPath);
      if (course) courses.push(course);
    }
    return courses;
  } catch (err) {
    console.error('[content-loader] Failed to list courses:', err);
    return [];
  }
}

/**
 * Get a single course by ID
 */
export function getCourse(courseId: string): Course | null {
  const metaPath = path.join(CONTENT_DIR, courseId, 'meta.json');
  return readJsonFile<Course>(metaPath);
}

/**
 * Get a single lesson by courseId + lessonId
 */
export function getLesson(courseId: string, lessonId: string): Lesson | null {
  const lessonPath = path.join(
    CONTENT_DIR,
    courseId,
    'lessons',
    `${lessonId}.json`
  );
  return readJsonFile<Lesson>(lessonPath);
}

/**
 * Get all lessons for a course (in order)
 */
export function getAllLessons(courseId: string): Lesson[] {
  const lessonsDir = path.join(CONTENT_DIR, courseId, 'lessons');
  try {
    if (!fs.existsSync(lessonsDir)) return [];

    const files = fs
      .readdirSync(lessonsDir)
      .filter((f) => f.endsWith('.json'));

    const lessons: Lesson[] = [];
    for (const file of files) {
      const lesson = readJsonFile<Lesson>(path.join(lessonsDir, file));
      if (lesson) lessons.push(lesson);
    }

    // Sort by order field
    return lessons.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err) {
    console.error(`[content-loader] Failed to read lessons for ${courseId}:`, err);
    return [];
  }
}

/**
 * Save a lesson JSON file (used by API routes)
 */
export function saveLesson(courseId: string, lesson: Lesson): void {
  const lessonsDir = path.join(CONTENT_DIR, courseId, 'lessons');
  fs.mkdirSync(lessonsDir, { recursive: true });
  const filePath = path.join(lessonsDir, `${lesson.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2), 'utf-8');
}

/**
 * Save course meta.json (used by API routes)
 */
export function saveCourse(course: Course): void {
  const courseDir = path.join(CONTENT_DIR, course.id);
  fs.mkdirSync(courseDir, { recursive: true });
  const filePath = path.join(courseDir, 'meta.json');
  fs.writeFileSync(filePath, JSON.stringify(course, null, 2), 'utf-8');
}

/**
 * Delete a lesson file
 */
export function deleteLesson(courseId: string, lessonId: string): boolean {
  const filePath = path.join(CONTENT_DIR, courseId, 'lessons', `${lessonId}.json`);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
