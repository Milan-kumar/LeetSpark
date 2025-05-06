-- CreateTable
CREATE TABLE "Submisson" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "sourceCode" JSONB NOT NULL,
    "language" TEXT NOT NULL,
    "stdin" TEXT,
    "stdout" TEXT,
    "stderr" TEXT,
    "compileOutput" TEXT,
    "status" TEXT NOT NULL,
    "memory" TEXT,
    "time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submisson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testCaseResult" (
    "id" TEXT NOT NULL,
    "submissonId" TEXT NOT NULL,
    "testCase" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "stdout" TEXT,
    "expected" TEXT NOT NULL,
    "stderror" TEXT,
    "compileOutput" TEXT,
    "status" TEXT NOT NULL,
    "memory" TEXT,
    "time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updaytedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testCaseResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemSolved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemSolved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "testCaseResult_submissonId_idx" ON "testCaseResult"("submissonId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemSolved_userId_problemId_key" ON "ProblemSolved"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "Submisson" ADD CONSTRAINT "Submisson_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submisson" ADD CONSTRAINT "Submisson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testCaseResult" ADD CONSTRAINT "testCaseResult_submissonId_fkey" FOREIGN KEY ("submissonId") REFERENCES "Submisson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSolved" ADD CONSTRAINT "ProblemSolved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSolved" ADD CONSTRAINT "ProblemSolved_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
