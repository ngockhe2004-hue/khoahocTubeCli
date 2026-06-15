'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, Clock, BarChart2 } from 'lucide-react';
import type { Course } from '@/lib/types';
import { getCompletionPercent } from '@/lib/progress';
import { LevelBadge } from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

interface CourseCardProps {
  course: Course;
  totalLessons: number;
}

export default function CourseCard({ course, totalLessons }: CourseCardProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(getCompletionPercent(course.id, totalLessons));
  }, [course.id, totalLessons]);

  const levelColors: Record<string, string> = {
    beginner: 'from-green-400 to-emerald-500',
    intermediate: 'from-blue-400 to-indigo-500',
    advanced: 'from-orange-400 to-red-500',
  };
  const gradient = levelColors[course.level] ?? 'from-gray-400 to-gray-500';

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
        {/* Thumbnail / gradient header */}
        <div className={`bg-gradient-to-br ${gradient} h-36 relative overflow-hidden flex items-center justify-center`}>
          <div className="text-white/20 text-9xl font-black select-none">
            {course.title.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-3 left-4 right-4">
            <LevelBadge level={course.level} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
            {course.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {totalLessons} bài học
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {course.estimatedHours}h
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              {percent}% hoàn thành
            </span>
          </div>

          {/* Progress */}
          <ProgressBar
            percent={percent}
            size="sm"
            color={percent === 100 ? 'green' : 'blue'}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {course.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
