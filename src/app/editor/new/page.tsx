import CourseEditor from '@/components/editor/CourseEditor';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCoursePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/editor" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Editor
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Khóa học mới</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo khóa học mới</h1>

      <CourseEditor isNew />
    </div>
  );
}
