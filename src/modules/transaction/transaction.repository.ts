import {
  TransactionType,
  type PrismaClient,
} from "../../generated/prisma/client.js";
import { prisma } from "../../infra/database.js";
import type { Transaction } from "../../infra/models/transaction.js";

export class TransactionRepository {
  constructor(private readonly database: PrismaClient = prisma) {}

  findTransactionsByUserId(userId: string) {
    return this.database.transaction.findMany({ where: { userId } });
  }

  createTransaction(transaction: Transaction) {
    return this.database.transaction.create({ data: transaction });
  }
}
