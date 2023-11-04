/*
  Warnings:

  - You are about to drop the column `idUser` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the `UserData` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Login` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Login` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Login" DROP CONSTRAINT "Login_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_idAuthor_fkey";

-- AlterTable
ALTER TABLE "Login" DROP COLUMN "idUser",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserData";

-- CreateIndex
CREATE UNIQUE INDEX "Login_email_key" ON "Login"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_idAuthor_fkey" FOREIGN KEY ("idAuthor") REFERENCES "Login"("idLogin") ON DELETE RESTRICT ON UPDATE CASCADE;
