import { NextRequest, NextResponse } from 'next/server';
import { saveLesson, getLesson, deleteLesson } from '@/lib/content-loader';
import type { UpdateLessonPayload } from '@/lib/types';

interface Context {
  params: { courseId: string; lessonId: string };
}

export async function GET(_request: NextRequest, { params }: Context) {
  const lesson = getLesson(params.courseId, params.lessonId);
  if (!lesson) {
    return NextResponse.json({ error: 'Không tìm thấy bài học' }, { status: 404 });
  }
  return NextResponse.json({ lesson });
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const body: UpdateLessonPayload = await request.json();
    const { lesson } = body;

    if (!lesson) {
      return NextResponse.json({ error: 'Thiếu dữ liệu bài học' }, { status: 400 });
    }

    // Verify lesson exists
    const existing = getLesson(params.courseId, params.lessonId);
    if (!existing) {
      return NextResponse.json(
        { error: `Không tìm thấy bài học "${params.lessonId}"` },
        { status: 404 }
      );
    }

    // Keep ID consistent
    const updated = { ...lesson, id: params.lessonId };
    saveLesson(params.courseId, updated);
    return NextResponse.json({ success: true, lesson: updated });
  } catch (error) {
    console.error('[API] PUT /api/content/lesson/[courseId]/[lessonId]:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const deleted = deleteLesson(params.courseId, params.lessonId);
    if (!deleted) {
      return NextResponse.json({ error: 'Không tìm thấy bài học' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/content/lesson/[courseId]/[lessonId]:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
