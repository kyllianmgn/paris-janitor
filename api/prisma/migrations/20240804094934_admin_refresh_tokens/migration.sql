-- CreateTable
CREATE TABLE "admin_refresh_token" (
    "id" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_refresh_token_id_key" ON "admin_refresh_token"("id");

-- CreateIndex
CREATE INDEX "refreshToken_adminId_fkey" ON "admin_refresh_token"("adminId");

-- AddForeignKey
ALTER TABLE "admin_refresh_token" ADD CONSTRAINT "admin_refresh_token_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
