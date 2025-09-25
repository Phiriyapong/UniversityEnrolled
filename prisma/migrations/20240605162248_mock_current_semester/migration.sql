-- CreateTable
CREATE TABLE `current_semester` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `semester_year_id` INTEGER NOT NULL,

    INDEX `current_semester_semester_year_id_idx`(`semester_year_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
