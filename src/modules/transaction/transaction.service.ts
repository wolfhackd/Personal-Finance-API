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
    //   ): Promise<Transaction> => {
  ) => {
    const user = await this.userRepository.findUserById(transactionData.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const transaction = Transaction.create(transactionData);

    const newTransaction =
      await this.transactionRepository.createTransaction(transaction);

    // const persistedTransaction = Transaction.restore(newTransaction);

    // return persistedTransaction;

    return newTransaction;
  };

  getTransactions = async (userId: string) => {
    return this.transactionRepository.findTransactionsByUserId(userId);
  };
}
