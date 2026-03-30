# 🚀 HƯỚNG DẪN DEPLOYMENT

## 📝 Chuẩn bị trước khi push GitHub

### 1. ✅ File cần có sẵn
- ✓ `.gitignore` (backend & frontend) - Để không push `.env` và `node_modules/`
- ✓ `.env.example` (backend & frontend) - Hướng dẫn cấu hình environment variables
- ✓ `package.json` (cả hai) - Định nghĩa dependencies

### 2. ✅ Kiểm tra trước push
```bash
# Xem những file sẽ được push
git status

# Đảm bảo .env và node_modules/ KHÔNG nằm trong danh sách
# Nếu có, xoá khỏi git:
git rm --cached backend/.env backend/node_modules -r
git rm --cached frontend/.env.local frontend/node_modules -r
```

---

## 🌐 DEPLOYMENT VERCEL (Frontend)

### Bước 1: Connect GitHub
1. Vào https://vercel.com
2. Sign in/Sign up
3. Click "Add New..." → "Project"
4. Select repository `WebNhom17`
5. Import project

### Bước 2: Cấu hình Frontend
**Root Directory:** `frontend`

**Build Command:** `npm run build`

**Output Directory:** `dist`

### Bước 3: Environment Variables
Trong Vercel Dashboard → Settings → Environment Variables, thêm:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```
(Sẽ cập nhật sau khi biết URL từ Render)

### Bước 4: Deploy
- Click "Deploy"
- Chờ build hoàn tất
- Vercel sẽ tự deploy khi push mới lên `main` branch

---

## 🔌 DEPLOYMENT RENDER (Backend)

### Bước 1: Connect GitHub
1. Vào https://render.com
2. Sign in/Sign up
3. Click "New" → "Web Service"
4. Connect GitHub account
5. Select repository `WebNhom17`

### Bước 2: Cấu hình Backend
- **Name:** `webnhom17-backend` (hoặc tên khác)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Bước 3: Environment Variables
Trong Render Dashboard → Environment, thêm:
```
MONGO_URI=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_jwt_secret_key>
CLIENT_URL=https://your-frontend.vercel.app
```

### Bước 4: Deploy
- Click "Create Web Service"
- Render sẽ tự deploy khi push mới lên `main` branch

---

## 🔗 Kết nối Backend & Frontend

### Sau khi cả hai được deploy:

1. **Cập nhật CORS trên Backend:**
   - Render Dashboard → Environment
   - Update `CLIENT_URL=https://your-frontend-url.vercel.app`

2. **Cập nhật API URL trên Frontend:**
   - Vercel Dashboard → Environment Variables
   - Update `VITE_API_URL=https://your-backend-url.onrender.com/api`

3. **Trigger re-deploy:**
   - Có thể redeploy thủ công trên cả Vercel & Render
   - Hoặc push một commit nhỏ để tự động trigger

---

## 🧪 Kiểm tra sau deploy

```bash
# Verify CORS works
curl -X OPTIONS https://your-backend-url.onrender.com/api/auth \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Check API connection
curl https://your-backend-url.onrender.com/
# Response: {"message": "Backend Web Tuyển Dụng đang chạy 🚀"}
```

---

## ⚠️ Thường gặp lỗi

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|----------|
| CORS error | Backend không nhận request từ frontend | Kiểm tra `CLIENT_URL` environment variable |
| 503 Service Unavailable | Render server chưa khởi động | Đợi 1-2 phút, reload trang |
| `Cannot find module` | Dependencies chưa cài | Kiểm tra `package.json` và build logs |
| `.env` not found | .env chưa được tạo trên server | Thêm environment variables trong dashboard |

---

## 📌 Checklist cuối cùng

- [ ] `.gitignore` được tạo ✅
- [ ] `.env.example` được tạo ✅
- [ ] Không có `.env` trong git (đã ignore)
- [ ] GitHub repository được push
- [ ] Vercel kết nối & deploy thành công
- [ ] Render kết nối & deploy thành công
- [ ] Frontend API URL pointing tới backend
- [ ] Backend CORS pointing tới frontend
- [ ] Test API calls từ frontend
- [ ] Kiểm tra console không có lỗi

