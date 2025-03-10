-- **************************************************************
-- DATABASE SCHEMA FOR TRAVEL PLANNING APPLICATION
-- Version: 1.0
-- Last Updated: 2025-03-10
-- **************************************************************

-- **************************************************************
-- 1. BẢNG USERS (NGƯỜI DÙNG)
-- Lưu trữ thông tin tài khoản và hồ sơ cá nhân của người dùng
-- **************************************************************
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY, -- Định danh duy nhất của người dùng
    username VARCHAR(50) UNIQUE NOT NULL, -- Tên đăng nhập, độ dài tối đa 50 ký tự, không trùng lặp
    email VARCHAR(100) UNIQUE NOT NULL, -- Địa chỉ email, độ dài tối đa 100 ký tự, không trùng lặp
    password_hash VARCHAR(255) NOT NULL, -- Mật khẩu đã được mã hóa
    full_name VARCHAR(100), -- Tên đầy đủ của người dùng
    avatar_url VARCHAR(255), -- URL ảnh đại diện lưu trữ trên Cloudinary
    bio TEXT, -- Giới thiệu ngắn về người dùng
    location_preference VARCHAR(100), -- Sở thích về địa điểm du lịch
    travel_interests JSONB, -- Sở thích du lịch dưới dạng JSON, ví dụ: {"interests": ["nature", "food", "culture"]}
    social_links JSONB, -- Liên kết mạng xã hội dưới dạng JSON, ví dụ: {"facebook": "url", "instagram": "url"}
    notification_preferences JSONB, -- Cài đặt thông báo dưới dạng JSON, ví dụ: {"email": true, "push": false}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo tài khoản
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật tài khoản gần nhất
);

-- **************************************************************
-- 2. BẢNG LOCATIONS (ĐỊA ĐIỂM)
-- Lưu trữ thông tin về các địa điểm du lịch
-- **************************************************************
CREATE TABLE IF NOT EXISTS locations (
    location_id SERIAL PRIMARY KEY, -- Định danh duy nhất của địa điểm
    name VARCHAR(100) NOT NULL, -- Tên địa điểm, không được để trống
    description TEXT, -- Mô tả chi tiết về địa điểm
    address VARCHAR(255), -- Địa chỉ đầy đủ của địa điểm
    latitude DECIMAL(9,6) NOT NULL, -- Vĩ độ cho định vị Google Maps, độ chính xác 6 chữ số thập phân
    longitude DECIMAL(9,6) NOT NULL, -- Kinh độ cho định vị Google Maps, độ chính xác 6 chữ số thập phân
    average_rating DECIMAL(3,2) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5), -- Đánh giá trung bình từ 0-5 sao
    image_url VARCHAR(255) NOT NULL, -- URL hình ảnh chính của địa điểm lưu trữ trên Cloudinary
    tags JSONB, -- Các thẻ tag dưới dạng JSON, ví dụ: {"tags": ["nature", "historical", "family-friendly"]}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm thêm địa điểm vào hệ thống
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật thông tin địa điểm gần nhất
);

-- **************************************************************
-- 3. BẢNG REVIEWS (ĐÁNH GIÁ)
-- Lưu trữ đánh giá và nhận xét của người dùng về các địa điểm
-- **************************************************************
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY, -- Định danh duy nhất của đánh giá
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến người đánh giá, xóa khi xóa người dùng
    location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE, -- Liên kết đến địa điểm được đánh giá
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- Số sao đánh giá từ 1-5
    comment TEXT, -- Nội dung nhận xét chi tiết
    photos JSONB, -- Các URL ảnh kèm theo dưới dạng JSON, ví dụ: {"photos": ["url1", "url2"]}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo đánh giá
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật đánh giá gần nhất
);

-- **************************************************************
-- 4. BẢNG ITINERARIES (LỊCH TRÌNH)
-- Lưu trữ thông tin tổng quan về lịch trình du lịch
-- **************************************************************
CREATE TABLE IF NOT EXISTS itineraries (
    itinerary_id SERIAL PRIMARY KEY, -- Định danh duy nhất của lịch trình
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến chủ sở hữu lịch trình
    title VARCHAR(100) NOT NULL, -- Tiêu đề lịch trình, không được để trống
    description TEXT, -- Mô tả chi tiết về lịch trình
    start_date DATE NOT NULL, -- Ngày bắt đầu lịch trình
    end_date DATE NOT NULL, -- Ngày kết thúc lịch trình
    status VARCHAR(20) NOT NULL CHECK (status IN ('public', 'private', 'shared')) DEFAULT 'private', -- Trạng thái chia sẻ
    optimized BOOLEAN DEFAULT false, -- Đánh dấu lịch trình đã được tối ưu bởi AI hay chưa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo lịch trình
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật lịch trình gần nhất
);

