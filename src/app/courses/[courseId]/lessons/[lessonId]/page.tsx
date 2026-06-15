import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse, getLesson, getAllLessons } from '@/lib/content-loader';
import LessonViewer from '@/components/lesson/LessonViewer';
import Sidebar from '@/components/layout/Sidebar';
import { ArrowLeft, ArrowRight, BookOpen, FileText, Video, Code2, HelpCircle } from 'lucide-react';
import type { LessonType } from '@/lib/types';

interface Props {
  params: { courseId: string; lessonId: string };
}

export const dynamic = 'force-dynamic';

const typeIcons: Record<LessonType, React.ElementType> = {
  text: FileText,
  video: Video,
  code: Code2,
  quiz: HelpCircle,
};

const typeColors: Record<LessonType, string> = {
  text: 'bg-blue-100 text-blue-600',
  video: 'bg-purple-100 text-purple-600',
  code: 'bg-green-100 text-green-600',
  quiz: 'bg-orange-100 text-orange-600',
};

export async function generateMetadata({ params }: Props) {
  const lesson = getLesson(params.courseId, params.lessonId);
  return {
    title: lesson ? `${lesson.title} · LMS` : 'Bài học · LMS',
  };
}

export default function LessonPage({ params }: Props) {
  const { courseId, lessonId } = params;

  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);

  if (!course || !lesson) notFound();

  const allLessons = getAllLessons(courseId);

  // Collect all lesson IDs in order across modules
  const orderedLessonIds = course.modules.flatMap((m) => m.lessons);

  const currentIdx = orderedLessonIds.indexOf(lessonId);
  const prevLessonId = currentIdx > 0 ? orderedLessonIds[currentIdx - 1] : null;
  const nextLessonId = currentIdx < orderedLessonIds.length - 1 ? orderedLessonIds[currentIdx + 1] : null;

  const TypeIcon = typeIcons[lesson.type];
  const typeColorClass = typeColors[lesson.type];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        courseId={courseId}
        modules={course.modules}
        lessons={allLessons}
        completedLessons={[]} // Will be hydrated client-side inside Sidebar
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href={`/courses/${courseId}`} className="hover:text-blue-600 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate">{lesson.title}</span>
          </div>

          {/* Lesson header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${typeColorClass}`}>
                <TypeIcon className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500 capitalize font-medium">{lesson.type}</span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">{lesson.duration}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{lesson.title}</h1>
          </div>

          {/* Lesson content */}
          <LessonViewer lesson={lesson} courseId={courseId} />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
            {prevLessonId ? (
              <Link
                href={`/courses/${courseId}/lessons/${prevLessonId}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Bài trước
              </Link>
            ) : (
              <div />
            )}

            {nextLessonId ? (
              <Link
                href={`/courses/${courseId}/lessons/${nextLessonId}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-sm"
              >
                Bài tiếp theo
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-medium shadow-sm"
              >
                Hoàn thành khóa học 🎉
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
