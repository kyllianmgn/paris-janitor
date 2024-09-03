-- CreateEnum
CREATE TYPE "LandlordStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAST_DUE', 'CANCELED');

-- AlterTable
ALTER TABLE "landlords" ADD COLUMN     "status" "LandlordStatus" NOT NULL DEFAULT 'PENDING';
