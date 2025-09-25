/*
  Warnings:

  - You are about to drop the column `condition_course_id` on the `course` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `section_course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` DROP COLUMN `condition_course_id`;

-- AlterTable
ALTER TABLE `section_course` ADD COLUMN `course_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `course_condition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `prerequisite_id` INTEGER NOT NULL,

    UNIQUE INDEX `course_condition_course_id_prerequisite_id_key`(`course_id`, `prerequisite_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `section_course_course_id_fkey` ON `section_course`(`course_id`);

-- AddForeignKey
ALTER TABLE `course_condition` ADD CONSTRAINT `course_condition_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_condition` ADD CONSTRAINT `course_condition_prerequisite_id_fkey` FOREIGN KEY (`prerequisite_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `section_course` ADD CONSTRAINT `section_course_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
