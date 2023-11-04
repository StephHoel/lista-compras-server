-- CreateEnum
CREATE TYPE "State" AS ENUM ('DRAFT', 'POST', 'DELETE');

-- CreateTable
CREATE TABLE "UserData" (
    "idUser" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Login" (
    "idLogin" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("idLogin")
);

-- CreateTable
CREATE TABLE "Post" (
    "idBlog" TEXT NOT NULL,
    "idAuthor" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "state" "State" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("idBlog")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_email_key" ON "UserData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Login_username_key" ON "Login"("username");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "UserData"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_idAuthor_fkey" FOREIGN KEY ("idAuthor") REFERENCES "UserData"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
