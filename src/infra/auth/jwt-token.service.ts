import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

interface JwtPayloadUser {
  sub: string;
}

export class JwtTokenService {
  sign = async (Payload: object) => {
    return jwt.sign(Payload, env.JWT_SECRET, { expiresIn: "1d" });
  };

  verify = async (token: string) => {
    return jwt.verify(token, env.JWT_SECRET);
  };
}