-- **************************************************************
-- 5. BẢNG ITINERARY_DAYS (CHI TIẾT NGÀY)
-- Lưu trữ thông tin chi tiết cho từng ngày trong lịch trình
-- **************************************************************
CREATE TABLE IF NOT EXISTS itinerary_days (
    day_id SERIAL PRIMARY KEY, -- Định danh duy nhất của ngày trong lịch trình
    itinerary_id INT NOT NULL REFERENCES itineraries(itinerary_id) ON DELETE CASCADE, -- Liên kết đến lịch trình
    date DATE NOT NULL, -- Ngày cụ thể trong lịch trình
    day_order INT NOT NULL, -- Thứ tự của ngày trong lịch trình, tránh dùng từ khóa "order"
    optimized_route JSONB, -- Lộ trình tối ưu do AI đề xuất, dưới dạng JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo chi tiết ngày
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật chi tiết ngày gần nhất
);

-- **************************************************************
-- 6. BẢNG ACTIVITIES (HOẠT ĐỘNG)
-- Lưu trữ các hoạt động cụ thể trong từng ngày của lịch trình
-- **************************************************************
CREATE TABLE IF NOT EXISTS activities (
    activity_id SERIAL PRIMARY KEY, -- Định danh duy nhất của hoạt động
    day_id INT NOT NULL REFERENCES itinerary_days(day_id) ON DELETE CASCADE, -- Liên kết đến ngày trong lịch trình
    location_id INT REFERENCES locations(location_id) ON DELETE SET NULL, -- Liên kết đến địa điểm (có thể NULL nếu địa điểm bị xóa)
    title VARCHAR(100) NOT NULL, -- Tiêu đề hoạt động, không được để trống
    start_time TIME NOT NULL, -- Thời gian bắt đầu hoạt động
    end_time TIME NOT NULL, -- Thời gian kết thúc hoạt động
    notes TEXT, -- Ghi chú về hoạt động
    activity_type VARCHAR(50) CHECK (activity_type IN ('visit', 'transport', 'meal', 'rest', 'other')), -- Loại hoạt động
    activity_order INT NOT NULL, -- Thứ tự hoạt động trong ngày
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo hoạt động
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật hoạt động gần nhất
);

-- **************************************************************
-- 7. BẢNG ARTICLES (BÀI VIẾT)
-- Lưu trữ các bài viết du lịch, chia sẻ kinh nghiệm
-- **************************************************************
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY, -- Định danh duy nhất của bài viết
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến tác giả bài viết
    title VARCHAR(100) NOT NULL, -- Tiêu đề bài viết, không được để trống
    content TEXT NOT NULL, -- Nội dung chi tiết bài viết, không được để trống
    images JSONB, -- Các URL hình ảnh trong bài viết dưới dạng JSON, ví dụ: {"images": ["url1", "url2"]}
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published', -- Trạng thái bài viết
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo bài viết
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật bài viết gần nhất
);

-- **************************************************************
-- 8. BẢNG COMMENTS (BÌNH LUẬN)
-- Lưu trữ bình luận của người dùng trên các bài viết
-- **************************************************************
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY, -- Định danh duy nhất của bình luận
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE, -- Liên kết đến bài viết được bình luận
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến người bình luận
    content TEXT NOT NULL, -- Nội dung bình luận, không được để trống
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo bình luận
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm cập nhật bình luận gần nhất
);

-- **************************************************************
-- 9. BẢNG CHAT_LOGS (CHATBOT)
-- Lưu trữ lịch sử trò chuyện giữa người dùng và chatbot
-- **************************************************************
CREATE TABLE IF NOT EXISTS chat_logs (
    chat_id SERIAL PRIMARY KEY, -- Định danh duy nhất của cuộc trò chuyện
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến người dùng trò chuyện
    message TEXT NOT NULL, -- Nội dung tin nhắn của người dùng
    response TEXT NOT NULL, -- Nội dung phản hồi của chatbot
    intent VARCHAR(50), -- Ý định được xác định bởi NLP, ví dụ: "find_restaurant", "get_directions"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm diễn ra cuộc trò chuyện
);

-- **************************************************************
-- 10. BẢNG ANALYTICS (PHÂN TÍCH)
-- Lưu trữ dữ liệu phân tích hành vi người dùng
-- **************************************************************
CREATE TABLE IF NOT EXISTS analytics (
    event_id SERIAL PRIMARY KEY, -- Định danh duy nhất của sự kiện
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL, -- Liên kết đến người dùng (có thể NULL cho người dùng ẩn danh)
    event_type VARCHAR(50) NOT NULL, -- Loại sự kiện, ví dụ: "search", "click", "view", "rating"
    event_data JSONB, -- Dữ liệu chi tiết của sự kiện dưới dạng JSON, ví dụ: {"location_id": 123, "search_term": "beach"}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời điểm xảy ra sự kiện
);

