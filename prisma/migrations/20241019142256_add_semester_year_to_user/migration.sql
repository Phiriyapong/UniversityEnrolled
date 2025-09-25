-- AlterTable
ALTER TABLE `user` ADD COLUMN `semester_year_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `user_semester_year_id_fkey` ON `user`(`semester_year_id`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_semester_year_id_fkey` FOREIGN KEY (`semester_year_id`) REFERENCES `semester_year`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
