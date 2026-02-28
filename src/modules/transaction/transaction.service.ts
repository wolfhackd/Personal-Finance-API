import { Transaction } from "../../infra/models/transaction.js";
import { Base64PdfGenerator } from "../../infra/providers/puppeteer-pdf.service.js";
import type { UserRepository } from "../user/user.repository.js";
import type { TransactionRepository } from "./transaction.repository.js";
import type {
  ITransactionCreate,
  ITransactionFilter,
} from "./transaction.types.js";

const dadosTeste: any = {
  mes: "Março 2024",
  lucros: 54250.0,
  despesas: 31180.5,
  itens: [
    // --- ENTRADAS (LUCROS) ---
    {
      descricao: "Mensalidades SaaS (Plano Pro)",
      valor: 32500.0,
      tipo: "lucro",
    },
    {
      descricao: "Consultoria Implementação API",
      valor: 12000.0,
      tipo: "lucro",
    },
    { descricao: "Venda de Licenças Adicionais", valor: 5750.0, tipo: "lucro" },
    { descricao: "Suporte Técnico Premium", valor: 4000.0, tipo: "lucro" },

    // --- SAÍDAS (DESPESAS FIXAS) ---
    {
      descricao: "Folha de Pagamento (Time Dev)",
      valor: 18500.0,
      tipo: "despesa",
    },
    {
      descricao: "Aluguel Escritório / Coworking",
      valor: 3200.0,
      tipo: "despesa",
    },
    { descricao: "Assinatura Adobe/JetBrains", valor: 450.0, tipo: "despesa" },
    { descricao: "Contabilidade Mensal", valor: 800.0, tipo: "despesa" },

    // --- SAÍDAS (DESPESAS VARIÁVEIS / INFRA) ---
    {
      descricao: "Infraestrutura AWS (Produção)",
      valor: 4250.5,
      tipo: "despesa",
    },
    { descricao: "Google Ads (Tráfego Pago)", valor: 2500.0, tipo: "despesa" },
    {
      descricao: "Taxas de Processamento (Stripe)",
      valor: 1480.0,
      tipo: "despesa",
    },
  ],
};

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

  //Chamo o repository pra pedir as informações que eu preciso
  //Chamo o service pra calcular o que eu preciso
  //e por fim chamo o meu service de geração de pdf base64
  //retorno isso para o controller
  //e depois tenho que interpretar o pdf no front end

  //Regras de negocio
  //Só funciona no mês a mês (Por enquanto)
  //Devo receber uma data inicial do front end

  //Obs: eu deveria fazer um para apenas retornar as informações separadas tbm

  report = async (userId: string) => {
    // return this.transactionRepository.findTransactionsByUserId(userId);
    // return "teste funcionando";
    return Base64PdfGenerator(dadosTeste);
  };
}
