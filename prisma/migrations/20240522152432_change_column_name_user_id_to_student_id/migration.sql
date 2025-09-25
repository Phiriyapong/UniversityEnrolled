/*
  Warnings:

  - You are about to drop the column `user_id` on the `course_student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `course_student` DROP FOREIGN KEY `course_student_user_id_fkey`;

-- AlterTable
ALTER TABLE `course_student` DROP COLUMN `user_id`,
    MODIFY `student_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `course_student_user_id_fkey` ON `course_student`(`student_id`);

-- AddForeignKey
ALTER TABLE `course_student` ADD CONSTRAINT `course_student_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
