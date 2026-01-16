/*
  Warnings:

  - The values [REPORT,SYSTEM_SETTINGS] on the enum `Permission_module` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `permission` MODIFY `module` ENUM('DASHBOARD', 'BUDGET_PREPARATION', 'PROCUREMENT', 'DATA_SETUP', 'PROGRAMS_MANAGEMENT', 'USER_MANAGEMENT', 'ROLES_PERMISSION') NULL;
