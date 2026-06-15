'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Course, Level, Module } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface CourseEditorProps {
  initialCourse?: Course;
  isNew?: boolean;
}

const DEFAULT_COURSE: Course = {
  id: '',
  title: '',
  description: '',
  thumbnail: '',
  level: 'beginner',
  tags: [],
  estimatedHours: 1,
  modules: [{ id: 'module-1', title: 'Module 1', lessons: [] }],
};

export default function CourseEditor({ initialCourse, isNew = false }: CourseEditorProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course>(initialCourse ?? DEFAULT_COURSE);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function update<K extends keyof Course>(key: K, value: Course[K]) {
    setCourse((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !course.tags.includes(tag)) {
      update('tags', [...course.tags, tag]);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    update('tags', course.tags.filter((t) => t !== tag));
  }

  function addModule() {
    const id = `module-${Date.now()}`;
    update('modules', [...course.modules, { id, title: 'Module mới', lessons: [] }]);
  }

  function updateModule(idx: number, field: keyof Module, value: string) {
    const updated = course.modules.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    update('modules', updated);
  }

  function removeModule(idx: number) {
    update('modules', course.modules.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setError('');
    setSuccess('');

    if (!course.id.trim()) return setError('ID khóa học không được để trống');
    if (!course.title.trim()) return setError('Tiêu đề không được để trống');

    setSaving(true);
    try {
      const url = isNew ? '/api/content/course' : `/api/content/course/${course.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Lưu thất bại');

      setSuccess('Đã lưu thành công!');
      if (isNew) {
        setTimeout(() => router.push(`/editor/${course.id}`), 1000);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-5 text-lg">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ID khóa học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={course.id}
              onChange={(e) => update('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="vd: typescript-basics"
              disabled={!isNew}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 font-mono"
            />
            {isNew && <p className="text-xs text-gray-400 mt-1">Chỉ dùng chữ thường, số, dấu gạch ngang</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={course.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="vd: TypeScript Cơ bản"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              value={course.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Mô tả ngắn gọn về khóa học..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cấp độ</label>
            <select
              value={course.level}
              onChange={(e) => update('level', e.target.value as Level)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>

          {/* Estimated Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời gian ước tính (giờ)</label>
            <input
              type="number"
              value={course.estimatedHours}
              onChange={(e) => update('estimatedHours', Number(e.target.value))}
              min={0.5}
              step={0.5}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Thumbnail */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
            <input
              type="text"
              value={course.thumbnail}
              onChange={(e) => update('thumbnail', e.target.value)}
              placeholder="/thumbnails/my-course.png"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4 text-lg">Tags</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Nhập tag và nhấn Enter..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button variant="outline" onClick={addTag} leftIcon={<Plus className="w-4 h-4" />}>
            Thêm
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
              #{tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 text-lg">Modules</h2>
          <Button size="sm" variant="outline" onClick={addModule} leftIcon={<Plus className="w-4 h-4" />}>
            Thêm module
          </Button>
        </div>
        <div className="space-y-3">
          {course.modules.map((module, idx) => (
            <div key={module.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <span className="text-sm text-gray-400 w-6 text-center font-semibold">{idx + 1}</span>
              <input
                type="text"
                value={module.title}
                onChange={(e) => updateModule(idx, 'title', e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400">{module.lessons.length} bài</span>
              {course.modules.length > 1 && (
                <button
                  onClick={() => removeModule(idx)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
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
          {isNew ? 'Tạo khóa học' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  );
}
