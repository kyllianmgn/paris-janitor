/*
  Warnings:

  - Added the required column `instruction` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomCount` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'APPARTEMENT');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "instruction" TEXT NOT NULL,
ADD COLUMN     "propertyType" "PropertyType" NOT NULL,
ADD COLUMN     "roomCount" INTEGER NOT NULL;
