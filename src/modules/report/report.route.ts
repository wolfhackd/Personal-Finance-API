import type { FastifyInstance } from "fastify";
import { JwtTokenService } from "../../infra/auth/jwt-token.service.js";
import { authMiddleware } from "../auth/auth.middleware.js";


import { ReportController } from "./report.controller.js";
import { ReportService } from "./report.service.js";
import { ReportRepository } from "./report.repository.js";
import { UserRepository } from "../user/user.repository.js";

const repository = new ReportRepository();
const userRepository = new UserRepository();
const service = new ReportService(repository, userRepository);
const controller = new ReportController(service);


const tokenService = new JwtTokenService();
const auth = authMiddleware(tokenService);

export const reportRoute = (app: FastifyInstance) => {
    app.addHook("preHandler", auth);

    app.get("/", controller.getMonthlyReport);
    app.get("/forecast", controller.getForecast);
};