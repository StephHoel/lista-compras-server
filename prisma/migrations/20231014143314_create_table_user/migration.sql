-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "idOauth" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_idOauth_key" ON "User"("idOauth");
