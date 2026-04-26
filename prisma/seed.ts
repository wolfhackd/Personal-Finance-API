import { TransactionType as PrismaTransactionType } from "../src/generated/prisma/client";

import { prisma } from "../src/infra/database.js";

async function main() {
  const USER_ID = "965371d1-f96c-4831-8879-ae7c18de6d4b";

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
      category: "Salário",
      date: new Date("2024-03-01"),
      userId: USER_ID,
    },
    {
      title: "Projeto Freelance App",
      amount: 5500.0,
      type: PrismaTransactionType.INCOME,
      category: "Lucros",
      date: new Date("2024-03-15"),
      userId: USER_ID,
    },
    {
      title: "Dividendos Ações",
      amount: 850.5,
      type: PrismaTransactionType.INCOME,
      category: "Lucros",
      date: new Date("2024-03-20"),
      userId: USER_ID,
    },

    // --- SAÍDAS (EXPENSE) ---
    {
      title: "Aluguel Apartamento",
      amount: 3200.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Contas",
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
      category: "Compras",
      date: new Date("2024-03-12"),
      userId: USER_ID,
    },
    {
      title: "Jantar Restaurante",
      amount: 280.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Alimentação",
      date: new Date("2024-03-22"),
      userId: USER_ID,
    },

    // Parte 2

    // --- ENTRADAS (INCOME) ---
    {
      title: "Salário Mensal",
      amount: 12000.0,
      type: PrismaTransactionType.INCOME,
      category: "Salário",
      date: new Date("2024-04-01"),
      userId: USER_ID,
    },
    {
      title: "Projeto Freelance App",
      amount: 5500.0,
      type: PrismaTransactionType.INCOME,
      category: "Lucros",
      date: new Date("2024-04-15"),
      userId: USER_ID,
    },
    {
      title: "Dividendos Ações",
      amount: 850.5,
      type: PrismaTransactionType.INCOME,
      category: "Lucros",
      date: new Date("2024-04-20"),
      userId: USER_ID,
    },

    // --- SAÍDAS (EXPENSE) ---
    {
      title: "Aluguel Apartamento",
      amount: 3200.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Contas",
      date: new Date("2024-04-05"),
      userId: USER_ID,
    },
    {
      title: "Supermercado Mensal",
      amount: 1850.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Alimentação",
      date: new Date("2024-04-10"),
      userId: USER_ID,
    },
    {
      title: "Supermercado",
      amount: 100.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Alimentação",
      date: new Date("2024-04-10"),
      userId: USER_ID,
    },
    {
      title: "Assinatura AWS / Cloud",
      amount: 450.25,
      type: PrismaTransactionType.EXPENSE,
      category: "Compras",
      date: new Date("2024-04-12"),
      userId: USER_ID,
    },
    {
      title: "Jantar Restaurante",
      amount: 280.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Alimentação",
      date: new Date("2024-04-22"),
      userId: USER_ID,
    },

    // Parte 3

    // --- ENTRADAS (INCOME) ---
    {
      title: "Salário Mensal",
      amount: 12000.0,
      type: PrismaTransactionType.INCOME,
      category: "Salário",
      date: new Date("2024-05-01"),
      userId: USER_ID,
    },
    {
      title: "Projeto Freelance App",
      amount: 5500.0,
      type: PrismaTransactionType.INCOME,
      category: "Lucros",
      date: new Date("2024-05-15"),
      userId: USER_ID,
    },
    {
      title: "Dividendos Ações",
      amount: 850.5,
      type: PrismaTransactionType.INCOME,
      category: "Lucros",
      date: new Date("2024-05-20"),
      userId: USER_ID,
    },

    // --- SAÍDAS (EXPENSE) ---
    {
      title: "Aluguel Apartamento",
      amount: 3200.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Contas",
      date: new Date("2024-05-05"),
      userId: USER_ID,
    },
    {
      title: "Supermercado Mensal",
      amount: 1850.0,
      type: PrismaTransactionType.EXPENSE,
      category: "Alimentação",
      date: new Date("2024-05-10"),
      userId: USER_ID,
    },
    {
      title: "Assinatura AWS / Cloud",
      amount: 450.25,
      type: PrismaTransactionType.EXPENSE,
      category: "Compras",
      date: new Date("2024-05-12"),
      userId: USER_ID,
    }
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
  