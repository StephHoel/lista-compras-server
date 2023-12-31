-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "qtd" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "idOauth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_idOauth_fkey" FOREIGN KEY ("idOauth") REFERENCES "User"("idOauth") ON DELETE RESTRICT ON UPDATE CASCADE;
