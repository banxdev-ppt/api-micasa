CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user JSON NOT NULL,
    post_type VARCHAR(255) NOT NULL,
    post_desc TEXT NOT NULL,
    post_images JSON NULL,
    post_likes JSON NULL,
    post_comments JSON NULL,
    updated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);