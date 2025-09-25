/*
  Warnings:

  - Added the required column `teacher_id` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `teacher_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `course_teacher_id_fkey` ON `course`(`teacher_id`);

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
