import { type PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../infra/database.js";
import type { Transaction } from "../../infra/models/transaction.js";
import { TransactionType as PrismaTransactionType } from "../../generated/prisma/client.js";
import type { ITransactionFilter } from "./transaction.types.js";

export class TransactionRepository {
  constructor(private readonly database: PrismaClient = prisma) {}

  //Tenho que arrumar a questão da data se so for passada uma data pesquisar so naquela data
  //se for passada uma data inicial e uma data final pesquisar no intervalo

  findTransactionsByUserId(userId: string, filters?: ITransactionFilter) {
    const { date, endDate } = filters ?? {};

    let where: any = { userId };

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(endDate ?? date);
      end.setUTCHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    }

    console.log("Filtro final:", where.date);

    return prisma.transaction.findMany({ where });
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
