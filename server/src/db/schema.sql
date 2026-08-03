CREATE TABLE IF NOT EXISTS contacts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  message     TEXT         NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_key VARCHAR(50) NOT NULL UNIQUE,   -- e.g., 'chatbot_avatar'
  mime_type VARCHAR(50) NOT NULL,           -- e.g., 'image/png'
  data LONGBLOB NOT NULL,                   -- raw binary bytes
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
