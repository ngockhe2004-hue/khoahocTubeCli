'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Lesson,
  LessonType,
  TextLesson,
  VideoLesson,
  VideoChapter,
  CodeLesson,
  QuizLesson,
  QuizQuestion,
} from '@/lib/types';
import Button from '@/components/ui/Button';
import { Save, Plus, Trash2 } from 'lucide-react';

interface LessonEditorProps {
  courseId: string;
  initialLesson?: Lesson;
  isNew?: boolean;
}

function makeDefaultLesson(type: LessonType, courseId: string): Lesson {
  const base = {
    id: `lesson-${Date.now()}`,
    title: 'Bài học mới',
    duration: '10 min',
    order: 1,
  };
  switch (type) {
    case 'text':
      return { ...base, type: 'text', content: '# Tiêu đề\n\nNội dung bài học...' } as TextLesson;
    case 'video':
      return { ...base, type: 'video', videoUrl: '', description: '', chapters: [] } as VideoLesson;
    case 'code':
      return {
        ...base,
        type: 'code',
        language: 'typescript',
        description: '',
        instructions: '',
        starterCode: '// Code của bạn ở đây\n',
        solution: '// Đáp án\n',
        hints: [],
      } as CodeLesson;
    case 'quiz':
      return {
        ...base,
        type: 'quiz',
        questions: [
          {
            id: `q-${Date.now()}`,
            q: 'Câu hỏi mới?',
            options: ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
            answer: 0,
            explain: 'Giải thích đáp án đúng...',
          },
        ],
      } as QuizLesson;
  }
}

// ─── Text Form ──────────────────────────────────────────────────────────────────

function TextForm({ lesson, onChange }: { lesson: TextLesson; onChange: (l: TextLesson) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung (Markdown)</label>
        <textarea
          value={lesson.content}
          onChange={(e) => onChange({ ...lesson, content: e.target.value })}
          rows={20}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-gray-50"
          placeholder="# Tiêu đề&#10;&#10;Nội dung bài học ở đây..."
        />
      </div>
    </div>
  );
}

// ─── Video Form ──────────────────────────────────────────────────────────────────

