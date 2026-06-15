import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse, getAllLessons } from '@/lib/content-loader';
import CourseSyllabus from '@/components/course/CourseSyllabus';
import { LevelBadge } from '@/components/ui/Badge';
import { Clock, BookOpen, ArrowLeft, PenSquare } from 'lucide-react';

interface Props {
  params: { courseId: string };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const course = getCourse(params.courseId);
  return {
    title: course ? `${course.title} · LMS` : 'Khóa học · LMS',
  };
}

export default function CourseDetailPage({ params }: Props) {
  const course = getCourse(params.courseId);
  if (!course) notFound();

  const lessons = getAllLessons(params.courseId);
  const firstLesson = lessons[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/courses" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Khóa học
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Course info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
            {/* Course header gradient */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-32 flex items-center justify-center">
              <div className="text-white/20 text-8xl font-black">{course.title.charAt(0)}</div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <LevelBadge level={course.level} />
                <Link
                  href={`/editor/${course.id}`}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Chỉnh sửa khóa học"
                >
                  <PenSquare className="w-4 h-4" />
                </Link>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{course.description}</p>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span><strong>{lessons.length}</strong> bài học</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Khoảng <strong>{course.estimatedHours}h</strong></span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {course.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {firstLesson && (
                <Link
                  href={`/courses/${course.id}/lessons/${firstLesson.id}`}
                  className="mt-6 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-xl transition-colors"
                >
                  Bắt đầu học →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right: Syllabus */}
        <div className="lg:col-span-2">
          <CourseSyllabus course={course} lessons={lessons} />
        </div>
      </div>
    </div>
  );
}
