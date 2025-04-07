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

-- 2. BẢNG CITIES (THÀNH PHỐ)
CREATE TABLE IF NOT EXISTS cities (
    city_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG ATTRACTIONS (ĐỊA ĐIỂM THAM QUAN)
CREATE TABLE IF NOT EXISTS attractions (
    attraction_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    city_id INT NOT NULL REFERENCES cities(city_id) ON DELETE CASCADE,
    address VARCHAR(255),
    average_rating DECIMAL(3, 2) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    image_url JSONB,
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG RESTAURANTS (ĐỊA ĐIỂM ẨM THỰC)
CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    city_id INT NOT NULL REFERENCES cities(city_id) ON DELETE CASCADE,
    address VARCHAR(255),
    phone_number VARCHAR(20),
    open_time TIME,
    close_time TIME,
    average_rating DECIMAL(3, 2) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    image_url JSONB,
    tags JSONB,
    reservation_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG ITINERARIES (LỊCH TRÌNH)
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (start_date <= end_date)
);

-- 6. BẢNG ITINERARY_DAYS (CHI TIẾT NGÀY)
CREATE TABLE IF NOT EXISTS itinerary_days (
    day_id SERIAL PRIMARY KEY,
    itinerary_id INT NOT NULL REFERENCES itineraries(itinerary_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_order INT NOT NULL,
    optimized_route JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (itinerary_id, date)
);

-- 7. BẢNG POSTS (BÀI POST)
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    caption TEXT,
    images JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG ACTIVITIES (HOẠT ĐỘNG)
CREATE TABLE IF NOT EXISTS activities (
    activity_id SERIAL PRIMARY KEY,
    day_id INT NOT NULL REFERENCES itinerary_days(day_id) ON DELETE CASCADE,
    attraction_id INT REFERENCES attractions(attraction_id),
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    title VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    notes TEXT,
    activity_type VARCHAR(50) CHECK (activity_type IN ('visit', 'transport', 'meal', 'rest', 'other', 'post')),
    activity_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (day_id, activity_order),
    CONSTRAINT valid_times CHECK (start_time < end_time),
    CONSTRAINT activity_location_check CHECK (
        (activity_type = 'visit' AND attraction_id IS NOT NULL) OR
        (activity_type = 'meal' AND restaurant_id IS NOT NULL) OR
        (activity_type NOT IN ('visit', 'meal') AND attraction_id IS NULL AND restaurant_id IS NULL)
    )
);

-- 9. BẢNG ARTICLES (BÀI VIẾT)
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

-- 10. BẢNG COMMENTS (BÌNH LUẬN)
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. BẢNG REVIEWS (ĐÁNH GIÁ)
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    attraction_id INT REFERENCES attractions(attraction_id),
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    photos JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (attraction_id IS NOT NULL AND restaurant_id IS NULL) OR
        (restaurant_id IS NOT NULL AND attraction_id IS NULL)
    )
);

-- 12. BẢNG CHAT_LOGS (CHATBOT)
CREATE TABLE IF NOT EXISTS chat_logs (
    chat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    intent VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. BẢNG ANALYTICS (PHÂN TÍCH)
CREATE TABLE IF NOT EXISTS analytics (
    event_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. BẢNG FAVORITES (YÊU THÍCH)
CREATE TABLE IF NOT EXISTS favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    attraction_id INT REFERENCES attractions(attraction_id),
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, attraction_id),
    UNIQUE (user_id, restaurant_id),
    CHECK (
        (attraction_id IS NOT NULL AND restaurant_id IS NULL) OR
        (restaurant_id IS NOT NULL AND attraction_id IS NULL)
    )
);

-- 15. BẢNG POST_LIKES (THÍCH BÀI POST)
CREATE TABLE IF NOT EXISTS post_likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, post_id)
);

