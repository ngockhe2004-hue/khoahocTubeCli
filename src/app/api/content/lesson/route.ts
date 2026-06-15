import { NextRequest, NextResponse } from 'next/server';
import { saveLesson, getLesson, getCourse } from '@/lib/content-loader';
import type { CreateLessonPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateLessonPayload = await request.json();
    const { courseId, lesson } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Thiếu courseId' }, { status: 400 });
    }
    if (!lesson?.id) {
      return NextResponse.json({ error: 'Thiếu ID bài học' }, { status: 400 });
    }

    // Verify course exists
    const course = getCourse(courseId);
    if (!course) {
      return NextResponse.json(
        { error: `Không tìm thấy khóa học "${courseId}"` },
        { status: 404 }
      );
    }

    // Check if lesson already exists
    const existing = getLesson(courseId, lesson.id);
    if (existing) {
      return NextResponse.json(
        { error: `Bài học với ID "${lesson.id}" đã tồn tại trong khóa học này` },
        { status: 409 }
      );
    }

    saveLesson(courseId, lesson);
    return NextResponse.json({ success: true, lesson }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/content/lesson:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
