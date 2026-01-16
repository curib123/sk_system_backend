/*
  Warnings:

  - Added the required column `totalPrice` to the `ProcurementItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `procurementitem` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `totalPrice` DECIMAL(15, 2) NOT NULL;
