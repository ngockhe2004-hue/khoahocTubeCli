'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle2, Lightbulb, Eye, EyeOff, Code2, BookOpen } from 'lucide-react';
import type { CodeLesson as CodeLessonType } from '@/lib/types';
import Button from '@/components/ui/Button';

interface CodeLessonProps {
  lesson: CodeLessonType;
  isComplete: boolean;
  onComplete: () => void;
}

export default function CodeLesson({ lesson, isComplete, onComplete }: CodeLessonProps) {
  const [code, setCode] = useState(lesson.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  function revealNextHint() {
    setShowHints(true);
    setRevealedHints((prev) => Math.min(prev + 1, lesson.hints.length));
  }

  function resetCode() {
    setCode(lesson.starterCode);
    setShowSolution(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn</h3>
            <p className="text-blue-700 text-sm leading-relaxed whitespace-pre-line">
              {lesson.instructions || lesson.description}
            </p>
          </div>
        </div>
      </div>

      {/* Code editor and solution side by side */}
      <div className={`grid gap-4 ${showSolution ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
          {/* Toolbar */}
          <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-slate-400 text-xs ml-2 font-mono">
                main.{lesson.language === 'typescript' ? 'ts' : lesson.language}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-xs capitalize">{lesson.language}</span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={20}
            spellCheck={false}
            placeholder="// Viết code của bạn ở đây..."
          />
        </div>

        {/* Solution */}
        {showSolution && (
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <span className="text-green-400 text-xs ml-2 font-mono">solution.{lesson.language === 'typescript' ? 'ts' : lesson.language}</span>
              </div>
              <span className="text-green-400 text-xs">✓ Đáp án</span>
            </div>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={lesson.language}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                padding: '1rem',
                fontSize: '0.875rem',
                minHeight: '500px',
              }}
            >
              {lesson.solution}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Hints */}
      {showHints && lesson.hints.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800 text-sm">
              Gợi ý ({revealedHints}/{lesson.hints.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {lesson.hints.slice(0, revealedHints).map((hint, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-yellow-800">
                <span className="w-5 h-5 rounded-full bg-yellow-300 text-yellow-900 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Hints button */}
        {lesson.hints.length > 0 && (
          <Button
            variant="outline"
            onClick={revealNextHint}
            disabled={revealedHints >= lesson.hints.length}
            leftIcon={<Lightbulb className="w-4 h-4" />}
          >
            {showHints && revealedHints > 0
              ? revealedHints >= lesson.hints.length
                ? 'Hết gợi ý'
                : `Gợi ý tiếp (${lesson.hints.length - revealedHints} còn lại)`
              : 'Xem gợi ý'}
          </Button>
        )}

        {/* Solution toggle */}
        <Button
          variant={showSolution ? 'secondary' : 'outline'}
          onClick={() => setShowSolution(!showSolution)}
          leftIcon={showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        >
          {showSolution ? 'Ẩn đáp án' : 'Xem đáp án'}
        </Button>

        {/* Reset */}
        <Button
          variant="ghost"
          onClick={resetCode}
          className="text-gray-500"
        >
          Reset code
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Complete */}
        {isComplete ? (
          <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <CheckCircle2 className="w-5 h-5" />
            <span>Đã hoàn thành!</span>
          </div>
        ) : (
          <Button size="lg" onClick={onComplete}>
            <CheckCircle2 className="w-5 h-5" />
            Hoàn thành bài tập
          </Button>
        )}
      </div>
    </div>
  );
}
