/*
  Warnings:

  - You are about to drop the column `traverlerId` on the `property_reservations` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `property_reviews` table. All the data in the column will be lost.
  - Added the required column `travelerId` to the `property_reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `service_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "landlords" DROP CONSTRAINT "landlords_userId_fkey";

-- DropForeignKey
ALTER TABLE "property_reservations" DROP CONSTRAINT "property_reservations_traverlerId_fkey";

-- DropForeignKey
ALTER TABLE "service_providers" DROP CONSTRAINT "service_providers_userId_fkey";

-- DropForeignKey
ALTER TABLE "service_reviews" DROP CONSTRAINT "service_reviews_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "service_reviews" DROP CONSTRAINT "service_reviews_travelerId_fkey";

-- DropForeignKey
ALTER TABLE "travelers" DROP CONSTRAINT "travelers_userId_fkey";

-- AlterTable
CREATE SEQUENCE property_occupations_id_seq;
ALTER TABLE "property_occupations" ALTER COLUMN "id" SET DEFAULT nextval('property_occupations_id_seq');
ALTER SEQUENCE property_occupations_id_seq OWNED BY "property_occupations"."id";

-- AlterTable
CREATE SEQUENCE property_reservations_id_seq;
ALTER TABLE "property_reservations" DROP COLUMN "traverlerId",
ADD COLUMN     "travelerId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('property_reservations_id_seq');
ALTER SEQUENCE property_reservations_id_seq OWNED BY "property_reservations"."id";

-- AlterTable
ALTER TABLE "property_reviews" DROP COLUMN "status",
ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "service_reviews" ADD COLUMN     "comment" TEXT NOT NULL,
ALTER COLUMN "travelerId" DROP NOT NULL,
ALTER COLUMN "landlordId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "landlords" ADD CONSTRAINT "landlords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_reservations" ADD CONSTRAINT "property_reservations_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "travelers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travelers" ADD CONSTRAINT "travelers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_reviews" ADD CONSTRAINT "service_reviews_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "travelers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_reviews" ADD CONSTRAINT "service_reviews_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "landlords"("id") ON DELETE SET NULL ON UPDATE CASCADE;
