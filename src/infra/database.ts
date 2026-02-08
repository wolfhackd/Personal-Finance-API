import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { Pool } from "pg";

export class Database {
  private static instance: Database;
  private prisma: PrismaClient;
  private isConnected = false;

  private constructor() {
    const connectionString = env.DATABASE_URL;

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Database is already connected");
      return;
    }

    try {
      console.log("Connecting to the database...");
      await this.prisma.$connect();
      this.isConnected = true;
      console.log("Database connected successfully");
    } catch (e) {
      console.log(e);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await this.prisma.$disconnect();
    this.isConnected = false;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /** @internal - only for tests */
  public async clearInstance(): Promise<void> {
    if (this.isConnected) {
      await this.disconnect();
    }

    Database.instance = undefined as unknown as Database;
  }
}

export const database = Database.getInstance();
export const prisma = database.getClient();
