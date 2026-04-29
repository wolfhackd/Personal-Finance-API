import type { UserRepository } from "../user/user.repository.js";
import type { ReportRepository } from "./report.repository.js";
import { env } from "../../config/env.js";



export class ReportService {


    constructor (
        private readonly reportRepository: ReportRepository,
        private readonly userRepository: UserRepository
    ) {}


    reportMonthly = async (id: string) => {

        const user = await this.userRepository.findUserById(id);
        if (!user) throw new Error("User not found");

        const data = await this.reportRepository.getMonthlyReport(id);

        const monthlyExpenses = data.reduce((acc: any, transaction) => {
            const month = transaction.date.getMonth();
            const category = transaction.category;
            if (!acc[month]) {
                acc[month] = {};
            }
            if (!acc[month][category]) {
                acc[month][category] = 0;
            }
            acc[month][category] += transaction.amount;
            return acc;
        }, {});

        //Posso salvar isso no banco e atualizar sempre que vier uma nova transação

        return monthlyExpenses
    }

    getForecast = async (id: string) => {
        const monthlyReport = await this.reportMonthly(id);

        const forecastServiceUrl = (env as { FORECAST_SERVICE_URL?: string })["FORECAST_SERVICE_URL"];
        if (!forecastServiceUrl) {
            throw new Error("FORECAST_SERVICE_URL não definida no arquivo .env");
        }

        const response = await fetch(`${forecastServiceUrl}/forecast`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(monthlyReport),
        });

        if (!response.ok) {
            const body = await response.text().catch(() => "");
            throw new Error(`Erro ao consultar microserviço de forecast (${response.status}): ${body || response.statusText}`);
        }

        const forecast = await response.json();
        return forecast;
    }
}