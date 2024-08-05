-- CreateEnum
CREATE TYPE "ServiceProviderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REFUSED');

-- AlterTable
ALTER TABLE "service_providers" ADD COLUMN     "status" "ServiceProviderStatus" NOT NULL DEFAULT 'PENDING';
