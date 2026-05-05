import type { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "Personal Finance API",
        description:
          "API REST para gestão de finanças pessoais: usuários, autenticação JWT, transações e relatórios.",
        version: "1.0.0",
      },
      servers: [
        { url: "/", description: "Servidor atual" },
      ],
      tags: [
        { name: "Auth", description: "Login e identificação do usuário autenticado" },
        { name: "Users", description: "Cadastro de usuários" },
        {
          name: "Transactions",
          description:
            "CRUD e relatórios de transações (todas as rotas exigem Authorization: Bearer)",
        },
        {
          name: "Report",
          description: "Relatório mensal agregado e previsão (JWT obrigatório)",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Envie o token retornado por POST /login no cabeçalho Authorization.",
          },
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });
}
