import { NextRequest, NextResponse } from 'next/server';
import { saveLesson, getLesson, deleteLesson } from '@/lib/content-loader';
import type { UpdateLessonPayload } from '@/lib/types';

type Context = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export async function GET(_request: NextRequest, { params }: Context) {
  const { courseId, lessonId } = await params;
  const lesson = getLesson(courseId, lessonId);
  if (!lesson) {
    return NextResponse.json({ error: 'Không tìm thấy bài học' }, { status: 404 });
  }
  return NextResponse.json({ lesson });
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const { courseId, lessonId } = await params;
    const body: UpdateLessonPayload = await request.json();
    const { lesson } = body;

    if (!lesson) {
      return NextResponse.json({ error: 'Thiếu dữ liệu bài học' }, { status: 400 });
    }

    const existing = getLesson(courseId, lessonId);
    if (!existing) {
      return NextResponse.json(
        { error: `Không tìm thấy bài học "${lessonId}"` },
        { status: 404 }
      );
    }

    const updated = { ...lesson, id: lessonId };
    saveLesson(courseId, updated);
    return NextResponse.json({ success: true, lesson: updated });
  } catch (error) {
    console.error('[API] PUT /api/content/lesson/[courseId]/[lessonId]:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const { courseId, lessonId } = await params;
    const deleted = deleteLesson(courseId, lessonId);
    if (!deleted) {
      return NextResponse.json({ error: 'Không tìm thấy bài học' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/content/lesson/[courseId]/[lessonId]:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
