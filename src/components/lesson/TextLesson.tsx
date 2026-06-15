'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { TextLesson as TextLessonType } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface TextLessonProps {
  lesson: TextLessonType;
  isComplete: boolean;
  onComplete: () => void;
}

export default function TextLesson({ lesson, isComplete, onComplete }: TextLessonProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <article className="prose bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Code blocks with syntax highlighting
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;

              if (isInline) {
                return (
                  <code
                    className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="my-4 rounded-xl overflow-hidden shadow-md">
                  {/* Language label */}
                  <div className="bg-slate-700 text-slate-300 text-xs px-4 py-2 flex items-center justify-between">
                    <span className="font-mono">{match[1]}</span>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      padding: '1rem 1.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            },
            // Table styling
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table className="w-full border-collapse text-sm">{children}</table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  {children}
                </td>
              );
            },
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </article>

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
  );
}
