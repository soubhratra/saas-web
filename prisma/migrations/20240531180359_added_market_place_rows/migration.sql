/*
  Warnings:

  - A unique constraint covering the columns `[connectedAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CategoryTypes" AS ENUM ('template', 'uikit', 'icon');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "connectedAccountId" TEXT,
ADD COLUMN     "stripeConnectedLinked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "smallDescription" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "images" TEXT[],
    "productFile" TEXT NOT NULL,
    "category" "CategoryTypes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_connectedAccountId_key" ON "User"("connectedAccountId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
