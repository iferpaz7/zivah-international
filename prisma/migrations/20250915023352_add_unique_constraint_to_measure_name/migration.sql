/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `measures` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "measures_name_key" ON "public"."measures"("name");
