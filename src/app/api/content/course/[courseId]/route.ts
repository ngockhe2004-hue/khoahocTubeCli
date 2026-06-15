import { NextRequest, NextResponse } from 'next/server';
import { saveCourse, getCourse } from '@/lib/content-loader';
import type { UpdateCoursePayload } from '@/lib/types';

interface Context {
  params: { courseId: string };
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const body: UpdateCoursePayload = await request.json();
    const { course: updates } = body;

    const existing = getCourse(params.courseId);
    if (!existing) {
      return NextResponse.json(
        { error: `Không tìm thấy khóa học "${params.courseId}"` },
        { status: 404 }
      );
    }

    const updated = { ...existing, ...updates, id: existing.id };
    saveCourse(updated);
    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error('[API] PUT /api/content/course/[courseId]:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, { params }: Context) {
  const course = getCourse(params.courseId);
  if (!course) {
    return NextResponse.json({ error: 'Không tìm thấy khóa học' }, { status: 404 });
  }
  return NextResponse.json({ course });
}
