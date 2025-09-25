-- DropForeignKey
ALTER TABLE `course` DROP FOREIGN KEY `course_teacher_id_fkey`;

-- AlterTable
ALTER TABLE `course` MODIFY `teacher_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `section_course` ADD COLUMN `teacher_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `teacher` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `department_id` INTEGER NOT NULL,

    UNIQUE INDEX `teacher_email_key`(`email`),
    UNIQUE INDEX `teacher_code_key`(`code`),
    INDEX `teacher_department_id_fkey`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `section_course_teacher_id_fkey` ON `section_course`(`teacher_id`);

-- AddForeignKey
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `section_course` ADD CONSTRAINT `section_course_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
