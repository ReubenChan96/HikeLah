-- CreateTable
CREATE TABLE "Trail" (
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

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("id")
);
