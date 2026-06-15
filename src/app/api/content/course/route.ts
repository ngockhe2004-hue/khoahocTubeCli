import { NextRequest, NextResponse } from 'next/server';
import { saveCourse, getCourse } from '@/lib/content-loader';
import type { CreateCoursePayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateCoursePayload = await request.json();
    const { course } = body;

    if (!course?.id) {
      return NextResponse.json({ error: 'Thiếu ID khóa học' }, { status: 400 });
    }

    // Check if course already exists
    const existing = getCourse(course.id);
    if (existing) {
      return NextResponse.json(
        { error: `Khóa học với ID "${course.id}" đã tồn tại` },
        { status: 409 }
      );
    }

    saveCourse(course);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/content/course:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
