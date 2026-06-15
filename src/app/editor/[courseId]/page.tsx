import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse, getAllLessons } from '@/lib/content-loader';
import CourseEditor from '@/components/editor/CourseEditor';
import { ArrowLeft, Plus, Eye, FileText, Video, Code2, HelpCircle, Clock, ChevronRight } from 'lucide-react';
import type { LessonType } from '@/lib/types';

interface Props {
  params: Promise<{ courseId: string }>;
}

export const dynamic = 'force-dynamic';

const typeIcons: Record<LessonType, React.ElementType> = {
  text: FileText,
  video: Video,
  code: Code2,
  quiz: HelpCircle,
};

const typeColors: Record<LessonType, string> = {
  text: 'text-blue-500 bg-blue-50',
  video: 'text-purple-500 bg-purple-50',
  code: 'text-green-500 bg-green-50',
  quiz: 'text-orange-500 bg-orange-50',
};

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const lessons = getAllLessons(courseId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/editor" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Editor
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{course.title}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa khóa học</h1>
        <div className="flex gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <Eye className="w-4 h-4" />
            Xem trước
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course editor */}
        <div className="lg:col-span-2">
          <CourseEditor initialCourse={course} />
        </div>

        {/* Lessons panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="font-semibold text-gray-800 text-sm">Bài học</h2>
                <p className="text-xs text-gray-400 mt-0.5">{lessons.length} bài</p>
              </div>
              <Link
                href={`/editor/${course.id}/new`}
                className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm bài
              </Link>
            </div>

            {lessons.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-400">Chưa có bài học</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {lessons.map((lesson) => {
                  const Icon = typeIcons[lesson.type] ?? FileText;
                  const colorClass = typeColors[lesson.type] ?? typeColors.text;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/editor/${course.id}/${lesson.id}`}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
