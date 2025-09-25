-- CreateTable
CREATE TABLE `major_course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `majorId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `mandatory` BOOLEAN NOT NULL,

    INDEX `major_course_majorId_idx`(`majorId`),
    INDEX `major_course_courseId_idx`(`courseId`),
    UNIQUE INDEX `major_course_majorId_courseId_key`(`majorId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `major_course` ADD CONSTRAINT `major_course_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `major_course` ADD CONSTRAINT `major_course_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
