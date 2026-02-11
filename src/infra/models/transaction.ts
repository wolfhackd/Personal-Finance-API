export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface TransactionCreateProps {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  userId: string;
}

export interface TransactionPersistenceProps extends TransactionCreateProps {
  id: string;
  createdAt: Date;
}

export class Transaction {
  public readonly id?: string;
  title!: string;
  amount!: number;
  type!: TransactionType;
  category!: string;
  date!: Date;
  public readonly createdAt?: Date;
  public readonly userId!: string;

  constructor(props: Partial<TransactionPersistenceProps>) {
    Object.assign(this, props);
  }

  static restore(props: TransactionPersistenceProps): Transaction {
    return new Transaction(props);
  }

  static create(props: TransactionCreateProps): Transaction {
    return new Transaction(props);
  }
}