-- **************************************************************
-- 11. BẢNG FAVORITES (YÊU THÍCH)
-- Lưu trữ các địa điểm yêu thích của người dùng
-- **************************************************************
CREATE TABLE IF NOT EXISTS favorites (
    favorite_id SERIAL PRIMARY KEY, -- Định danh duy nhất của mục yêu thích
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến người dùng
    location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE, -- Liên kết đến địa điểm được yêu thích
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời điểm thêm vào danh sách yêu thích
    UNIQUE(user_id, location_id)
);

-- **************************************************************
-- TẠO FUNCTION CẬP NHẬT THỜI GIAN
-- Tự động cập nhật trường updated_at khi có thay đổi
-- **************************************************************
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP; -- Cập nhật thời gian sửa đổi thành thời điểm hiện tại
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- **************************************************************
-- TẠO TRIGGER CẬP NHẬT THỜI GIAN
-- Tự động kích hoạt cập nhật thời gian khi dữ liệu thay đổi
-- **************************************************************
-- Trigger cho bảng users
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger cho bảng locations
CREATE TRIGGER update_locations_modtime
    BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger cho bảng reviews
CREATE TRIGGER update_reviews_modtime
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger cho bảng itineraries
CREATE TRIGGER update_itineraries_modtime
    BEFORE UPDATE ON itineraries
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger cho bảng itinerary_days
CREATE TRIGGER update_itinerary_days_modtime
    BEFORE UPDATE ON itinerary_days
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger cho bảng activities
CREATE TRIGGER update_activities_modtime
    BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger cho bảng articles
CREATE TRIGGER update_articles_modtime
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger cho bảng comments
CREATE TRIGGER update_comments_modtime
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- **************************************************************
-- TẠO INDEX TỐI ƯU
-- Tăng tốc độ truy vấn cho các trường thường xuyên được tìm kiếm
-- **************************************************************
-- Index cho bảng users
CREATE INDEX idx_users_username_email ON users(username, email);
-- Tăng tốc tìm kiếm người dùng theo tên đăng nhập hoặc email

-- Index cho bảng locations
CREATE INDEX idx_locations_name ON locations(name);
-- Tăng tốc tìm kiếm địa điểm theo tên

CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
-- Tăng tốc tìm kiếm địa điểm theo tọa độ GPS (tìm kiếm quanh vị trí hiện tại)

-- Index cho bảng reviews
CREATE INDEX idx_reviews_user_location ON reviews(user_id, location_id);
-- Tăng tốc tìm kiếm đánh giá theo người dùng và địa điểm

-- Index cho bảng itineraries
CREATE INDEX idx_itineraries_user ON itineraries(user_id);
-- Tăng tốc tìm kiếm lịch trình theo người dùng

CREATE INDEX idx_itineraries_dates ON itineraries(start_date, end_date);
-- Tăng tốc tìm kiếm lịch trình theo khoảng thời gian

-- Index cho bảng itinerary_days
CREATE INDEX idx_itinerary_days_itinerary ON itinerary_days(itinerary_id);
-- Tăng tốc tìm kiếm chi tiết ngày trong lịch trình

-- Index cho bảng activities
CREATE INDEX idx_activities_day ON activities(day_id);
-- Tăng tốc tìm kiếm hoạt động theo ngày trong lịch trình

-- Index cho bảng articles
CREATE INDEX idx_articles_user ON articles(user_id);
-- Tăng tốc tìm kiếm bài viết theo tác giả

-- Index cho bảng comments
CREATE INDEX idx_comments_article ON comments(article_id);
-- Tăng tốc tìm kiếm bình luận theo bài viết

CREATE INDEX idx_comments_user ON comments(user_id);
-- Tăng tốc tìm kiếm bình luận theo người dùng

-- Index cho bảng chat_logs
CREATE INDEX idx_chat_logs_user ON chat_logs(user_id);
-- Tăng tốc tìm kiếm lịch sử trò chuyện theo người dùng

-- Index cho bảng analytics
CREATE INDEX idx_analytics_user_event ON analytics(user_id, event_type);
-- Tăng tốc tìm kiếm sự kiện phân tích theo người dùng và loại sự kiện

-- Index cho bảng favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);
-- Tăng tốc tìm kiếm địa điểm yêu thích theo người dùng