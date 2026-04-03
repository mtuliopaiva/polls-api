-- CreateTable
CREATE TABLE "Role" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Permission" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userUuid" TEXT NOT NULL,
    "roleUuid" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userUuid","roleUuid")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleUuid" TEXT NOT NULL,
    "permissionUuid" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleUuid","permissionUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "UserRole_roleUuid_idx" ON "UserRole"("roleUuid");

-- CreateIndex
CREATE INDEX "RolePermission_permissionUuid_idx" ON "RolePermission"("permissionUuid");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleUuid_fkey" FOREIGN KEY ("roleUuid") REFERENCES "Role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleUuid_fkey" FOREIGN KEY ("roleUuid") REFERENCES "Role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionUuid_fkey" FOREIGN KEY ("permissionUuid") REFERENCES "Permission"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
