-- DropForeignKey
ALTER TABLE "property_reservations" DROP CONSTRAINT "property_reservations_occupationId_fkey";

-- AddForeignKey
ALTER TABLE "property_reservations" ADD CONSTRAINT "property_reservations_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "property_occupations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
