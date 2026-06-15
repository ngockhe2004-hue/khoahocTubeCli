'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import type { VideoLesson as VideoLessonType } from '@/lib/types';
import Button from '@/components/ui/Button';

interface VideoLessonProps {
  lesson: VideoLessonType;
  isComplete: boolean;
  onComplete: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoLesson({ lesson, isComplete, onComplete }: VideoLessonProps) {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [iframeSrc, setIframeSrc] = useState(lesson.videoUrl);

  // For YouTube: append &start=TIME to jump to chapter
  function jumpToChapter(time: number, index: number) {
    setActiveChapter(index);
    const base = lesson.videoUrl.split('?')[0];
    setIframeSrc(`${base}?autoplay=1&start=${time}`);
  }

  const isYoutube = lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video player */}
        <div className="flex-1">
          <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video">
            {isYoutube ? (
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={lesson.videoUrl}
                className="w-full h-full"
                controls
                poster=""
              />
            )}
          </div>

          {/* Description */}
          {lesson.description && (
            <div className="mt-4 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{lesson.description}</p>
            </div>
          )}

          {/* Transcript */}
          {lesson.transcript && (
            <div className="mt-4 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Transcript</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{lesson.transcript}</p>
            </div>
          )}

          {/* Complete button */}
          <div className="mt-6 flex justify-end">
            {isComplete ? (
              <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5" />
                <span>Đã hoàn thành!</span>
              </div>
            ) : (
              <Button size="lg" onClick={onComplete}>
                <CheckCircle2 className="w-5 h-5" />
                Đánh dấu hoàn thành
              </Button>
            )}
          </div>
        </div>

        {/* Chapters sidebar */}
        {lesson.chapters && lesson.chapters.length > 0 && (
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-blue-500" />
                  Chapters ({lesson.chapters.length})
                </h3>
              </div>
              <ul className="divide-y divide-gray-50">
                {lesson.chapters.map((chapter, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => jumpToChapter(chapter.time, idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                        activeChapter === idx ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {/* Chapter number */}
                      <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activeChapter === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </span>

                      {/* Title */}
                      <span className="flex-1 text-sm font-medium">{chapter.title}</span>

                      {/* Time */}
                      <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatTime(chapter.time)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
