import type { FastifyRequest, FastifyReply } from "fastify";
import {
  GetTransactionsQueryParamsInput,
  transactionCreateInput,
  type GetTransactionsQueryParams,
} from "./transaction.types.js";
import type { TransactionService } from "./transaction.service.js";

export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  createTransaction = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.user?.id;

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

  getTransactions = async (
    req: FastifyRequest<{ Querystring: GetTransactionsQueryParams }>,
    reply: FastifyReply,
  ) => {
    try {
      const filters = GetTransactionsQueryParamsInput.parse(req.query);

      const userId = req.user!.id;
      const transactions = await this.service.getTransactions(userId, filters);
      return reply.status(200).send(transactions);
    } catch (e: any) {
      console.log(e.message);
      return reply.status(400).send({ message: e.message });
    }
  };

  getTransactionById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    try {
      const userId = req.user!.id;

      const transactionId = req.params.id;
      const transaction = await this.service.getTransactionById(
        transactionId,
        userId,
      );

      return reply.status(200).send(transaction);
    } catch (e: any) {
      console.log(e.message);
      return reply.status(400).send({ message: e.message });
    }
  };

  balance = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.user!.id;
      const balance = await this.service.balance(userId);
      return reply.status(200).send(balance);
    } catch (e: any) {
      console.log(e.message);
      return reply.status(400).send({ message: e.message });
    }
  };
}
