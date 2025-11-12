-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "pixKey" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'sepolia',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
