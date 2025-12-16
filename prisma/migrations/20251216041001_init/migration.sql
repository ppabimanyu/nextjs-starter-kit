-- CreateTable
CREATE TABLE "t_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "twoFactorEnabled" BOOLEAN DEFAULT false,

    CONSTRAINT "t_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "t_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_accounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_two_factors" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "t_two_factors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_users_email_key" ON "t_users"("email");

-- CreateIndex
CREATE INDEX "t_sessions_userId_idx" ON "t_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "t_sessions_token_key" ON "t_sessions"("token");

-- CreateIndex
CREATE INDEX "t_accounts_userId_idx" ON "t_accounts"("userId");

-- CreateIndex
CREATE INDEX "t_verifications_identifier_idx" ON "t_verifications"("identifier");

-- CreateIndex
CREATE INDEX "t_two_factors_secret_idx" ON "t_two_factors"("secret");

-- CreateIndex
CREATE INDEX "t_two_factors_userId_idx" ON "t_two_factors"("userId");

-- AddForeignKey
ALTER TABLE "t_sessions" ADD CONSTRAINT "t_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "t_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_accounts" ADD CONSTRAINT "t_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "t_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_two_factors" ADD CONSTRAINT "t_two_factors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "t_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
