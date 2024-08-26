/*
  Warnings:

  - Added the required column `stripePriceIdMonthly` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePriceIdYearly` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeProductId` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "stripePriceIdMonthly" TEXT NOT NULL,
ADD COLUMN     "stripePriceIdYearly" TEXT NOT NULL,
ADD COLUMN     "stripeProductId" TEXT NOT NULL;
