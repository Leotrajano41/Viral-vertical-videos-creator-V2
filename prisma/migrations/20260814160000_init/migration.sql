-- CreateTable: users
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "stripe_id" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 50,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable: voices
CREATE TABLE "voices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sample_url" TEXT NOT NULL,
    "voice_model" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: projects
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'pt',
    "country" TEXT NOT NULL DEFAULT 'BR',
    "duration_min" INTEGER NOT NULL DEFAULT 25,
    "duration_max" INTEGER NOT NULL DEFAULT 40,
    "format" TEXT NOT NULL DEFAULT '9:16',
    "prompt_master" TEXT NOT NULL,
    "template" TEXT NOT NULL DEFAULT 'breaking_news',
    "voice_type" TEXT NOT NULL DEFAULT 'edge_tts',
    "voice_id" TEXT,
    "headline_color" TEXT NOT NULL DEFAULT 'yellow',
    "cta_text" TEXT,
    "music_mode" TEXT NOT NULL DEFAULT 'random',
    "music_volume" REAL NOT NULL DEFAULT 0.30,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "projects_voice_id_fkey" FOREIGN KEY ("voice_id") REFERENCES "voices" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable: project_folders
CREATE TABLE "project_folders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "s3_path" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_folders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: document_indexes
CREATE TABLE "document_indexes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "file_hash" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "chunks_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_indexes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: ideas
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ideas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: videos
CREATE TABLE "videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "video_url" TEXT,
    "thumbnail_url" TEXT,
    "youtube_video_id" TEXT,
    "scheduled_at" DATETIME,
    "published_at" DATETIME,
    "error_message" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "videos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "videos_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: subscriptions
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "stripe_price_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "current_period_end" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: youtube_accounts
CREATE TABLE "youtube_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "channel_title" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "youtube_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndexes
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_stripe_id_idx" ON "users"("stripe_id");
CREATE INDEX "voices_user_id_idx" ON "voices"("user_id");
CREATE INDEX "projects_user_id_idx" ON "projects"("user_id");
CREATE INDEX "projects_niche_idx" ON "projects"("niche");
CREATE INDEX "projects_deleted_at_idx" ON "projects"("deleted_at");
CREATE INDEX "project_folders_project_id_idx" ON "project_folders"("project_id");
CREATE INDEX "document_indexes_project_id_idx" ON "document_indexes"("project_id");
CREATE INDEX "document_indexes_file_hash_idx" ON "document_indexes"("file_hash");
CREATE INDEX "ideas_project_id_idx" ON "ideas"("project_id");
CREATE INDEX "ideas_status_idx" ON "ideas"("status");
CREATE INDEX "videos_project_id_idx" ON "videos"("project_id");
CREATE INDEX "videos_idea_id_idx" ON "videos"("idea_id");
CREATE INDEX "videos_status_idx" ON "videos"("status");
CREATE INDEX "videos_scheduled_at_idx" ON "videos"("scheduled_at");
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");
CREATE INDEX "youtube_accounts_user_id_idx" ON "youtube_accounts"("user_id");
