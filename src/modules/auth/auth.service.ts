import type { PasswordHasher } from "../../shared/ports/password-hasher.port.js";
import type { TokenService } from "../../shared/ports/token-service.port.js";
import type { UserRepository } from "../user/user.repository.js";
import type { ILogin } from "./auth.types.js";

export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly hasher: PasswordHasher,
    private readonly userRepository: UserRepository,
  ) {}

  async login(loginData: ILogin): Promise<String> {
    const user = await this.userRepository.findUserByEmail(loginData.email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await this.hasher.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = await this.tokenService.sign({ id: user.id });

    return token;
  }
}
