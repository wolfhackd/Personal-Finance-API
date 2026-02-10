import type { FastifyReply, FastifyRequest } from "fastify";
import { loginInput } from "./auth.types.js";
import type { AuthService } from "./auth.service.js";

export class authController {
  constructor(private readonly service: AuthService) {}

  login = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const loginData = loginInput.parse(req.body);
      const token = await this.service.login(loginData);
      return res.status(200).send({ token });
    } catch (e: any) {
      console.log(e.message);
      return res.status(400).send({ message: e.message });
    }
  };
}
