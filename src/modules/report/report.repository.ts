import type { PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../infra/database.js";
import { TransactionType as PrismaTransactionType } from "../../generated/prisma/client.js";


export class ReportRepository {
    constructor(private readonly database: PrismaClient = prisma) {}

    async getMonthlyReport(id: string) {

        const lastTransaction = await this.database.transaction.findFirst({
        where: { userId: id },
        orderBy: { date: 'desc' },
        select: { date: true }
    });

    if (!lastTransaction) return [];

    const lastDate = lastTransaction.date;

    const startDate = new Date(lastDate.getFullYear(), lastDate.getMonth() - 10, 1);

    
    const data = await this.database.transaction.findMany({
        where: {
            userId: id,
            date: {
                gte: startDate,
                lte: lastDate 
            },
            type: PrismaTransactionType.EXPENSE
        },
        orderBy: {
            date: 'desc'
        }
    });

    return data;
    }
    
}