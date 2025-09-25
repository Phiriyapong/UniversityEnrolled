/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `userId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `teacher_userId_key` ON `teacher`(`userId`);

-- CreateIndex
CREATE INDEX `teacher_userId_fkey` ON `teacher`(`userId`);

-- AddForeignKey
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
