import bcrypt from "bcryptjs";
import type { PasswordHasher } from "../../shared/ports/password-hasher.port.js";

export class BcryptHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
