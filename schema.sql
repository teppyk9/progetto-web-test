-- Create a table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- Added email field as it's common
    password_hash VARCHAR(255) NOT NULL, -- For storing hashed passwords
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- You can add more tables here as needed, for example:
-- CREATE TABLE posts (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER NOT NULL REFERENCES users(id),
--     title VARCHAR(255) NOT NULL,
--     content TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
