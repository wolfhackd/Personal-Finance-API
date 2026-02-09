import { User } from "../../infra/models/user.js";
import type { PasswordHasher } from "./ports/password-hasher.port.js";
import type { UserRepository } from "./user.repository.js";
import type { IUserCreate } from "./user.types.js";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async createUser(userData: IUserCreate): Promise<User> {
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      userData.email,
    );

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const passwordHash = await this.hasher.hash(userData.password);
    userData.password = passwordHash;

    const user = User.create(userData);

    const persistedUser = await this.userRepository.create(user);

    return persistedUser;
  }
}
