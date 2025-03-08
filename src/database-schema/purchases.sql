CREATE TABLE purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    menu JSON NOT NULL,
    fam_id INT NOT NULL,
    member JSON NOT NULL,
    purchase_type INT NOT NULL,
    status_type INT NOT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
