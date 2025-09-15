-- CreateEnum
CREATE TYPE "public"."MeasureType" AS ENUM ('WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'QUANTITY', 'CONTAINER');

-- AlterTable
ALTER TABLE "public"."quote_items" ADD COLUMN     "measure_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."measures" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "shortName" VARCHAR(20) NOT NULL,
    "symbol" VARCHAR(10),
    "type" "public"."MeasureType" NOT NULL,
    "baseUnit" VARCHAR(20),
    "conversionFactor" DECIMAL(15,6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "measures_type_idx" ON "public"."measures"("type");

-- CreateIndex
CREATE INDEX "measures_is_active_sort_order_idx" ON "public"."measures"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "quote_items_measure_id_idx" ON "public"."quote_items"("measure_id");

-- AddForeignKey
ALTER TABLE "public"."quote_items" ADD CONSTRAINT "quote_items_measure_id_fkey" FOREIGN KEY ("measure_id") REFERENCES "public"."measures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
