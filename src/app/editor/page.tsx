import Link from 'next/link';
import { getAllCourses, getAllLessons } from '@/lib/content-loader';
import { LevelBadge } from '@/components/ui/Badge';
import { BookOpen, Plus, ChevronRight, FileText, Video, Code2, HelpCircle, Clock } from 'lucide-react';
import type { LessonType } from '@/lib/types';

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

export default function EditorPage() {
  const courses = getAllCourses();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Content Editor</h1>
          <p className="text-gray-500">Quản lý và chỉnh sửa nội dung khóa học</p>
        </div>
        <Link
          href="/editor/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm khóa học
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-400 mb-2">Chưa có khóa học</h2>
          <p className="text-gray-400 mb-6 text-sm">Tạo khóa học đầu tiên của bạn.</p>
          <Link
            href="/editor/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo khóa học mới
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => {
            const lessons = getAllLessons(course.id);
            return (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Course header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {course.title.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-gray-900">{course.title}</h2>
                        <LevelBadge level={course.level} />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 font-mono">{course.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{lessons.length} bài học</span>
                    <Link
                      href={`/editor/${course.id}`}
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Chỉnh sửa
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Lessons list */}
                {lessons.length === 0 ? (
                  <div className="px-6 py-6 text-center">
                    <p className="text-sm text-gray-400 mb-3">Chưa có bài học nào</p>
                    <Link
                      href={`/editor/${course.id}/new`}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm bài học đầu tiên
                    </Link>
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
                            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 font-mono">{lesson.id}</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </span>
                              <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-full">
                                {lesson.type}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Add lesson footer */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30">
                  <Link
                    href={`/editor/${course.id}/new`}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm bài học
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
