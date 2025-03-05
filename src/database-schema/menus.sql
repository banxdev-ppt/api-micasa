CREATE TABLE menus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_title VARCHAR(255) NOT NULL,
    menu_category INT NOT NULL, 
    menu_image TEXT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
