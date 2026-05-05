import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PasswordHasher } from "../../shared/ports/password-hasher.port.js";
import type { TokenService } from "../../shared/ports/token-service.port.js";
import type { UserRepository } from "../user/user.repository.js";
import { AuthService } from "./auth.service.js";

describe("AuthService", () => {
  const tokenService: Pick<TokenService, "sign" | "verify"> = {
    sign: vi.fn(),
    verify: vi.fn(),
  };
  const hasher: PasswordHasher = {
    hash: vi.fn(),
    compare: vi.fn(),
  };
  const userRepository: Pick<UserRepository, "findUserByEmail"> = {
    findUserByEmail: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna JWT quando email e senha estão corretos", async () => {
    vi.mocked(userRepository.findUserByEmail).mockResolvedValue({
      id: "user-1",
      name: "Test",
      email: "a@b.com",
      password: "stored-hash",
      createdAt: new Date(),
    });
    vi.mocked(hasher.compare).mockResolvedValue(true);
    vi.mocked(tokenService.sign).mockResolvedValue("jwt-token");

    const service = new AuthService(tokenService, hasher, userRepository as UserRepository);
    const token = await service.login({ email: "a@b.com", password: "plain" });

    expect(token).toBe("jwt-token");
    expect(hasher.compare).toHaveBeenCalledWith("plain", "stored-hash");
    expect(tokenService.sign).toHaveBeenCalledWith({ id: "user-1" });
  });

  it("lança quando o usuário não existe", async () => {
    vi.mocked(userRepository.findUserByEmail).mockResolvedValue(null);

    const service = new AuthService(tokenService, hasher, userRepository as UserRepository);

    await expect(
      service.login({ email: "missing@test.com", password: "x" }),
    ).rejects.toThrow("User not found");
    expect(tokenService.sign).not.toHaveBeenCalled();
  });

  it("lança quando a senha não confere", async () => {
    vi.mocked(userRepository.findUserByEmail).mockResolvedValue({
      id: "user-1",
      name: "Test",
      email: "a@b.com",
      password: "stored-hash",
      createdAt: new Date(),
    });
    vi.mocked(hasher.compare).mockResolvedValue(false);

    const service = new AuthService(tokenService, hasher, userRepository as UserRepository);

    await expect(service.login({ email: "a@b.com", password: "wrong" })).rejects.toThrow(
      "Invalid password",
    );
    expect(tokenService.sign).not.toHaveBeenCalled();
  });
});
