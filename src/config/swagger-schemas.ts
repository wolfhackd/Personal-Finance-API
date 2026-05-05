/** Fragmentos reutilizáveis para schema das rotas (OpenAPI / Fastify) */

export const securityBearer = [{ bearerAuth: [] }] as const;

export const error400 = {
  description: "Erro de validação ou regra de negócio",
  type: "object" as const,
  properties: {
    message: { type: "string" as const },
  },
  required: ["message"] as const,
};

/** Formato retornado pelo Prisma para `transaction` */
export const transactionEntity = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const, format: "uuid" },
    title: { type: "string" as const },
    amount: { type: "number" as const },
    type: { type: "string" as const, enum: ["INCOME", "EXPENSE"] },
    category: { type: "string" as const },
    date: { type: "string" as const, format: "date-time" },
    createdAt: { type: "string" as const, format: "date-time" },
    userId: { type: "string" as const, format: "uuid" },
  },
};
