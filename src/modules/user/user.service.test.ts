import { describe, it, expect, vi, beforeEach } from "vitest";
import { User } from "../../infra/models/user.js";
import type { PasswordHasher } from "../../shared/ports/password-hasher.port.js";
import type { TokenService } from "../../shared/ports/token-service.port.js";
import type { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

describe("UserService", () => {
  const userRepository: Pick<UserRepository, "findUserByEmail" | "create"> = {
    findUserByEmail: vi.fn(),
    create: vi.fn(),
  };
  const hasher: PasswordHasher = {
    hash: vi.fn(),
    compare: vi.fn(),
  };
  const tokenService: Pick<TokenService, "sign" | "verify"> = {
    sign: vi.fn(),
    verify: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria usuário quando o email ainda não existe", async () => {
    vi.mocked(userRepository.findUserByEmail).mockResolvedValue(null);
    vi.mocked(hasher.hash).mockResolvedValue("hash-seguro");

    const persisted = {
      id: "new-id",
      name: "Maria",
      email: "maria@test.com",
      password: "hash-seguro",
      createdAt: new Date("2026-01-01"),
    };

    vi.mocked(userRepository.create).mockImplementation(async (user: User) =>
      User.restore({
        id: persisted.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: persisted.createdAt,
      }),
    );

    const service = new UserService(userRepository as UserRepository, hasher, tokenService as TokenService);
    const result = await service.createUser({
      name: "Maria",
      email: "maria@test.com",
      password: "senha123",
    });

    expect(hasher.hash).toHaveBeenCalledWith("senha123");
    expect(result.id).toBe("new-id");
    expect(result.email).toBe("maria@test.com");
    expect(result.password).toBe("hash-seguro");
  });

  it("lança quando o email já está cadastrado", async () => {
    vi.mocked(userRepository.findUserByEmail).mockResolvedValue({
      id: "exist",
      name: "Outro",
      email: "dup@test.com",
      password: "p",
      createdAt: new Date(),
    });

    const service = new UserService(userRepository as UserRepository, hasher, tokenService as TokenService);

    await expect(
      service.createUser({ name: "N", email: "dup@test.com", password: "x" }),
    ).rejects.toThrow("User already exists");
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
