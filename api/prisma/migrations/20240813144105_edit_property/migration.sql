/*
  Warnings:

  - Added the required column `city` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL;
