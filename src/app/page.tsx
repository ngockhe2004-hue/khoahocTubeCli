import Link from 'next/link';
import { getAllCourses, getAllLessons } from '@/lib/content-loader';
import CourseCard from '@/components/course/CourseCard';
import { BookOpen, Zap, Users, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const courses = getAllCourses();

  // Get total lessons per course
  const coursesWithLessons = await Promise.all(
    courses.map(async (course) => ({
      course,
      totalLessons: getAllLessons(course.id).length,
    }))
  );

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Học lập trình theo cách<br />
            <span className="text-blue-200">hiệu quả nhất</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Hệ thống học tập tương tác với video, bài tập code thực hành và quiz kiểm tra kiến thức.
            Theo dõi tiến độ của bạn theo thời gian thực.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Xem khóa học
            </Link>
            <Link
              href="/editor"
              className="bg-blue-500/30 text-white border border-white/30 font-semibold px-6 py-3 rounded-xl hover:bg-blue-500/50 transition-colors"
            >
              Tạo nội dung
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, label: 'Khóa học', value: courses.length.toString() },
            { icon: Zap, label: 'Bài học', value: coursesWithLessons.reduce((s, c) => s + c.totalLessons, 0).toString() },
            { icon: Users, label: 'Học viên', value: '∞' },
            { icon: Star, label: 'Đánh giá', value: '5/5' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Khóa học nổi bật</h2>
            <p className="text-gray-500 mt-1">Bắt đầu hành trình học tập của bạn</p>
          </div>
          <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Xem tất cả →
          </Link>
        </div>

        {coursesWithLessons.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Chưa có khóa học</h3>
            <p className="text-gray-400 mb-4">Tạo khóa học đầu tiên của bạn trong editor.</p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Mở Editor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithLessons.map(({ course, totalLessons }) => (
              <CourseCard key={course.id} course={course} totalLessons={totalLessons} />
            ))}
          </div>
        )}
      </section>

      {/* Feature highlights */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Tính năng hệ thống
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '📝',
                title: 'Bài học văn bản',
                desc: 'Markdown với syntax highlighting cho code',
              },
              {
                icon: '🎬',
                title: 'Bài học video',
                desc: 'YouTube embed + điều hướng chapter',
              },
              {
                icon: '💻',
                title: 'Bài tập code',
                desc: 'Editor code với gợi ý và xem đáp án',
              },
              {
                icon: '❓',
                title: 'Quiz tương tác',
                desc: 'Kiểm tra kiến thức với giải thích chi tiết',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
