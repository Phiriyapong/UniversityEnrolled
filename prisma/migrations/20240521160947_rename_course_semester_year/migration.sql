/*
  Warnings:

  - You are about to drop the `_courseTosemester_year` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_courseTosemester_year` DROP FOREIGN KEY `_courseTosemester_year_A_fkey`;

-- DropForeignKey
ALTER TABLE `_courseTosemester_year` DROP FOREIGN KEY `_courseTosemester_year_B_fkey`;

-- DropTable
DROP TABLE `_courseTosemester_year`;

-- CreateTable
CREATE TABLE `_course_semester_year` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_course_semester_year_AB_unique`(`A`, `B`),
    INDEX `_course_semester_year_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_course_semester_year` ADD CONSTRAINT `_course_semester_year_A_fkey` FOREIGN KEY (`A`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_course_semester_year` ADD CONSTRAINT `_course_semester_year_B_fkey` FOREIGN KEY (`B`) REFERENCES `semester_year`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
