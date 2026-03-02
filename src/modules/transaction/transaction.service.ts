import { Transaction } from "../../infra/models/transaction.js";
import { Base64PdfGenerator } from "../../infra/providers/puppeteer-pdf.service.js";
import type { UserRepository } from "../user/user.repository.js";
import type { TransactionRepository } from "./transaction.repository.js";
import type {
  ITransactionCreate,
  ITransactionFilter,
} from "./transaction.types.js";

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

  getTransactions = async (userId: string, filters?: ITransactionFilter) => {
    return this.transactionRepository.findTransactionsByUserId(userId, filters);
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

  //e depois tenho que interpretar o pdf no front end

  //Regras de negocio
  //Só funciona no mês a mês (Por enquanto)

  //Obs: eu deveria fazer um para apenas retornar as informações separadas tbm

  report = async (userId: string, month: number, year: number) => {
    console.log(month);
    //esse cara pode receber uma data também
    const data =
      await this.transactionRepository.findTransactionsByUserId(userId);

    const totals = data.reduce(
      (acc, d) => {
        if (d.type === "EXPENSE") acc.expenses += d.amount;
        if (d.type === "INCOME") acc.incomes += d.amount;
        return acc;
      },
      { expenses: 0, incomes: 0 },
    );

    const dadosTeste = {
      month,
      ...totals,
      itens: data.map((d) => ({
        title: d.title,
        amount: d.amount,
        type: d.type as "EXPENSE" | "INCOME",
      })),
    };
    //tenho que da um clear nessa função
    //Tenho que realizar uma abstração de dados pra se ajustar ao que eu preciso
    return Base64PdfGenerator(dadosTeste);

    // return date;
  };
}
