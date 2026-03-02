import { TransactionType as PrismaTransactionType } from "../src/generated/prisma/client";

import { prisma } from "../src/infra/database.js";

async function main() {
  const USER_ID = "e43c42bf-10e3-46f9-900d-547df0cb1c7c";

  console.log("🚀 Iniciando Seed de Transações...");

  // Limpa transações antigas deste usuário para não duplicar no teste
  await prisma.transaction.deleteMany({
    where: { userId: USER_ID },
  });

  const transactions = [
    // --- ENTRADAS (INCOME) ---
    {
      title: "Salário Mensal",
      amount: 12000.0,
      type: PrismaTransactionType.INCOME,
      category: "Trabalho",
      date: new Date("2024-03-01"),
      userId: USER_ID,
    },
    {
      title: "Projeto Freelance App",
      amount: 5500.0,
      type: PrismaTransactionType.INCOME,
      category: "Freelance",
      date: new Date("2024-03-15"),
      userId: USER_ID,
    },
    {
      title: "Dividendos Ações",
      amount: 850.5,
      type: PrismaTransactionType.INCOME,
      category: "Investimentos",
      date: new Date("2024-03-20"),
      userId: USER_ID,
    },

    // --- SAÍDAS (EXPENSE) ---
    {
      title: "Aluguel Apartamento",
      amount: 3200.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Moradia",
      date: new Date("2024-03-05"),
      userId: USER_ID,
    },
    {
      title: "Supermercado Mensal",
      amount: 1850.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Alimentação",
      date: new Date("2024-03-10"),
      userId: USER_ID,
    },
    {
      title: "Assinatura AWS / Cloud",
      amount: 450.25,
      type: PrismaTransactionType.EXPENSE,
      category: "Tecnologia",
      date: new Date("2024-03-12"),
      userId: USER_ID,
    },
    {
      title: "Jantar Restaurante",
      amount: 280.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Lazer",
      date: new Date("2024-03-22"),
      userId: USER_ID,
    },
  ];

  // Insere todas de uma vez
  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log(
    `✅ ${transactions.length} transações criadas para o usuário: ${USER_ID}`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Erro no Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
