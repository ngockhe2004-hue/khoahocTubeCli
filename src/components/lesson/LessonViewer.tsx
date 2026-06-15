'use client';

import { useEffect, useState } from 'react';
import type { Lesson } from '@/lib/types';
import { markComplete, updateScore, isLessonComplete } from '@/lib/progress';
import TextLesson from './TextLesson';
import VideoLesson from './VideoLesson';
import CodeLesson from './CodeLesson';
import QuizLesson from './QuizLesson';

interface LessonViewerProps {
  lesson: Lesson;
  courseId: string;
}

export default function LessonViewer({ lesson, courseId }: LessonViewerProps) {
  const [complete, setComplete] = useState(false);

  // Check initial completion state from localStorage
  useEffect(() => {
    setComplete(isLessonComplete(courseId, lesson.id));
  }, [courseId, lesson.id]);

  function handleComplete() {
    markComplete(courseId, lesson.id);
    setComplete(true);
  }

  function handleQuizComplete(score: number) {
    updateScore(courseId, score);
    markComplete(courseId, lesson.id);
    setComplete(true);
  }

  switch (lesson.type) {
    case 'text':
      return (
        <TextLesson
          lesson={lesson}
          isComplete={complete}
          onComplete={handleComplete}
        />
      );

    case 'video':
      return (
        <VideoLesson
          lesson={lesson}
          isComplete={complete}
          onComplete={handleComplete}
        />
      );

    case 'code':
      return (
        <CodeLesson
          lesson={lesson}
          isComplete={complete}
          onComplete={handleComplete}
        />
      );

    case 'quiz':
      return (
        <QuizLesson
          lesson={lesson}
          isComplete={complete}
          onComplete={handleQuizComplete}
        />
      );

    default:
      return (
        <div className="text-center py-16 text-gray-400">
          <p>Loại bài học không được hỗ trợ.</p>
        </div>
      );
  }
}
