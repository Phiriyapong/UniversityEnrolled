/*
  Warnings:

  - The values [Thr,Fir] on the enum `section_time_date` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `section_time` MODIFY `date` ENUM('Mon', 'Tue', 'Web', 'Thu', 'Fri') NOT NULL;
