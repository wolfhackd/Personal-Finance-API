import type { JwtPayload } from "jsonwebtoken";

export interface TokenService {
  sign(payload: object): Promise<string>;
  verify<T = any>(token: string): Promise<T>;
}
