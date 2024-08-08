/*
  Warnings:

  - You are about to drop the column `bannedUntil` on the `refresh_token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "refresh_token" DROP COLUMN "bannedUntil";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bannedUntil" TIMESTAMP(3);
