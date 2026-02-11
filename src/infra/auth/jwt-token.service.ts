import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import type { TokenService } from "../../shared/ports/token-service.port.js";

interface JwtPayloadUser {
  sub: string;
}

export class JwtTokenService implements TokenService {
  async sign(payload: object): Promise<string> {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1d" });
  }

  async verify<T>(token: string): Promise<T> {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string") {
      throw new Error("Invalid JWT payload");
    }

    return decoded as T;
  }
}
