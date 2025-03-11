-- Tạo các bảng theo đúng thứ tự quan hệ

-- 1. BẢNG USERS (NGƯỜI DÙNG) - Tạm thời không có tham chiếu đến posts
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
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
    average_rating DECIMAL(3, 2) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    image_url VARCHAR(255) NOT NULL,
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG ITINERARIES (LỊCH TRÌNH)
CREATE TABLE IF NOT EXISTS itineraries (
    itinerary_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('public', 'private', 'shared')) DEFAULT 'private',
    optimized BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG ITINERARY_DAYS (CHI TIẾT NGÀY)
CREATE TABLE IF NOT EXISTS itinerary_days (
    day_id SERIAL PRIMARY KEY,
    itinerary_id INT NOT NULL REFERENCES itineraries(itinerary_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_order INT NOT NULL,
    optimized_route JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG POSTS (BÀI POST) - Di chuyển lên trước khi tạo bảng activities
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    caption TEXT,
    images JSONB NOT NULL, -- Ví dụ: ["https://...", "https://..."]
    location_id INT REFERENCES locations(location_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG ACTIVITIES (HOẠT ĐỘNG)
CREATE TABLE IF NOT EXISTS activities (
    activity_id SERIAL PRIMARY KEY,
    day_id INT NOT NULL REFERENCES itinerary_days(day_id) ON DELETE CASCADE,
    location_id INT REFERENCES locations(location_id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    notes TEXT,
    activity_type VARCHAR(50) CHECK (activity_type IN ('visit', 'transport', 'meal', 'rest', 'other', 'post')),
    activity_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG ARTICLES (BÀI VIẾT)
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    images JSONB,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG COMMENTS (BÌNH LUẬN)
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. BẢNG REVIEWS (ĐÁNH GIÁ)
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    photos JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. BẢNG CHAT_LOGS (CHATBOT)
CREATE TABLE IF NOT EXISTS chat_logs (
    chat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    intent VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. BẢNG ANALYTICS (PHÂN TÍCH)
CREATE TABLE IF NOT EXISTS analytics (
    event_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. BẢNG FAVORITES (YÊU THÍCH)
CREATE TABLE IF NOT EXISTS favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, location_id)
);

-- 13. BẢNG POST_LIKES (THÍCH BÀI POST)
CREATE TABLE IF NOT EXISTS post_likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id) -- Mỗi user chỉ like 1 post 1 lần
);

-- Bây giờ thêm ràng buộc tham chiếu cho bảng users
ALTER TABLE users
ADD CONSTRAINT fk_users_last_post
FOREIGN KEY (last_post_id) REFERENCES posts(post_id) ON DELETE SET NULL;

-- FUNCTION CẬP NHẬT THỜI GIAN
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
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
CREATE INDEX idx_users_username_email ON users(username, email);
CREATE INDEX idx_locations_name ON locations(name);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX idx_reviews_user_location ON reviews(user_id, location_id);
CREATE INDEX idx_itineraries_user ON itineraries(user_id);
CREATE INDEX idx_itineraries_dates ON itineraries(start_date, end_date);
CREATE INDEX idx_itinerary_days_itinerary ON itinerary_days(itinerary_id);
CREATE INDEX idx_activities_day ON activities(day_id);
CREATE INDEX idx_articles_user ON articles(user_id);
CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_chat_logs_user ON chat_logs(user_id);
CREATE INDEX idx_analytics_user_event ON analytics(user_id, event_type);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- INDEX CHO BẢNG POSTS VÀ POST_LIKES
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_location ON posts(location_id);
CREATE INDEX idx_posts_created ON posts(created_at);
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);