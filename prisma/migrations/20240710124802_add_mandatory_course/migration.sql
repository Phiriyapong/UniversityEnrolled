-- CreateTable
CREATE TABLE `mandatory_course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `major_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,

    UNIQUE INDEX `mandatory_course_major_id_course_id_key`(`major_id`, `course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `current_semester` ADD CONSTRAINT `current_semester_semester_year_id_fkey` FOREIGN KEY (`semester_year_id`) REFERENCES `semester_year`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mandatory_course` ADD CONSTRAINT `mandatory_course_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mandatory_course` ADD CONSTRAINT `mandatory_course_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
