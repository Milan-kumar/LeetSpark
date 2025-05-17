/*
  Warnings:

  - You are about to drop the column `desciption` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT;