-- 16. BẢNG ITINERARY_SHARES (QUAN HỆ NHIỀU-NHIỀU)
CREATE TABLE IF NOT EXISTS itinerary_shares (
    share_id SERIAL PRIMARY KEY,
    itinerary_id INT NOT NULL REFERENCES itineraries(itinerary_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    permission VARCHAR(20) NOT NULL CHECK (permission IN ('view', 'edit')) DEFAULT 'view',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. BẢNG ARTICLE_ATTRACTIONS (QUAN HỆ NHIỀU-NHIỀU VỚI ATTRACTONS)
CREATE TABLE IF NOT EXISTS article_attractions (
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    attraction_id INT NOT NULL REFERENCES attractions(attraction_id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, attraction_id)
);

-- 18. BẢNG ARTICLE_RESTAURANTS (QUAN HỆ NHIỀU-NHIỀU VỚI RESTAURANTS)
CREATE TABLE IF NOT EXISTS article_restaurants (
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, restaurant_id)
);

-- FUNCTION CẬP NHẬT THỜI GIAN
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER CẬP NHẬT THỜI GIAN
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_cities_modtime BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_attractions_modtime BEFORE UPDATE ON attractions FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_restaurants_modtime BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_itineraries_modtime BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_itinerary_days_modtime BEFORE UPDATE ON itinerary_days FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_posts_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_activities_modtime BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_articles_modtime BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_comments_modtime BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_reviews_modtime BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_favorites_modtime BEFORE UPDATE ON favorites FOR EACH ROW EXECUTE FUNCTION update_modified_column();

    -- INDEX TỐI ƯU HIỆU SUẤT
    CREATE INDEX idx_users_username_email ON users(username, email);
    CREATE INDEX idx_cities_name ON cities(name);
    CREATE INDEX idx_locations_name ON locations(name);
    CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
    CREATE INDEX idx_reviews_user_location ON reviews(user_id, location_id);
    CREATE INDEX idx_itineraries_user ON itineraries(user_id);
    CREATE INDEX idx_itineraries_dates ON itineraries(start_date, end_date);
    CREATE INDEX idx_itinerary_days_itinerary ON itinerary_days(itinerary_id);
    CREATE INDEX idx_activities_day ON activities(day_id);
    CREATE INDEX idx_articles_user ON articles(user_id);
    CREATE INDEX idx_articles_title ON articles(title);
    CREATE INDEX idx_comments_article ON comments(article_id);
    CREATE INDEX idx_comments_user ON comments(user_id);
    CREATE INDEX idx_chat_logs_user ON chat_logs(user_id);
    CREATE INDEX idx_analytics_user_event ON analytics(user_id, event_type);
    CREATE INDEX idx_analytics_event_type ON analytics(event_type);
    CREATE INDEX idx_favorites_user ON favorites(user_id);
    CREATE INDEX idx_posts_user ON posts(user_id);
    CREATE INDEX idx_posts_location ON posts(location_id);
    CREATE INDEX idx_posts_created ON posts(created_at);
    CREATE INDEX idx_posts_caption ON posts(caption);
    CREATE INDEX idx_post_likes_post ON post_likes(post_id);
    CREATE INDEX idx_post_likes_user ON post_likes(user_id);



    INSERT INTO users (google_id, username, email, password, password_reset_token, password_reset_expires, full_name, avatar_url, bio, location_preference, social_links, "role", preferences, created_at, updated_at)
VALUES
    ('google_12345', 'john_doe', 'john@example.com', 'hashed_password_1', NULL, NULL, 'John Doe', 'https://example.com/avatar1.jpg', 'Software Engineer', 'New York', '{"github": "https://github.com/johndoe"}', 'user', '{"theme": "dark"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_67890', 'jane_doe', 'jane@example.com', 'hashed_password_2', NULL, NULL, 'Jane Doe', 'https://example.com/avatar2.jpg', 'UI/UX Designer', 'San Francisco', '{"twitter": "https://twitter.com/janedoe"}', 'user', '{"theme": "light"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_11223', 'alice_w', 'alice@example.com', 'hashed_password_3', NULL, NULL, 'Alice Wonderland', 'https://example.com/avatar3.jpg', 'Data Scientist', 'London', '{"linkedin": "https://linkedin.com/in/alicew"}', 'admin', '{"theme": "dark", "notifications": "on"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_33445', 'bob_m', 'bob@example.com', 'hashed_password_4', NULL, NULL, 'Bob Marley', 'https://example.com/avatar4.jpg', 'DevOps Engineer', 'Berlin', '{"github": "https://github.com/bobm"}', 'user', '{"theme": "light"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_55667', 'charlie_p', 'charlie@example.com', 'hashed_password_5', NULL, NULL, 'Charlie Parker', 'https://example.com/avatar5.jpg', 'Cloud Architect', 'Sydney', '{"website": "https://charliep.com"}', 'user', '{"theme": "dark"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_77889', 'david_k', 'david@example.com', 'hashed_password_6', NULL, NULL, 'David Kim', 'https://example.com/avatar6.jpg', 'Full Stack Developer', 'Tokyo', '{"twitter": "https://twitter.com/davidk"}', 'admin', '{"theme": "light", "notifications": "off"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_99000', 'emma_t', 'emma@example.com', 'hashed_password_7', NULL, NULL, 'Emma Thompson', 'https://example.com/avatar7.jpg', 'Product Manager', 'Paris', '{"linkedin": "https://linkedin.com/in/emmat"}', 'user', '{"theme": "dark"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_11121', 'frank_h', 'frank@example.com', 'hashed_password_8', NULL, NULL, 'Frank Herbert', 'https://example.com/avatar8.jpg', 'Cybersecurity Analyst', 'Dubai', '{"github": "https://github.com/frankh"}', 'user', '{"theme": "light"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_22232', 'grace_l', 'grace@example.com', 'hashed_password_9', NULL, NULL, 'Grace Lee', 'https://example.com/avatar9.jpg', 'AI Researcher', 'Singapore', '{"website": "https://gracelee.com"}', 'admin', '{"theme": "dark", "notifications": "on"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('google_33343', 'harry_p', 'harry@example.com', 'hashed_password_10', NULL, NULL, 'Harry Potter', 'https://example.com/avatar10.jpg', 'Software Architect', 'Los Angeles', '{"twitter": "https://twitter.com/harryp"}', 'user', '{"theme": "light"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO cities (name, description, image_url, created_at, updated_at)
VALUES
    ('Hà Nội', 'Thủ đô ngàn năm văn hiến với nhiều di tích lịch sử và văn hóa.', 'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ho-hoan-kiem-3.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Hồ Chí Minh', 'Thành phố năng động nhất Việt Nam, trung tâm kinh tế và tài chính.', 'https://nld.mediacdn.vn/2019/12/28/tp-hcm-ruc-ro-ve-dem-anh-hoang-trieu-4-15775262530931728274679.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Đà Nẵng', 'Thành phố đáng sống với biển xanh, cát trắng và các cây cầu nổi tiếng.', 'https://vcdn1-dulich.vnecdn.net/2022/06/03/cau-vang-jpeg-mobile-4171-1654247848.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=xrjEn1shZLiHomFix1sHNQ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Hải Phòng', 'Thành phố cảng quan trọng với bãi biển đẹp và ẩm thực đặc sắc.', 'https://bcp.cdnchinhphu.vn/334894974524682240/2023/12/3/6c2a27c4e9d617884ec7-1458d2ddfe164132b95ec163ccc8e4ea-1701595864429488932869.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Cần Thơ', 'Thủ phủ miền Tây với chợ nổi và hệ thống sông nước đặc trưng.', 'https://ik.imagekit.io/tvlk/blog/2021/11/dia-diem-du-lich-can-tho-cover.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Huế', 'Thành phố cổ kính với cố đô, lăng tẩm và những nét văn hóa đặc sắc.', 'https://kinhtevadubao.vn/stores/news_dataimages/kinhtevadubaovn/092018/18/14/1537170510-news-1243820210326195207.3736490.jpg?randTime=1742700082', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Nha Trang', 'Thành phố biển nổi tiếng với các bãi tắm đẹp và đảo Vinpearl.', 'https://bomanhatrang.com/wp-content/uploads/2023/03/dia-diem-du-lich-nha-trang-thumbnail-1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Đà Lạt', 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.', 'https://samtenhills.vn/wp-content/uploads/2024/01/kham-pha-4-khu-du-lich-tam-linh-da-lat-noi-tieng-bat-nhat.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Vũng Tàu', 'Thành phố du lịch biển gần TP.HCM với nhiều bãi biển đẹp.', 'https://sodl.baria-vungtau.gov.vn/portal/editor/image_collections/vung-tau-17-15-41-55.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Phú Quốc', 'Hòn đảo ngọc với những bãi biển hoang sơ và thiên nhiên hùng vĩ.', 'https://image.plo.vn/w1000/Uploaded/2025/gtnngu/2024_09_30/tp-phu-quoc-tinh-kien-giang-6853.jpg.webp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO locations (name, description, latitude, longitude, city_id, address, open_time, close_time, average_rating, image_url, tags, category, created_at, updated_at)
VALUES
    -- Địa điểm tại Đà Nẵng (city_id = 3)
    ('Cầu Rồng', 'Cây cầu biểu tượng của Đà Nẵng với thiết kế con rồng phun lửa và nước.', 1, 1, 3, 'Nguyễn Văn Linh, Đà Nẵng', '18:00', '22:00', 4.7, 'https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg', '{"tags": ["cầu", "biểu tượng", "phun lửa"]}', 'Công trình kiến trúc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bà Nà Hills', 'Khu du lịch nổi tiếng với Cầu Vàng, làng Pháp và khí hậu mát mẻ.', 1, 1, 3, 'Hòa Ninh, Hòa Vang, Đà Nẵng', '07:30', '17:00', 4.8, 'https://banahills.sunworld.vn/wp-content/uploads/2020/04/nui-chua-ba-na-1.png', '{"tags": ["khu du lịch", "cáp treo", "Cầu Vàng"]}', 'Khu du lịch', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Ngũ Hành Sơn', 'Quần thể 5 ngọn núi đá vôi với nhiều hang động và chùa linh thiêng.', 1, 1, 3, 'Ngũ Hành Sơn, Đà Nẵng', '06:00', '18:00', 4.5, 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Ngu_hanh_son_toan_canh.jpg', '{"tags": ["núi", "hang động", "chùa"]}', 'Di tích lịch sử', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bãi biển Mỹ Khê', 'Bãi biển đẹp nhất Đà Nẵng với cát trắng mịn và nước biển trong xanh.', 1, 1, 3, 'Võ Nguyên Giáp, Đà Nẵng', '06:00', '18:00', 4.9, 'https://havi-web.s3.ap-southeast-1.amazonaws.com/bien_my_khe_da_nang_2_11zon_1_a3a8e98ee1.webp', '{"tags": ["biển", "cát trắng", "tắm biển"]}', 'Bãi biển', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Chùa Linh Ứng', 'Ngôi chùa nổi tiếng với tượng Phật Quan Âm cao nhất Việt Nam.', 1, 1, 3, 'Bán đảo Sơn Trà, Đà Nẵng', '05:00', '20:00', 4.6, 'https://danangfantasticity.com/wp-content/uploads/2019/09/chua-linh-ung-chon-binh-yen-giua-long-da-nang-013-2.jpg', '{"tags": ["chùa", "tâm linh", "Sơn Trà"]}', 'Chùa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bán đảo Sơn Trà', 'Khu bảo tồn thiên nhiên với cảnh đẹp hoang sơ và nhiều loài động vật quý hiếm.', 1, 1, 3, 'Sơn Trà, Đà Nẵng', '06:00', '19:00', 4.7, 'https://images.vietnamtourism.gov.vn/vn/images/2021/Thang_5/son_tra.jpeg', '{"tags": ["thiên nhiên", "động vật", "bán đảo"]}', 'Khu bảo tồn', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Asia Park', 'Công viên giải trí với vòng quay Sun Wheel và nhiều trò chơi hấp dẫn.', 1, 1, 3, 'Phan Đăng Lưu, Đà Nẵng', '15:00', '22:00', 4.3, 'https://duan-sungroup.com/wp-content/uploads/2022/11/cong-vien-chau-a-ngay-cang-thu-hut-du-khach.jpg', '{"tags": ["giải trí", "vòng quay", "trò chơi"]}', 'Khu vui chơi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Hải đăng Tiên Sa', 'Ngọn hải đăng cổ với tầm nhìn tuyệt đẹp ra biển Đông.', 1, 1, 3, 'Sơn Trà, Đà Nẵng', '06:00', '17:00', 4.4, 'https://static.vinwonders.com/2022/12/hai-dang-tien-sa-0.jpg', '{"tags": ["hải đăng", "check-in", "biển"]}', 'Di tích', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bảo tàng Chăm', 'Bảo tàng lưu giữ nhiều hiện vật quý về văn hóa Chăm Pa.', 1, 1, 3, 'Trưng Nữ Vương, Đà Nẵng', '07:30', '17:00', 4.2, 'https://yootek.vn/wp-content/uploads/2025/02/Bao-tang1-1.jpg', '{"tags": ["bảo tàng", "Chăm Pa", "di tích"]}', 'Bảo tàng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Chợ Cồn', 'Chợ nổi tiếng với nhiều món ăn vặt hấp dẫn của Đà Nẵng.', 1, 1, 3, 'Hải Châu, Đà Nẵng', '06:00', '18:00', 4.5, 'https://dacsanlamqua.com/wp-content/uploads/2017/01/Anh-cho-con.jpg', '{"tags": ["ẩm thực", "chợ", "ăn vặt"]}', 'Chợ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

Select * from locations

INSERT INTO reviews (user_id, location_id, rating, comment, photos, created_at, updated_at) VALUES
(1, 2, 5, 'Cầu Rồng rất đẹp vào ban đêm, đặc biệt là khi rồng phun lửa.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
(2, 3, 4, 'Bà Nà Hills có khung cảnh đẹp nhưng giá vé hơi cao.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 4, 5, 'Ngũ Hành Sơn có nhiều hang động đẹp và chùa linh thiêng.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 5, 5, 'Bãi biển Mỹ Khê rất sạch và đẹp, nước biển trong xanh.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 6, 4, 'Chùa Linh Ứng rất thanh tịnh, tượng Phật Quan Âm rất lớn.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 7, 5, 'Bán đảo Sơn Trà có cảnh quan tuyệt đẹp, đường đi hơi dốc nhưng đáng giá.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 8, 3, 'Asia Park có nhiều trò chơi thú vị nhưng hơi đông vào cuối tuần.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 9, 4, 'Hải đăng Tiên Sa có view rất đẹp nhưng đường lên khá khó đi.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 10, 4, 'Bảo tàng Chăm có nhiều hiện vật quý, rất thích hợp cho những ai yêu thích lịch sử.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 11, 5, 'Chợ Cồn có nhiều món ăn vặt ngon, giá cả hợp lý.', '["https://furamavietnam.com/wp-content/uploads/2024/11/Furama-Resort-Danang-Sightseeing-Dragon-Brigde-2-1024x576.jpg"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO articles (user_id, title, content, images, status, created_at, updated_at) VALUES
(1, 'Du lịch Đà Nẵng', 'Bài viết chia sẻ về trải nghiệm du lịch Đà Nẵng, một trong những thành phố đẹp nhất Việt Nam.', 
 '["https://cozyvietnamtravel.com.vn/wp-content/uploads/2023/04/du-lich-da-nang_1657939501.jpg"]'::jsonb, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'Ẩm thực Huế', 'Giới thiệu các món ăn đặc sản của Huế như bún bò Huế, bánh bèo, bánh khoái.', 
 '["https://tapchiamthuc.net/wp-content/uploads/2021/04/doc-dao-net-am-thuc-hue-va-nhung-mon-ngon-kho-cuong-02.jpg.webp"]'::jsonb, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Hành trình khám phá Sapa', 'Hành trình đến Sapa với những trải nghiệm thú vị giữa núi rừng Tây Bắc.', 
 '["https://mtcs.1cdn.vn/2023/06/07/spcv.jpg"]'::jsonb, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 'Kinh nghiệm leo Fansipan', 'Những lưu ý quan trọng khi chinh phục đỉnh Fansipan, nóc nhà Đông Dương.', 
 '["https://saigontourist.net/uploads/destination/an-pham/Website%20content/Week%203_20170926_Cap%20treo%20Fansipan/saigontourist-sapa-vietnam-sep-vietnamese-flags-and-monument-at-summit-of-fansipan-the-highest_706797802.jpg"]'::jsonb, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 'Những bãi biển đẹp nhất Việt Nam', 'Danh sách các bãi biển tuyệt đẹp như Mỹ Khê, Nha Trang, Phú Quốc.', 
 '["https://cdn2.tuoitre.vn/471584752817336320/2023/4/18/tp-nha-trang-16818161974101240202452.jpeg"]'::jsonb, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 'Văn hóa cà phê Việt Nam', 'Tìm hiểu về văn hóa uống cà phê của người Việt từ cà phê sữa đá đến cà phê trứng.', 
 '["https://www.cubes-asia.com/storage/blogs/2025-01/gioi-thieu-ca-phe-viet-nam-lich-su-phan-loai.jpg"]'::jsonb, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 'Khám phá hang Sơn Đoòng', 'Hang động lớn nhất thế giới với cảnh quan kỳ vĩ và hệ sinh thái độc đáo.', 
 '["https://thanhnien.mediacdn.vn/Uploaded/phucndh/2022_04_14/a4-5211.jpg"]'::jsonb, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, 'Du lịch Hội An', 'Trải nghiệm phố cổ Hội An với đèn lồng rực rỡ và những con phố đầy hoài niệm.', 
 '["https://vcdn1-dulich.vnecdn.net/2022/06/01/Hoi-An-VnExpress-5851-16488048-4863-2250-1654057244.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2ea_f0O7kgGZllKmJF92g"]'::jsonb, 'archived', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, 'Phượt miền Tây mùa nước nổi', 'Hành trình khám phá miền Tây vào mùa nước nổi với khung cảnh thiên nhiên tuyệt đẹp.', 
 '["https://baocantho.com.vn/image/fckeditor/upload/2022/20220404/images/I%25201(1).gif"]'::jsonb, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, 'Bí quyết chụp ảnh đẹp khi đi du lịch', 'Những mẹo nhỏ giúp bạn có được những bức ảnh đẹp và ấn tượng khi đi du lịch.', 
 '["https://media.thanhtra.com.vn/public/data/images/0/2024/06/09/thaihai/tiem-nang-du-lich-viet-nam-hien-nay.jpg?w=1319"]'::jsonb, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



INSERT INTO comments (article_id, user_id, content, created_at, updated_at) VALUES
(1, 2, 'Mình vừa đi Đà Nẵng tuần trước, đúng là thành phố đáng sống!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 3, 'Huế có rất nhiều địa điểm đẹp và yên bình, thích nhất là đi thuyền trên sông Hương.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 'Mình đang lên kế hoạch đi Hội An, cảm ơn bài viết rất chi tiết!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 5, 'Bạn có thể chia sẻ thêm kinh nghiệm đi Phú Quốc không? Mình rất muốn khám phá nơi này.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 4, 'Bài viết rất hữu ích! Đà Lạt thực sự là thiên đường nghỉ dưỡng.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 7, 'Mình thích trải nghiệm đi xe máy xuyên Việt, rất đáng thử!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 8, 'Sa Pa mùa này có tuyết không nhỉ? Mình đang định đi vào tháng sau.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 6, 'Bài viết chi tiết quá, cảm ơn bạn! Mình sẽ lưu lại để lên lịch trình.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 9, 'Mình đã đến Nha Trang và rất thích các hoạt động lặn biển ở đây!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 10, 'Hạ Long quá đẹp, nhưng lần tới mình muốn thử trải nghiệm du thuyền!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);