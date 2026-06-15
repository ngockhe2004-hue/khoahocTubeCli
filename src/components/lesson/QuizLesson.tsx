'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import type { QuizLesson as QuizLessonType } from '@/lib/types';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

interface QuizLessonProps {
  lesson: QuizLessonType;
  isComplete: boolean;
  onComplete: (score: number) => void;
}

type QuizState = 'answering' | 'submitted' | 'completed';

export default function QuizLesson({ lesson, isComplete, onComplete }: QuizLessonProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizState, setQuizState] = useState<QuizState>('answering');

  const questions = lesson.questions;
  const question = questions[currentQ];
  const totalQ = questions.length;

  const selectedAnswer = answers[question?.id] ?? -1;
  const isLastQuestion = currentQ === totalQ - 1;

  function selectAnswer(optionIndex: number) {
    if (quizState !== 'answering') return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  }

  function submitCurrent() {
    if (selectedAnswer === -1) return;

    if (!isLastQuestion) {
      setCurrentQ((prev) => prev + 1);
    } else {
      // Calculate score
      const correct = questions.filter((q) => answers[q.id] === q.answer).length;
      const scorePercent = Math.round((correct / totalQ) * 100);
      setQuizState('completed');
      onComplete(scorePercent);
    }
  }

  function resetQuiz() {
    setCurrentQ(0);
    setAnswers({});
    setQuizState('answering');
  }

  // Completed screen
  if (quizState === 'completed') {
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    const scorePercent = Math.round((correct / totalQ) * 100);
    const passed = scorePercent >= 70;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Score card */}
        <div className={clsx(
          'rounded-2xl p-8 text-center mb-6 border-2',
          passed
            ? 'bg-green-50 border-green-200'
            : 'bg-orange-50 border-orange-200'
        )}>
          <Trophy className={clsx('w-16 h-16 mx-auto mb-4', passed ? 'text-yellow-500' : 'text-orange-400')} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? '🎉 Xuất sắc!' : '📚 Cần ôn lại!'}
          </h2>
          <div className={clsx('text-5xl font-extrabold mb-2', passed ? 'text-green-600' : 'text-orange-600')}>
            {scorePercent}%
          </div>
          <p className="text-gray-600">
            Bạn trả lời đúng <strong>{correct}/{totalQ}</strong> câu hỏi
          </p>
        </div>

        {/* Review answers */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-800">Xem lại đáp án:</h3>
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.answer;
            return (
              <div key={q.id} className={clsx(
                'rounded-xl border p-5',
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              )}>
                <div className="flex items-start gap-3">
                  {isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-2">
                      <span className="text-gray-400 mr-2">Q{idx + 1}.</span>
                      {q.q}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-red-700 mb-1">
                        Bạn chọn: <span className="font-medium">{q.options[userAnswer] ?? '(không trả lời)'}</span>
                      </p>
                    )}
                    <p className={clsx('text-sm font-medium', isCorrect ? 'text-green-700' : 'text-green-700')}>
                      Đáp án đúng: {q.options[q.answer]}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 bg-white/70 rounded-lg px-3 py-2 italic">
                      💡 {q.explain}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={resetQuiz} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Làm lại
          </Button>
          {isComplete && (
            <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              <span>Đã lưu kết quả!</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quiz answering
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={clsx(
              'flex-1 h-2 rounded-full transition-all',
              idx < currentQ
                ? 'bg-blue-500'
                : idx === currentQ
                ? 'bg-blue-300'
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Question counter */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          Câu <span className="font-semibold text-gray-800">{currentQ + 1}</span> / {totalQ}
        </span>
        <span className="text-sm text-gray-500">
          {Object.keys(answers).length} đã trả lời
        </span>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {question.q}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            return (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                className={clsx(
                  'w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-sm',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next/Submit button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={submitCurrent}
            disabled={selectedAnswer === -1}
            rightIcon={isLastQuestion ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          >
            {isLastQuestion ? 'Nộp bài' : 'Tiếp theo'}
          </Button>
        </div>
      </div>
    </div>
  );
}
