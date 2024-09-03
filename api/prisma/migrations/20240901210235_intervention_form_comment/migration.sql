/*
  Warnings:

  - Added the required column `comment` to the `intervention_forms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "intervention_forms" ADD COLUMN     "comment" TEXT NOT NULL;
