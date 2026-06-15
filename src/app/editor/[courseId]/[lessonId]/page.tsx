import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse, getLesson } from '@/lib/content-loader';
import LessonEditor from '@/components/editor/LessonEditor';
import LessonViewer from '@/components/lesson/LessonViewer';
import { ArrowLeft, Eye } from 'lucide-react';

interface Props {
  params: { courseId: string; lessonId: string };
  searchParams: { preview?: string };
}

export const dynamic = 'force-dynamic';

export default function EditLessonPage({ params, searchParams }: Props) {
  const course = getCourse(params.courseId);
  const lesson = getLesson(params.courseId, params.lessonId);

  if (!course || !lesson) notFound();

  const showPreview = searchParams.preview === '1';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/editor" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Editor
        </Link>
        <span>/</span>
        <Link href={`/editor/${params.courseId}`} className="hover:text-blue-600">
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{lesson.title}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài học</h1>
        <div className="flex gap-2">
          <Link
            href={`?preview=${showPreview ? '0' : '1'}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Ẩn preview' : 'Xem preview'}
          </Link>
          <Link
            href={`/courses/${params.courseId}/lessons/${params.lessonId}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors font-medium"
          >
            Xem trang học →
          </Link>
        </div>
      </div>

      <div className={`grid gap-8 ${showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        <div>
          <LessonEditor courseId={params.courseId} initialLesson={lesson} />
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                <h2 className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  Preview
                </h2>
                <p className="text-xs text-gray-400">Đây là bản xem trước đã lưu. Lưu để cập nhật.</p>
              </div>
              <LessonViewer lesson={lesson} courseId={params.courseId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
