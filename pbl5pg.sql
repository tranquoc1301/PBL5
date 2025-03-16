-- Tạo các bảng theo đúng thứ tự quan hệ

-- 1. BẢNG USERS (NGƯỜI DÙNG)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    google_id VARCHAR(50) UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    full_name VARCHAR(100),
    avatar_url VARCHAR(255),
    bio TEXT,
    location_preference VARCHAR(100),
    social_links JSONB,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user' CHECK ("role" IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG LOCATIONS (ĐỊA ĐIỂM)
CREATE TABLE IF NOT EXISTS locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    open_time TIME, -- Thời gian mở cửa
    close_time TIME, -- Thời gian đóng cửa
    average_rating DECIMAL(3, 2) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5), -- Điểm đánh giá trung bình
    image_url VARCHAR(255) NOT NULL,
    tags JSONB, -- Từ khóa liên quan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG ITINERARIES (LỊCH TRÌNH)
CREATE TABLE IF NOT EXISTS itineraries (
    itinerary_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL, -- Ngày bắt đầu
    end_date DATE NOT NULL, -- Ngày kết thúc
    status VARCHAR(20) NOT NULL CHECK (status IN ('public', 'private', 'shared')) DEFAULT 'private', -- Trạng thái công khai, riêng tư hoặc chia sẻ
    optimized BOOLEAN DEFAULT false, -- Có tối ưu hóa không
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG ITINERARY_DAYS (CHI TIẾT NGÀY)
CREATE TABLE IF NOT EXISTS itinerary_days (
    day_id SERIAL PRIMARY KEY,
    itinerary_id INT NOT NULL REFERENCES itineraries(itinerary_id) ON DELETE CASCADE, -- Tham chiếu đến lịch trình
    date DATE NOT NULL, -- Ngày cụ thể
    day_order INT NOT NULL, -- Thứ tự ngày trong lịch trình
    optimized_route JSONB, -- Tuyến đường tối ưu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG POSTS (BÀI POST)
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    caption TEXT, -- Mô tả ngắn gọn
    images JSONB NOT NULL, -- Danh sách URL hình ảnh
    location_id INT REFERENCES locations(location_id) ON DELETE SET NULL, -- Tham chiếu đến địa điểm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG ACTIVITIES (HOẠT ĐỘNG)
CREATE TABLE IF NOT EXISTS activities (
    activity_id SERIAL PRIMARY KEY,
    day_id INT NOT NULL REFERENCES itinerary_days(day_id) ON DELETE CASCADE, -- Tham chiếu đến chi tiết ngày
    location_id INT REFERENCES locations(location_id) ON DELETE SET NULL, -- Tham chiếu đến địa điểm
    title VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL, -- Thời gian bắt đầu hoạt động
    end_time TIME NOT NULL, -- Thời gian kết thúc hoạt động
    notes TEXT, -- Ghi chú thêm
    activity_type VARCHAR(50) CHECK (activity_type IN ('visit', 'transport', 'meal', 'rest', 'other', 'post')), -- Loại hoạt động
    activity_order INT NOT NULL, -- Thứ tự hoạt động trong ngày
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG ARTICLES (BÀI VIẾT)
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL, -- Nội dung bài viết
    images JSONB, -- Danh sách URL hình ảnh
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published', -- Trạng thái bài viết
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG COMMENTS (BÌNH LUẬN)
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE, -- Tham chiếu đến bài viết
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    content TEXT NOT NULL, -- Nội dung bình luận
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. BẢNG REVIEWS (ĐÁNH GIÁ)
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE, -- Tham chiếu đến địa điểm
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- Điểm đánh giá từ 1 đến 5
    comment TEXT, -- Bình luận kèm theo
    photos JSONB, -- Danh sách URL hình ảnh
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. BẢNG CHAT_LOGS (CHATBOT)
CREATE TABLE IF NOT EXISTS chat_logs (
    chat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    message TEXT NOT NULL, -- Tin nhắn từ người dùng
    response TEXT NOT NULL, -- Phản hồi từ chatbot
    intent VARCHAR(50), -- Ý định của người dùng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. BẢNG ANALYTICS (PHÂN TÍCH)
CREATE TABLE IF NOT EXISTS analytics (
    event_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL, -- Tham chiếu đến người dùng
    event_type VARCHAR(50) NOT NULL, -- Loại sự kiện
    event_data JSONB, -- Dữ liệu sự kiện
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. BẢNG FAVORITES (YÊU THÍCH)
CREATE TABLE IF NOT EXISTS favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE, -- Tham chiếu đến địa điểm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, location_id) -- Mỗi người dùng chỉ yêu thích một địa điểm một lần
);

-- 13. BẢNG POST_LIKES (THÍCH BÀI POST)
CREATE TABLE IF NOT EXISTS post_likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Tham chiếu đến người dùng
    post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE, -- Tham chiếu đến bài post
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id) -- Mỗi người dùng chỉ thích một bài post một lần
);

-- FUNCTION CẬP NHẬT THỜI GIAN
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP; -- Cập nhật trường updated_at với thời gian hiện tại
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER CẬP NHẬT THỜI GIAN
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_locations_modtime BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_reviews_modtime BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_itineraries_modtime BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_itinerary_days_modtime BEFORE UPDATE ON itinerary_days FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_activities_modtime BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_articles_modtime BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_comments_modtime BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_posts_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- INDEX TỐI ƯU
CREATE INDEX idx_users_username_email ON users(username, email); -- Chỉ mục cho tìm kiếm nhanh theo tên người dùng và email
CREATE INDEX idx_locations_name ON locations(name); -- Chỉ mục cho tìm kiếm nhanh theo tên địa điểm
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude); -- Chỉ mục cho tìm kiếm nhanh theo tọa độ địa lý
CREATE INDEX idx_reviews_user_location ON reviews(user_id, location_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng và địa điểm
CREATE INDEX idx_itineraries_user ON itineraries(user_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng
CREATE INDEX idx_itineraries_dates ON itineraries(start_date, end_date); -- Chỉ mục cho tìm kiếm nhanh theo khoảng thời gian
CREATE INDEX idx_itinerary_days_itinerary ON itinerary_days(itinerary_id); -- Chỉ mục cho tìm kiếm nhanh theo lịch trình
CREATE INDEX idx_activities_day ON activities(day_id); -- Chỉ mục cho tìm kiếm nhanh theo chi tiết ngày
CREATE INDEX idx_articles_user ON articles(user_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng
CREATE INDEX idx_comments_article ON comments(article_id); -- Chỉ mục cho tìm kiếm nhanh theo bài viết
CREATE INDEX idx_comments_user ON comments(user_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng
CREATE INDEX idx_chat_logs_user ON chat_logs(user_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng
CREATE INDEX idx_analytics_user_event ON analytics(user_id, event_type); -- Chỉ mục cho tìm kiếm nhanh theo người dùng và loại sự kiện
CREATE INDEX idx_analytics_event_type ON analytics(event_type); -- Chỉ mục cho tìm kiếm nhanh theo loại sự kiện
CREATE INDEX idx_favorites_user ON favorites(user_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng

-- INDEX CHO BẢNG POSTS VÀ POST_LIKES
CREATE INDEX idx_posts_user ON posts(user_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng
CREATE INDEX idx_posts_location ON posts(location_id); -- Chỉ mục cho tìm kiếm nhanh theo địa điểm
CREATE INDEX idx_posts_created ON posts(created_at); -- Chỉ mục cho tìm kiếm nhanh theo thời gian tạo
CREATE INDEX idx_post_likes_post ON post_likes(post_id); -- Chỉ mục cho tìm kiếm nhanh theo bài post
CREATE INDEX idx_post_likes_user ON post_likes(user_id); -- Chỉ mục cho tìm kiếm nhanh theo người dùng