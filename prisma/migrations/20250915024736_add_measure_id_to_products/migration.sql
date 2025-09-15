-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "measure_id" INTEGER;

-- CreateIndex
CREATE INDEX "products_measure_id_idx" ON "public"."products"("measure_id");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_measure_id_fkey" FOREIGN KEY ("measure_id") REFERENCES "public"."measures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
