'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, FileText, Video, Code2, HelpCircle, Clock, Lock } from 'lucide-react';
import type { Course, Lesson } from '@/lib/types';
import { getProgress } from '@/lib/progress';
import clsx from 'clsx';

interface CourseSyllabusProps {
  course: Course;
  lessons: Lesson[];
  currentLessonId?: string;
}

const typeIcons = {
  text: FileText,
  video: Video,
  code: Code2,
  quiz: HelpCircle,
};

const typeColors = {
  text: 'text-blue-500 bg-blue-100',
  video: 'text-purple-500 bg-purple-100',
  code: 'text-green-500 bg-green-100',
  quiz: 'text-orange-500 bg-orange-100',
};

const typeLabels = {
  text: 'Đọc',
  video: 'Video',
  code: 'Code',
  quiz: 'Quiz',
};

export default function CourseSyllabus({ course, lessons, currentLessonId }: CourseSyllabusProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const progress = getProgress(course.id);
    if (progress) setCompletedLessons(progress.completedLessons);
  }, [course.id]);

  const lessonMap = Object.fromEntries(lessons.map((l) => [l.id, l]));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-gray-800">Nội dung khóa học</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {lessons.length} bài học · {course.estimatedHours}h tổng thời gian
        </p>
      </div>

      <div className="divide-y divide-gray-50">
        {course.modules.map((module, moduleIdx) => (
          <div key={module.id}>
            {/* Module header */}
            <div className="px-6 py-3 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-600">
                Module {moduleIdx + 1}: {module.title}
              </h3>
            </div>

            {/* Lessons */}
            <ul>
              {module.lessons.map((lessonId, lessonIdx) => {
                const lesson = lessonMap[lessonId];
                if (!lesson) return null;

                const isComplete = completedLessons.includes(lessonId);
                const isCurrent = currentLessonId === lessonId;
                const isFirst = lessonIdx === 0 && moduleIdx === 0;
                const prevLessonId = lessonIdx > 0 ? module.lessons[lessonIdx - 1] : null;
                const isUnlocked = isFirst || !prevLessonId || completedLessons.includes(prevLessonId);

                const Icon = typeIcons[lesson.type] ?? FileText;
                const colorClass = typeColors[lesson.type] ?? typeColors.text;
                const href = `/courses/${course.id}/lessons/${lessonId}`;

                return (
                  <li key={lessonId}>
                    <Link
                      href={isUnlocked ? href : '#'}
                      className={clsx(
                        'flex items-center gap-4 px-6 py-4 transition-all border-l-4',
                        isCurrent
                          ? 'border-blue-500 bg-blue-50'
                          : isComplete
                          ? 'border-green-400 hover:bg-gray-50'
                          : 'border-transparent hover:bg-gray-50',
                        !isUnlocked && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {/* Completion circle */}
                      <div className="flex-shrink-0">
                        {isComplete ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                        ) : isUnlocked ? (
                          <Circle className="w-5 h-5 text-gray-300" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-300" />
                        )}
                      </div>

                      {/* Type icon */}
                      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          'text-sm font-medium truncate',
                          isCurrent ? 'text-blue-700' : 'text-gray-800'
                        )}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {typeLabels[lesson.type]}
                        </p>
                      </div>

                      {/* Duration */}
                      <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {lesson.duration}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
