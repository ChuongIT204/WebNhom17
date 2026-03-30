# Web Tuyển Dụng - Frontend

Ứng dụng web tuyển dụng cho phép các nhà tuyển dụng đăng tin tuyển dụng và ứng viên ứng tuyển công việc.

## Stack Công Nghệ

- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **React Router DOM** - Routing
- **Sonner** - Toast Notifications
- **JavaScript (ES6+)** - Language

## Cài Đặt & Chạy

### Chuẩn bị
```bash
# Cài đặt dependencies
npm install

# Tạo file .env.local
VITE_API_URL=http://localhost:5000/api
```

### Phát triển
```bash
# Chạy dev server
npm run dev

# App sẽ mở tại http://localhost:5173
```

### Production
```bash
# Build
npm run build

# Preview build
npm run preview
```

## Cấu trúc Thư Mục

```
src/
├── api/
│   └── userApi.js          # API client functions
├── components/
│   └── ui/
│       ├── auth/           # Auth components (Login, Register)
│       ├── header/         # Header component
│       ├── footer/         # Footer component
│       └── pagination/     # Pagination component
├── pages/
│   ├── HomePage.jsx        # Trang chủ - Danh sách công việc
│   ├── JobDetail.jsx       # Chi tiết công việc & ứng tuyển
│   ├── AdminDashboard.jsx  # Admin dashboard
│   ├── RecruiterDashboard.jsx
│   └── NotFound.jsx        # 404 page
├── constants/
│   └── config.js           # Global config & constants
├── App.jsx                 # Main app routing
├── main.jsx                # Entry point
├── index.css               # Global styles
└── assets/                 # Images, icons
```

## Tính Năng

### Công Khai (Public)
- Xem danh sách công việc với tìm kiếm & lọc
- Xem chi tiết công việc
- Ứng tuyển công việc (không cần đăng nhập - nộp CV)

### Ứng Viên (Job Seeker)
- Đăng ký / Đăng nhập
- Ứng tuyển công việc

### Nhà Tuyển Dụng (Recruiter)
- Đăng ký / Đăng nhập
- Đăng bài tuyển dụng
- Quản lý bài đăng (Chỉnh sửa, Xóa)
- Xem danh sách ứng tuyển

### Admin
- Quản lý người dùng
- Quản lý tất cả bài tuyển dụng

## API Endpoints

Xem [Backend API Documentation](../backend/README.md)

## Env Variables

```
VITE_API_URL=http://localhost:5000/api
```

## Linting & Formatting

```bash
# Lint & fix
npm run lint
```

## License

MIT

