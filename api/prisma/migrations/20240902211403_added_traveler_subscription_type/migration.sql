-- CreateEnum
CREATE TYPE "TravelerSubscription" AS ENUM ('FREE', 'BAG_PACKER', 'EXPLORATOR');

-- AlterTable
ALTER TABLE "travelers" ADD COLUMN     "subscriptionType" "TravelerSubscription" NOT NULL DEFAULT 'FREE';
