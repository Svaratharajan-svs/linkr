CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS links
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    code VARCHAR(20) UNIQUE NOT NULL,

    alias VARCHAR(50),

    original_url TEXT NOT NULL,

    created_by VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS clicks
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    link_id UUID NOT NULL REFERENCES links(id)
        ON DELETE CASCADE,

    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE INDEX idx_links_code
ON links(code);



CREATE INDEX idx_clicks_link_date
ON clicks(link_id,clicked_at);