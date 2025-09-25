/*
  Warnings:

  - You are about to drop the `major_course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `major_course` DROP FOREIGN KEY `major_course_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `major_course` DROP FOREIGN KEY `major_course_majorId_fkey`;

-- DropTable
DROP TABLE `major_course`;
