/*
  Warnings:

  - You are about to drop the `Trail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Trail";

-- CreateTable
CREATE TABLE "trails" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trailType" TEXT NOT NULL,
    "description" TEXT,
    "length" DOUBLE PRECISION NOT NULL,
    "casualWalk" BOOLEAN NOT NULL,
    "forestedTrail" BOOLEAN NOT NULL,
    "floraFaunaSpotting" BOOLEAN NOT NULL,
    "wildlifeSpotting" BOOLEAN NOT NULL,
    "north" BOOLEAN NOT NULL,
    "south" BOOLEAN NOT NULL,
    "east" BOOLEAN NOT NULL,
    "west" BOOLEAN NOT NULL,
    "central" BOOLEAN NOT NULL,

    CONSTRAINT "trails_pkey" PRIMARY KEY ("id")
);
