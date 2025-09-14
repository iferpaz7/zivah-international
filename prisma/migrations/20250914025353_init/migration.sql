-- CreateEnum
CREATE TYPE "public"."QuoteStatus" AS ENUM ('PENDING', 'REVIEWED', 'QUOTED', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."QuotePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."CommunicationType" AS ENUM ('NOTE', 'EMAIL', 'PHONE_CALL', 'MEETING', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'SALES_MANAGER', 'SALES_REP', 'CUSTOMER_SERVICE', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."SettingType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'JSON', 'FILE');

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(50),
    "color" VARCHAR(7),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "category_id" INTEGER,
    "description" TEXT,
    "short_description" VARCHAR(500),
    "sku" VARCHAR(100),
    "specifications" JSONB,
    "base_price" DECIMAL(10,2),
    "price_unit" VARCHAR(20),
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "min_order_qty" INTEGER DEFAULT 1,
    "image_url" VARCHAR(500),
    "image_gallery" JSONB,
    "origin" VARCHAR(100) NOT NULL DEFAULT 'Ecuador',
    "harvest_season" VARCHAR(100),
    "certifications" JSONB,
    "nutritional_info" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" VARCHAR(255),
    "seo_description" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(50),
    "price" DECIMAL(10,2),
    "stock_qty" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "attributes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotes" (
    "id" SERIAL NOT NULL,
    "quote_number" VARCHAR(20) NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "customer_email" VARCHAR(255) NOT NULL,
    "customer_phone" VARCHAR(50),
    "company" VARCHAR(255),
    "country" VARCHAR(100),
    "shipping_address" JSONB,
    "message" TEXT,
    "status" "public"."QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "public"."QuotePriority" NOT NULL DEFAULT 'NORMAL',
    "total_amount" DECIMAL(12,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "valid_until" TIMESTAMP(3),
    "admin_notes" TEXT,
    "internal_notes" TEXT,
    "user_id" INTEGER,
    "assigned_to_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quote_items" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "specifications" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quote_communications" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "type" "public"."CommunicationType" NOT NULL DEFAULT 'NOTE',
    "subject" VARCHAR(255),
    "message" TEXT NOT NULL,
    "attachments" JSONB,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255),
    "role" "public"."UserRole" NOT NULL DEFAULT 'VIEWER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "avatar" VARCHAR(500),
    "phone" VARCHAR(50),
    "department" VARCHAR(100),
    "company" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_settings" (
    "id" SERIAL NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" TEXT,
    "setting_type" "public"."SettingType" NOT NULL DEFAULT 'TEXT',
    "category" VARCHAR(50),
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "validation_rules" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pages" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" VARCHAR(500),
    "meta_title" VARCHAR(255),
    "meta_description" VARCHAR(500),
    "language" VARCHAR(2) NOT NULL DEFAULT 'es',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "template" VARCHAR(50),
    "featured_image" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" INTEGER,
    "details" JSONB,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_submissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "company" VARCHAR(255),
    "country" VARCHAR(100),
    "subject" VARCHAR(255),
    "message" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'general',
    "source" VARCHAR(50),
    "status" VARCHAR(20) NOT NULL DEFAULT 'new',
    "priority" VARCHAR(10) NOT NULL DEFAULT 'normal',
    "assigned_to" INTEGER,
    "notes" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_subscriptions" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "language" VARCHAR(2) NOT NULL DEFAULT 'es',
    "interests" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "confirmed_at" TIMESTAMP(3),
    "unsubscribed_at" TIMESTAMP(3),
    "source" VARCHAR(50),
    "ip_address" VARCHAR(45),
    "preferences" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_is_active_sort_order_idx" ON "public"."categories"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "public"."products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "public"."products"("sku");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "public"."products"("category_id");

-- CreateIndex
CREATE INDEX "products_is_active_is_featured_idx" ON "public"."products"("is_active", "is_featured");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "public"."products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "public"."product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_product_id_idx" ON "public"."product_variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_quote_number_key" ON "public"."quotes"("quote_number");

-- CreateIndex
CREATE INDEX "quotes_status_priority_idx" ON "public"."quotes"("status", "priority");

-- CreateIndex
CREATE INDEX "quotes_customer_email_idx" ON "public"."quotes"("customer_email");

-- CreateIndex
CREATE INDEX "quotes_created_at_idx" ON "public"."quotes"("created_at");

-- CreateIndex
CREATE INDEX "quote_items_quote_id_idx" ON "public"."quote_items"("quote_id");

-- CreateIndex
CREATE INDEX "quote_items_product_id_idx" ON "public"."quote_items"("product_id");

-- CreateIndex
CREATE INDEX "quote_communications_quote_id_idx" ON "public"."quote_communications"("quote_id");

-- CreateIndex
CREATE INDEX "quote_communications_created_at_idx" ON "public"."quote_communications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "public"."users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_setting_key_key" ON "public"."site_settings"("setting_key");

-- CreateIndex
CREATE INDEX "site_settings_category_idx" ON "public"."site_settings"("category");

-- CreateIndex
CREATE INDEX "site_settings_is_public_idx" ON "public"."site_settings"("is_public");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "public"."pages"("slug");

-- CreateIndex
CREATE INDEX "pages_slug_idx" ON "public"."pages"("slug");

-- CreateIndex
CREATE INDEX "pages_language_idx" ON "public"."pages"("language");

-- CreateIndex
CREATE INDEX "pages_is_published_idx" ON "public"."pages"("is_published");

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "public"."activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "public"."activity_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "public"."activity_logs"("created_at");

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "public"."contact_submissions"("email");

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "public"."contact_submissions"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_type_idx" ON "public"."contact_submissions"("type");

-- CreateIndex
CREATE INDEX "contact_submissions_created_at_idx" ON "public"."contact_submissions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_email_key" ON "public"."newsletter_subscriptions"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_is_active_idx" ON "public"."newsletter_subscriptions"("is_active");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_language_idx" ON "public"."newsletter_subscriptions"("language");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_items" ADD CONSTRAINT "quote_items_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_items" ADD CONSTRAINT "quote_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_communications" ADD CONSTRAINT "quote_communications_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_communications" ADD CONSTRAINT "quote_communications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
