-- **************************************************************
-- 1. BẢNG USERS (NGƯỜI DÙNG)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100), -- Tên đầy đủ
    avatar_url VARCHAR(255), -- Ảnh đại diện (Cloudinary)
    bio TEXT, -- Giới thiệu
    location_preference VARCHAR(100), -- Sở thích địa điểm
    travel_interests VARCHAR(255), -- Sở thích du lịch (JSON)
    social_links JSONB, -- MXH (Facebook, Instagram)
    notification_preferences JSONB, -- Cài đặt thông báo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 2. BẢNG LOCATIONS (ĐỊA ĐIỂM)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    latitude DECIMAL(9,6) NOT NULL, -- Tích hợp Google Maps
    longitude DECIMAL(9,6) NOT NULL,
    average_rating DECIMAL(3,2) CHECK (average_rating BETWEEN 0 AND 5),
    image_url VARCHAR(255) NOT NULL, -- Cloudinary
    tags VARCHAR(255) NOT NULL, -- Thẻ tag (ví dụ: "nature, historical")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 3. BẢNG REVIEWS (ĐÁNH GIÁ)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    location_id INT REFERENCES Locations(location_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 4. BẢNG ITINERARIES (LỊCH TRÌNH)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Itineraries (
    itinerary_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('public', 'private')) DEFAULT 'private',
    optimized BOOLEAN DEFAULT false, -- Kế hoạch AI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 5. BẢNG DAYS (CHI TIẾT NGÀY)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Days (
    day_id SERIAL PRIMARY KEY,
    itinerary_id INT REFERENCES Itineraries(itinerary_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    "order" INT NOT NULL,
    optimized_route JSONB, -- Lộ trình tối ưu từ AI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 6. BẢNG ACTIVITIES (HOẠT ĐỘNG)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Activities (
    activity_id SERIAL PRIMARY KEY,
    day_id INT REFERENCES Days(day_id) ON DELETE CASCADE,
    location_id INT REFERENCES Locations(location_id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 7. BẢNG POSTS (BÀI VIẾT)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255), -- Cloudinary
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 8. BẢNG COMMENTS (BÌNH LUẬN)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES Posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 9. BẢNG CHATLOGS (CHATBOT)
-- **************************************************************
CREATE TABLE IF NOT EXISTS ChatLogs (
    chat_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    intent VARCHAR(50), -- Ý định NLP (ví dụ: "find_restaurant")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- 10. BẢNG ANALYTICS (PHÂN TÍCH)
-- **************************************************************
CREATE TABLE IF NOT EXISTS Analytics (
    event_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- "search", "click", "rating"
    event_data JSONB, -- Dữ liệu chi tiết (ví dụ: {"location_id": 123})
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **************************************************************
-- TẠO INDEX TỐI ƯU
-- **************************************************************
CREATE INDEX idx_users ON Users(username, email);
CREATE INDEX idx_locations ON Locations(name, tags);
CREATE INDEX idx_reviews ON Reviews(user_id, location_id);
CREATE INDEX idx_itineraries ON Itineraries(user_id, optimized);
CREATE INDEX idx_chatlogs ON ChatLogs(user_id, intent);
CREATE INDEX idx_analytics ON Analytics(user_id, event_type);