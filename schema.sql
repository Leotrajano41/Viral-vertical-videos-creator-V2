-- =====================================================
-- VIRAL VERTICAL VIDEOS CREATOR v2.0 - POSTGRESQL DDL
-- Database Schema com Pgvector & Índices de Alta Performance
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    plan VARCHAR(32) NOT NULL DEFAULT 'free',
    stripe_id VARCHAR(255),
    credits INT NOT NULL DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_id ON users(stripe_id);

-- -----------------------------------------------------
-- Table: voices
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS voices (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sample_url TEXT NOT NULL,
    voice_model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_voices_user_id ON voices(user_id);

-- -----------------------------------------------------
-- Table: projects
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    niche VARCHAR(128) NOT NULL,
    theme VARCHAR(255) NOT NULL,
    language VARCHAR(16) NOT NULL DEFAULT 'pt',
    country VARCHAR(16) NOT NULL DEFAULT 'BR',
    duration_min INT NOT NULL DEFAULT 25,
    duration_max INT NOT NULL DEFAULT 40,
    format VARCHAR(16) NOT NULL DEFAULT '9:16',
    prompt_master TEXT NOT NULL,
    template VARCHAR(64) NOT NULL DEFAULT 'breaking_news',
    voice_type VARCHAR(32) NOT NULL DEFAULT 'edge_tts',
    voice_id VARCHAR(64) REFERENCES voices(id) ON DELETE SET NULL,
    headline_color VARCHAR(32) NOT NULL DEFAULT 'yellow',
    cta_text TEXT,
    music_mode VARCHAR(32) NOT NULL DEFAULT 'random',
    music_volume NUMERIC(3, 2) NOT NULL DEFAULT 0.30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_niche ON projects(niche);
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at);

-- -----------------------------------------------------
-- Table: project_folders
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_folders (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL,
    s3_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_folders_project_id ON project_folders(project_id);

-- -----------------------------------------------------
-- Table: document_embeddings (RAG Pgvector)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS document_embeddings (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    filepath TEXT NOT NULL,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI text-embedding-3-small dimension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_embeddings_project_id ON document_embeddings(project_id);
CREATE INDEX idx_embeddings_vector ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- -----------------------------------------------------
-- Table: ideas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ideas (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ideas_project_id ON ideas(project_id);
CREATE INDEX idx_ideas_status ON ideas(status);

-- -----------------------------------------------------
-- Table: videos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    idea_id VARCHAR(64) NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[],
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    progress INT NOT NULL DEFAULT 0,
    video_url TEXT,
    thumbnail_url TEXT,
    youtube_video_id VARCHAR(128),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_project_id ON videos(project_id);
CREATE INDEX idx_videos_idea_id ON videos(idea_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_scheduled_at ON videos(scheduled_at);
