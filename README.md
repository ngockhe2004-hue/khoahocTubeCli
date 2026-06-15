# Learning Management System

Hệ thống bài học (LMS) được xây dựng bằng Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Tính năng

- 📚 Hiển thị danh sách khóa học với thẻ bài học đẹp
- 🎬 Bài học dạng video với danh sách chapters
- 📝 Bài học dạng text/MDX với syntax highlighting
- 💻 Bài học dạng code với editor và gợi ý
- ❓ Bài học dạng quiz tương tác
- 📊 Theo dõi tiến độ học tập (localStorage)
- ✏️ Editor nội dung để thêm/sửa khóa học và bài học
- 📱 Responsive, hỗ trợ mobile

## Cài đặt

```bash
cd learning-system
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Cấu trúc nội dung

Nội dung được lưu dưới dạng JSON files trong `src/content/courses/`:

```
src/content/courses/
└── <course-id>/
    ├── meta.json       # Thông tin khóa học
    └── lessons/
        ├── 01-intro.json   # Bài học dạng text
        ├── 02-video.json   # Bài học dạng video
        ├── 03-code.json    # Bài học dạng code
        └── 04-quiz.json    # Bài học dạng quiz
```

## Thêm nội dung mới

Truy cập `/editor` để thêm và chỉnh sửa khóa học và bài học thông qua giao diện đồ họa.

## Công nghệ sử dụng

- **Next.js 14** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-markdown** - Render Markdown
- **react-syntax-highlighter** - Code syntax highlighting
- **lucide-react** - Icons
- **localStorage** - Lưu trữ tiến độ học tập
