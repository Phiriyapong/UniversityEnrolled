/*
  Warnings:

  - You are about to drop the column `userId` on the `teacher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `teacher_userId_fkey`;

-- AlterTable
ALTER TABLE `teacher` DROP COLUMN `userId`;
