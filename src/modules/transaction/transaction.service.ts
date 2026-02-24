import { Transaction } from "../../infra/models/transaction.js";
import type { UserRepository } from "../user/user.repository.js";
import type { TransactionRepository } from "./transaction.repository.js";
import type { ITransactionCreate } from "./transaction.types.js";

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  createTransaction = async (
    transactionData: ITransactionCreate,
  ): Promise<Transaction> => {
    const user = await this.userRepository.findUserById(transactionData.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const transaction = Transaction.create(transactionData);

    const newTransaction =
      await this.transactionRepository.createTransaction(transaction);

    const persistedTransaction = Transaction.restore(newTransaction);

    return persistedTransaction;
  };

  getTransactions = async (userId: string) => {
    return this.transactionRepository.findTransactionsByUserId(userId);
  };

  getTransactionById = async (id: string, userId: string) => {
    const transaction =
      await this.transactionRepository.findTransactionById(id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new Error("Not allowed");
    }
    return this.transactionRepository.findTransactionById(id);
  };

  balance = async (userId: string) => {
    const transactions =
      await this.transactionRepository.findTransactionsByUserId(userId);
    const balance = transactions.reduce((acc, transaction) => {
      if (transaction.type === "INCOME") {
        return acc + transaction.amount;
      }
      return acc - transaction.amount;
    }, 0);
    return balance;
  };
}
