import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse } from '@/lib/content-loader';
import LessonEditor from '@/components/editor/LessonEditor';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ courseId: string }>;
}

export const dynamic = 'force-dynamic';

export default async function NewLessonPage({ params }: Props) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/editor" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Editor
        </Link>
        <span>/</span>
        <Link href={`/editor/${courseId}`} className="hover:text-blue-600">
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Bài học mới</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo bài học mới</h1>

      <LessonEditor courseId={courseId} isNew />
    </div>
  );
}
