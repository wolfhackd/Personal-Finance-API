import { type PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../infra/database.js";
import type { Transaction } from "../../infra/models/transaction.js";
import { TransactionType as PrismaTransactionType } from "../../generated/prisma/client.js";

export class TransactionRepository {
  constructor(private readonly database: PrismaClient = prisma) {}

  findTransactionsByUserId(userId: string) {
    return this.database.transaction.findMany({ where: { userId } });
  }

  findTransactionById(id: string) {
    return this.database.transaction.findUnique({ where: { id } });
  }

  createTransaction(transaction: Transaction) {
    return this.database.transaction.create({
      data: {
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        userId: transaction.userId,
        type: transaction.type as PrismaTransactionType,
      },
    });
  }
}
