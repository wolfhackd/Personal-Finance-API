import type { FastifyReply, FastifyRequest } from "fastify";
import type { ReportService } from "./report.service.js";



export class ReportController {
    constructor(private readonly service: ReportService) {}

    getMonthlyReport = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const id = req.user?.id as string;
            const report = await this.service.reportMonthly(id);
            return reply.status(200).send(report);
        } catch (e: any) {
            console.log(e.message);
            return reply.status(400).send({ message: e.message });
        }
    };
}