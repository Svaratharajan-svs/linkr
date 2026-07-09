CREATE TABLE IF NOT EXISTS links (

    id UUID PRIMARY KEY,

    code VARCHAR(20) UNIQUE NOT NULL,

    alias VARCHAR(30) UNIQUE,

    original_url TEXT NOT NULL,

    created_by VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS clicks (

    id BIGSERIAL PRIMARY KEY,

    link_id UUID REFERENCES links(id),

    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



CREATE INDEX idx_links_code
ON links(code);



CREATE INDEX idx_clicks_link
ON clicks(link_id);