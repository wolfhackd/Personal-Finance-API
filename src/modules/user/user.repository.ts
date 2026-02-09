import type { PrismaClient } from "../../generated/prisma/client.js";
import { prisma } from "../../infra/database.js";
import { User } from "../../infra/models/user.js";

export class UserRepository {
  constructor(private readonly database: PrismaClient = prisma) {}

  async findUserByEmail(email: string) {
    return this.database.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return this.database.user.findUnique({ where: { id } });
  }

  async create(user: User): Promise<User> {
    const data = await this.database.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return User.restore(data);
  }
}
