/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idBlog` on the `Post` table. All the data in the column will be lost.
  - The required column `idPost` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "idBlog",
ADD COLUMN     "idPost" TEXT NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("idPost");
