-- CreateTable
CREATE TABLE `BudgetClassificationLimit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `budgetId` INTEGER NOT NULL,
    `classificationId` INTEGER NOT NULL,
    `limitAmount` DECIMAL(15, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BudgetClassificationLimit_budgetId_classificationId_key`(`budgetId`, `classificationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BudgetClassificationLimit` ADD CONSTRAINT `BudgetClassificationLimit_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `Budget`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetClassificationLimit` ADD CONSTRAINT `BudgetClassificationLimit_classificationId_fkey` FOREIGN KEY (`classificationId`) REFERENCES `BudgetClassification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
