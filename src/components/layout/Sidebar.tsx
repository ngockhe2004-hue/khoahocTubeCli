'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle, FileText, Video, Code2, HelpCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { Lesson, Module } from '@/lib/types';

interface SidebarProps {
  courseId: string;
  modules: Module[];
  lessons: Lesson[];
  completedLessons: string[];
}

const lessonTypeIcons = {
  text: FileText,
  video: Video,
  code: Code2,
  quiz: HelpCircle,
};

export default function Sidebar({
  courseId,
  modules,
  lessons,
  completedLessons,
}: SidebarProps) {
  const pathname = usePathname();
  const lessonMap = Object.fromEntries(lessons.map((l) => [l.id, l]));

  return (
    <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto h-screen sticky top-16 flex-shrink-0">
      <div className="p-4">
        {modules.map((module) => (
          <div key={module.id} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              {module.title}
            </h3>
            <ul className="space-y-1">
              {module.lessons.map((lessonId) => {
                const lesson = lessonMap[lessonId];
                if (!lesson) return null;

                const isComplete = completedLessons.includes(lessonId);
                const href = `/courses/${courseId}/lessons/${lessonId}`;
                const isActive = pathname === href;
                const Icon = lessonTypeIcons[lesson.type] ?? FileText;

                return (
                  <li key={lessonId}>
                    <Link
                      href={href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group',
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {/* Completion status */}
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-blue-400' : 'text-gray-300')} />
                      )}

                      {/* Type icon */}
                      <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-blue-500' : 'text-gray-400')} />

                      {/* Title */}
                      <span className="flex-1 truncate">{lesson.title}</span>

                      {/* Duration */}
                      <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                        <Clock className="w-3 h-3" />
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
    </aside>
  );
}
