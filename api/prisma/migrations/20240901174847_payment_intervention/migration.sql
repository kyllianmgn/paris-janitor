-- CreateTable
CREATE TABLE "payments_intervention" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeSessionId" TEXT,
    "interventionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_intervention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_intervention_interventionId_key" ON "payments_intervention"("interventionId");

-- AddForeignKey
ALTER TABLE "payments_intervention" ADD CONSTRAINT "payments_intervention_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "interventions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