function VideoForm({ lesson, onChange }: { lesson: VideoLesson; onChange: (l: VideoLesson) => void }) {
  function addChapter() {
    const chapters: VideoChapter[] = [
      ...lesson.chapters,
      { time: 0, title: 'Chapter mới' },
    ];
    onChange({ ...lesson, chapters });
  }

  function updateChapter(idx: number, field: keyof VideoChapter, value: string | number) {
    const chapters = lesson.chapters.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c
    );
    onChange({ ...lesson, chapters });
  }

  function removeChapter(idx: number) {
    onChange({ ...lesson, chapters: lesson.chapters.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Video</label>
        <input
          type="text"
          value={lesson.videoUrl}
          onChange={(e) => onChange({ ...lesson, videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/embed/..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
        <textarea
          value={lesson.description ?? ''}
          onChange={(e) => onChange({ ...lesson, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Chapters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Chapters</label>
          <Button size="sm" variant="outline" onClick={addChapter} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Thêm
          </Button>
        </div>
        <div className="space-y-2">
          {lesson.chapters.map((ch, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <input
                type="number"
                value={ch.time}
                onChange={(e) => updateChapter(idx, 'time', Number(e.target.value))}
                placeholder="Giây"
                min={0}
                className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400">s</span>
              <input
                type="text"
                value={ch.title}
                onChange={(e) => updateChapter(idx, 'title', e.target.value)}
                placeholder="Tên chapter"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => removeChapter(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Code Form ───────────────────────────────────────────────────────────────────

function CodeForm({ lesson, onChange }: { lesson: CodeLesson; onChange: (l: CodeLesson) => void }) {
  const [hintInput, setHintInput] = useState('');

  function addHint() {
    if (hintInput.trim()) {
      onChange({ ...lesson, hints: [...lesson.hints, hintInput.trim()] });
      setHintInput('');
    }
  }

  function removeHint(idx: number) {
    onChange({ ...lesson, hints: lesson.hints.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngôn ngữ</label>
          <select
            value={lesson.language}
            onChange={(e) => onChange({ ...lesson, language: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {['typescript', 'javascript', 'python', 'java', 'cpp', 'go', 'rust', 'tsx', 'jsx'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
        <input
          type="text"
          value={lesson.description}
          onChange={(e) => onChange({ ...lesson, description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hướng dẫn</label>
        <textarea
          value={lesson.instructions}
          onChange={(e) => onChange({ ...lesson, instructions: e.target.value })}
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Starter Code</label>
          <textarea
            value={lesson.starterCode}
            onChange={(e) => onChange({ ...lesson, starterCode: e.target.value })}
            rows={12}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Đáp án (Solution)</label>
          <textarea
            value={lesson.solution}
            onChange={(e) => onChange({ ...lesson, solution: e.target.value })}
            rows={12}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-gray-50"
          />
        </div>
      </div>

      {/* Hints */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Gợi ý</label>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={hintInput}
            onChange={(e) => setHintInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHint())}
            placeholder="Thêm gợi ý và nhấn Enter..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button size="sm" variant="outline" onClick={addHint} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Thêm
          </Button>
        </div>
        <ul className="space-y-1.5">
          {lesson.hints.map((hint, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2.5">
              <span className="text-yellow-600 text-xs font-semibold w-5">{idx + 1}.</span>
              <span className="flex-1 text-sm text-gray-700">{hint}</span>
              <button onClick={() => removeHint(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Quiz Form ───────────────────────────────────────────────────────────────────

function QuizForm({ lesson, onChange }: { lesson: QuizLesson; onChange: (l: QuizLesson) => void }) {
  function addQuestion() {
    const q: QuizQuestion = {
      id: `q-${Date.now()}`,
      q: 'Câu hỏi mới?',
      options: ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
      answer: 0,
      explain: '',
    };
    onChange({ ...lesson, questions: [...lesson.questions, q] });
  }

  function updateQuestion(idx: number, updates: Partial<QuizQuestion>) {
    const questions = lesson.questions.map((q, i) => (i === idx ? { ...q, ...updates } : q));
    onChange({ ...lesson, questions });
  }

  function updateOption(qIdx: number, optIdx: number, value: string) {
    const questions = lesson.questions.map((q, i) => {
      if (i !== qIdx) return q;
      const options = q.options.map((o, j) => (j === optIdx ? value : o));
      return { ...q, options };
    });
    onChange({ ...lesson, questions });
  }

  function addOption(qIdx: number) {
    const questions = lesson.questions.map((q, i) =>
      i === qIdx ? { ...q, options: [...q.options, 'Lựa chọn mới'] } : q
    );
    onChange({ ...lesson, questions });
  }

  function removeOption(qIdx: number, optIdx: number) {
    const questions = lesson.questions.map((q, i) => {
      if (i !== qIdx) return q;
      const options = q.options.filter((_, j) => j !== optIdx);
      const answer = q.answer >= options.length ? 0 : q.answer;
      return { ...q, options, answer };
    });
    onChange({ ...lesson, questions });
  }

  function removeQuestion(idx: number) {
    onChange({ ...lesson, questions: lesson.questions.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-6">
      {lesson.questions.map((q, qIdx) => (
        <div key={q.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <span className="font-semibold text-gray-700 text-sm">Câu hỏi {qIdx + 1}</span>
            {lesson.questions.length > 1 && (
              <button onClick={() => removeQuestion(qIdx)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Question text */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Câu hỏi</label>
              <input
                type="text"
                value={q.q}
                onChange={(e) => updateQuestion(qIdx, { q: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Các lựa chọn</label>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`answer-${q.id}`}
                      checked={q.answer === optIdx}
                      onChange={() => updateQuestion(qIdx, { answer: optIdx })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    {q.answer === optIdx && (
                      <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                        ✓ Đúng
                      </span>
                    )}
                    {q.options.length > 2 && (
                      <button
                        onClick={() => removeOption(qIdx, optIdx)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addOption(qIdx)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm lựa chọn
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Chọn radio button để đánh dấu đáp án đúng</p>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Giải thích đáp án</label>
              <input
                type="text"
                value={q.explain}
                onChange={(e) => updateQuestion(qIdx, { explain: e.target.value })}
                placeholder="Giải thích tại sao đây là đáp án đúng..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addQuestion} leftIcon={<Plus className="w-4 h-4" />}>
        Thêm câu hỏi
      </Button>
    </div>
  );
}

// ─── Main LessonEditor ────────────────────────────────────────────────────────────

export default function LessonEditor({ courseId, initialLesson, isNew = false }: LessonEditorProps) {
  const router = useRouter();
  const [lessonType, setLessonType] = useState<LessonType>(initialLesson?.type ?? 'text');
  const [lesson, setLesson] = useState<Lesson>(
    initialLesson ?? makeDefaultLesson('text', courseId)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleTypeChange(type: LessonType) {
    setLessonType(type);
    if (isNew) {
      const newLesson = makeDefaultLesson(type, courseId);
      newLesson.id = lesson.id;
      newLesson.title = lesson.title;
      newLesson.duration = lesson.duration;
      newLesson.order = lesson.order;
      setLesson(newLesson);
    }
  }

  function updateBase(field: string, value: string | number) {
    setLesson((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setError('');
    setSuccess('');

    if (!lesson.id.trim()) return setError('ID bài học không được để trống');
    if (!lesson.title.trim()) return setError('Tiêu đề không được để trống');

    setSaving(true);
    try {
      const url = isNew
        ? '/api/content/lesson'
        : `/api/content/lesson/${courseId}/${lesson.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const body = isNew ? { courseId, lesson } : { lesson };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Lưu thất bại');

      setSuccess('Đã lưu thành công!');
      if (isNew) {
        setTimeout(() => router.push(`/editor/${courseId}/${lesson.id}`), 1000);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Base fields */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-5 text-lg">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ID bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lesson.id}
              onChange={(e) => updateBase('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="vd: 01-intro"
              disabled={!isNew}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 font-mono"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => updateBase('title', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời lượng</label>
            <input
              type="text"
              value={lesson.duration}
              onChange={(e) => updateBase('duration', e.target.value)}
              placeholder="vd: 10 min"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label>
            <input
              type="number"
              value={lesson.order}
              onChange={(e) => updateBase('order', Number(e.target.value))}
              min={1}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại bài học</label>
            <div className="flex gap-2">
              {(['text', 'video', 'code', 'quiz'] as LessonType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  disabled={!isNew}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    lessonType === t
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t === 'text' ? '📝 Text' : t === 'video' ? '🎬 Video' : t === 'code' ? '💻 Code' : '❓ Quiz'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Type-specific form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-5 text-lg">Nội dung bài học</h2>
        {lesson.type === 'text' && (
          <TextForm lesson={lesson as TextLesson} onChange={(l) => setLesson(l)} />
        )}
        {lesson.type === 'video' && (
          <VideoForm lesson={lesson as VideoLesson} onChange={(l) => setLesson(l)} />
        )}
        {lesson.type === 'code' && (
          <CodeForm lesson={lesson as CodeLesson} onChange={(l) => setLesson(l)} />
        )}
        {lesson.type === 'quiz' && (
          <QuizForm lesson={lesson as QuizLesson} onChange={(l) => setLesson(l)} />
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✅ {success}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} loading={saving} leftIcon={<Save className="w-5 h-5" />}>
          {isNew ? 'Tạo bài học' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  );
}
