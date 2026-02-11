import type { FastifyRequest, FastifyReply } from "fastify";
import {
  transactionCreateInput,
  type ITransactionCreate,
} from "./transaction.types.js";
import type { TransactionService } from "./transaction.service.js";

export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  createTransaction = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return reply.status(401).send({ message: "User not authenticated" });
      }
      const validatedData = transactionCreateInput.parse({
        ...(req.body as object),
        userId,
      });

      const transaction = await this.service.createTransaction(validatedData);

      if (!transaction) {
        return reply.status(400).send({ message: "Transaction not created" });
      }

      return reply.status(200).send({ message: "Transaction created" });
    } catch (e: any) {
      console.log(e.message);
      return reply.status(400).send({ message: e.message });
    }
  };
}
