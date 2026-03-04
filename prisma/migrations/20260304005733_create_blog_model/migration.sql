-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "nama" TEXT,
    "idUser" TEXT,
    "idKelas" TEXT,
    "idMapel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_link_key" ON "Blog"("link");

-- CreateIndex
CREATE INDEX "Blog_idUser_idKelas_idMapel_nama_idx" ON "Blog"("idUser", "idKelas", "idMapel", "nama");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_idMapel_fkey" FOREIGN KEY ("idMapel") REFERENCES "Mapel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
