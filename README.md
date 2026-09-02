# 📚 Hệ thống Soạn Giáo Án & Sổ Đầu Bài Thông Minh (AI-Powered)

Một ứng dụng web mạnh mẽ dành cho giảng viên, giáo viên giúp tự động hóa quá trình lập kế hoạch giảng dạy, tính toán thời lượng môn học, soạn giáo án chuẩn và sinh các học liệu thông minh dựa trên trí tuệ nhân tạo (AI).

## ✨ Tính năng nổi bật

### 1. Quản lý Thời Khóa Biểu & Sổ Đầu Bài
* Nhập chương trình môn học từ file (`.docx`, `.pdf`, `.txt`, `.md`).
* Tự động nhận diện số tiết Lý thuyết, Thực hành, Kiểm tra và quy đổi theo hệ số chuẩn.
* Hỗ trợ lên lịch dạy tự động dựa trên ngày bắt đầu, số tiết/buổi, các ngày nghỉ lễ.
* Tính năng thêm lịch bù, lịch dạy đột xuất linh hoạt mà không phá vỡ cấu trúc bài giảng.

### 2. Soạn Giáo Án
* Sinh nội dung giáo án chuẩn hóa theo form mẫu chuyên nghiệp.
* Hỗ trợ lưu trữ, chỉnh sửa trực tiếp nội dung từng bài giảng.
* Hỗ trợ thông tin cá nhân hóa (ký tên giảng viên, điền form thông tin môn học, lớp, hệ đào tạo).

### 3. Trợ lý Trí Tuệ Nhân Tạo (AI Assistant)
* **Tạo Dàn ý Slide:** Trích xuất tự động dàn ý Slide PowerPoint ngắn gọn, súc tích từ nội dung giáo án.
* **Tạo Bộ câu hỏi:** Tự động sinh bộ câu hỏi trắc nghiệm (có đáp án) & bài tập bám sát mục tiêu bài học.

### 4. Xuất File (Export) Chuyên Nghiệp
* Xuất file **Word (.doc)** và **PDF (.pdf)** chất lượng cao, giữ nguyên định dạng in ấn, ngắt trang thông minh.
* Cơ chế tự động bóc tách: Hệ thống tự động chia file riêng biệt cho *Giáo án chính*, *Bộ câu hỏi*, và *Dàn ý Slide* thành các tệp độc lập để tiện sử dụng cho từng mục đích.

### 5. Lưu trữ & Đồng bộ Đám Mây
* Lưu trạng thái tiến độ làm việc thẳng vào Cơ sở dữ liệu, đảm bảo không mất dữ liệu.
* Tích hợp lưu trữ sao lưu qua hệ sinh thái Google Drive.
* Quản lý người dùng, phân quyền bảo mật (Admin / Giáo viên).
* Quản lý phê duyệt tài khoản, cấp phát phiên làm việc, theo dõi nhật ký hoạt động (Audit log).

## 🛠 Công nghệ sử dụng
* **Backend:** Node.js, Express.js
* **Cơ sở dữ liệu:** MongoDB (Mongoose)
* **Frontend:** EJS (Templating), HTML5, CSS3, JavaScript (Vanilla)
* **Thư viện tích hợp:** HTML2PDF (Xuất PDF), SweetAlert2 (Giao diện modal), Google Drive API, API AI (Gemini/OpenAI).

## 🚀 Cài đặt và Khởi chạy

### Yêu cầu hệ thống
* Node.js (phiên bản 18+ khuyến nghị)
* MongoDB (Chạy local hoặc thông qua MongoDB Atlas)

### Các bước cài đặt
1. **Clone dự án:**
   ```bash
   git clone https://github.com/rongcon-hg/soangiaoan.git
   cd soangiaoan
   ```

2. **Cài đặt thư viện (Dependencies):**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env` ở thư mục gốc và điền các thông tin cần thiết:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/soangiaoan
   SESSION_SECRET=chuoi_bao_mat_cua_ban
   # Các cấu hình AI, Google Drive, và SMTP Email sẽ được nạp theo hệ thống
   ```

4. **Khởi chạy ứng dụng:**
   ```bash
   npm start
   # Hoặc nếu chạy trong môi trường phát triển (dev):
   npm run dev
   ```

5. **Truy cập:** 
   Mở trình duyệt và truy cập: `http://localhost:3000`

---
*Phát triển bởi [Nguyễn Văn Luyến (rongcon-hg)] - Tối ưu hóa thời gian soạn bài và quản lý hồ sơ giảng dạy trong thời đại số.*
