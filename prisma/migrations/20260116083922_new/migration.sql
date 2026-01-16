/*
  Warnings:

  - A unique constraint covering the columns `[fiscalYearId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Budget_fiscalYearId_key` ON `Budget`(`fiscalYearId`);
