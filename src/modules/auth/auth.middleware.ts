import type { FastifyRequest, FastifyReply } from "fastify";
import type { TokenService } from "../../shared/ports/token-service.port.js";

export function authMiddleware(tokenService: TokenService) {
  return async function (req: FastifyRequest, reply: FastifyReply) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ message: "Token missing" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return reply.status(401).send({ message: "Invalid token format" });
    }

    try {
      const payload = await tokenService.verify<{ id: string }>(token);

      req.user = {
        id: payload.id,
      };
    } catch {
      return reply.status(401).send({ message: "Invalid or expired token" });
    }
  };
}
