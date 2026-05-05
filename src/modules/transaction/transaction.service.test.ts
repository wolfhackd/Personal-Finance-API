import { describe, it, expect, vi, beforeEach } from "vitest";
import { TransactionType } from "./transaction.types.js";
import type { TransactionRepository } from "./transaction.repository.js";
import type { UserRepository } from "../user/user.repository.js";
import { TransactionService } from "./transaction.service.js";

const txRow = (partial: {
  amount: number;
  type: "INCOME" | "EXPENSE";
  userId?: string;
}) => ({
  id: "tx-1",
  title: "t",
  category: "c",
  date: new Date(),
  createdAt: new Date(),
  userId: partial.userId ?? "user-1",
  ...partial,
});

describe("TransactionService", () => {
  const transactionRepository: Pick<
    TransactionRepository,
    "findTransactionsByUserId" | "findTransactionById" | "createTransaction"
  > = {
    findTransactionsByUserId: vi.fn(),
    findTransactionById: vi.fn(),
    createTransaction: vi.fn(),
  };

  const userRepository: Pick<UserRepository, "findUserById"> = {
    findUserById: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("balance soma INCOME e subtrai EXPENSE", async () => {
    vi.mocked(transactionRepository.findTransactionsByUserId).mockResolvedValue([
      txRow({ amount: 100, type: "INCOME" }),
      txRow({ amount: 30, type: "EXPENSE" }),
      txRow({ amount: 20, type: "INCOME" }),
    ]);

    const service = new TransactionService(
      transactionRepository as TransactionRepository,
      userRepository as UserRepository,
    );
    const balance = await service.balance("user-1");

    expect(balance).toBe(90);
  });

  it("createTransaction persiste quando o usuário existe", async () => {
    vi.mocked(userRepository.findUserById).mockResolvedValue({
      id: "user-1",
      name: "U",
      email: "u@test.com",
      password: "p",
      createdAt: new Date(),
    });

    const created = {
      id: "new-tx",
      title: "Compra",
      amount: 50,
      type: "EXPENSE" as const,
      category: "Food",
      date: new Date(),
      createdAt: new Date(),
      userId: "user-1",
    };

    vi.mocked(transactionRepository.createTransaction).mockResolvedValue(created as never);

    const service = new TransactionService(
      transactionRepository as TransactionRepository,
      userRepository as UserRepository,
    );

    const result = await service.createTransaction({
      title: "Compra",
      amount: 50,
      type: TransactionType.EXPENSE,
      category: "Food",
      date: new Date(),
      userId: "user-1",
    });

    expect(result.title).toBe("Compra");
    expect(transactionRepository.createTransaction).toHaveBeenCalledTimes(1);
  });

  it("createTransaction lança quando o usuário não existe", async () => {
    vi.mocked(userRepository.findUserById).mockResolvedValue(null);

    const service = new TransactionService(
      transactionRepository as TransactionRepository,
      userRepository as UserRepository,
    );

    await expect(
      service.createTransaction({
        title: "x",
        amount: 1,
        type: TransactionType.INCOME,
        category: "cat",
        date: new Date(),
        userId: "missing",
      }),
    ).rejects.toThrow("User not found");
  });

  it("getTransactionById lança quando a transação não existe", async () => {
    vi.mocked(transactionRepository.findTransactionById).mockResolvedValue(null);

    const service = new TransactionService(
      transactionRepository as TransactionRepository,
      userRepository as UserRepository,
    );

    await expect(service.getTransactionById("tid", "uid")).rejects.toThrow("Transaction not found");
  });

  it("getTransactionById lança quando o recurso pertence a outro usuário", async () => {
    vi.mocked(transactionRepository.findTransactionById).mockResolvedValue(
      txRow({ amount: 1, type: "INCOME", userId: "outro" }) as never,
    );

    const service = new TransactionService(
      transactionRepository as TransactionRepository,
      userRepository as UserRepository,
    );

    await expect(service.getTransactionById("tid", "eu")).rejects.toThrow("Not allowed");
  });

  it("getTransactionById retorna a transação quando o usuário é o dono", async () => {
    const row = txRow({ amount: 10, type: "INCOME", userId: "eu" });
    vi.mocked(transactionRepository.findTransactionById).mockResolvedValue(row as never);

    const service = new TransactionService(
      transactionRepository as TransactionRepository,
      userRepository as UserRepository,
    );

    const result = await service.getTransactionById("tid", "eu");
    expect(result).toEqual(row);
    expect(transactionRepository.findTransactionById).toHaveBeenCalledTimes(2);
  });
});
