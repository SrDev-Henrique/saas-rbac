/*
  Warnings:

  - Added the required column `invited_name` to the `invites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."invites" ADD COLUMN     "invited_name" TEXT NOT NULL;