import { getAllCourses, getAllLessons } from '@/lib/content-loader';
import CourseCard from '@/components/course/CourseCard';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  const courses = getAllCourses();
  const coursesWithLessons = courses.map((course) => ({
    course,
    totalLessons: getAllLessons(course.id).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tất cả khóa học</h1>
        <p className="text-gray-500">
          {courses.length} khóa học ·{' '}
          {coursesWithLessons.reduce((s, c) => s + c.totalLessons, 0)} bài học
        </p>
      </div>

      {coursesWithLessons.length === 0 ? (
        <div className="text-center py-24">
          <BookOpen className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Chưa có khóa học nào</h2>
          <p className="text-gray-400 mb-6">Thêm khóa học mới từ trang Editor.</p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Mở Editor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coursesWithLessons.map(({ course, totalLessons }) => (
            <CourseCard key={course.id} course={course} totalLessons={totalLessons} />
          ))}
        </div>
      )}
    </div>
  );
}
