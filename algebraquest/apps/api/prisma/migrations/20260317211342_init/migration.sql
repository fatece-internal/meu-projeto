-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_entries" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "livesLeft" INTEGER NOT NULL,
    "questionsAnswered" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomId_key" ON "rooms"("roomId");

-- CreateIndex
CREATE INDEX "rooms_roomId_idx" ON "rooms"("roomId");

-- CreateIndex
CREATE INDEX "leaderboard_entries_roomId_score_idx" ON "leaderboard_entries"("roomId", "score" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_entries_roomId_playerId_key" ON "leaderboard_entries"("roomId", "playerId");

-- AddForeignKey
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;
