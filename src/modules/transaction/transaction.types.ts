import z from "zod";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export const transactionCreateInput = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  amount: z.number().min(1, { message: "Amount must be at least 1" }),
  type: z.nativeEnum(TransactionType),
  category: z
    .string()
    .min(2, { message: "Category must be at least 2 characters" }),
  date: z.coerce.date(),
  userId: z.string(),
});

export type ITransactionCreate = z.infer<typeof transactionCreateInput>;

export const GetTransactionsQueryParamsInput = z.object({
  date: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type GetTransactionsQueryParams = z.infer<
  typeof GetTransactionsQueryParamsInput
>;

export type ITransactionFilter = z.infer<
  typeof GetTransactionsQueryParamsInput
>;
// export type GetTransactionsQueryParams = {
//   date?: string;
//   endDate?: string;
// };
