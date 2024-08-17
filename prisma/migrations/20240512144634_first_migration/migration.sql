/*
  Warnings:

  - You are about to drop the column `invterval` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `colorScheme` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `interval` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `given_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin', 'Support');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Pending', 'Active', 'Inactive', 'Password_Reset_Required');

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "invterval",
ADD COLUMN     "interval" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "colorScheme",
DROP COLUMN "name",
ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "family_name" TEXT NOT NULL,
ADD COLUMN     "given_name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userRole" "UserRole" NOT NULL DEFAULT 'User';

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "AppConfig" (
    "id" TEXT NOT NULL,
    "maxActiveUser" INTEGER NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);
