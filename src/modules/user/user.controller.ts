import type { FastifyReply, FastifyRequest } from "fastify";
import { userCreateInput } from "./user.types.js";
import { UserService } from "./user.service.js";

export class UserController {
  constructor(private readonly service: UserService) {}

  createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userData = userCreateInput.parse(req.body);

      const newUser = await this.service.createUser(userData);
      return reply.status(201).send(newUser);
    } catch (e: any) {
      console.log(e.message);
      return reply.status(400).send({ message: e.message });
    }
  };
}
