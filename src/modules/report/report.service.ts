import type { UserRepository } from "../user/user.repository.js";
import type { ReportRepository } from "./report.repository.js";



export class ReportService {


    constructor (
        private readonly reportRepository: ReportRepository,
        private readonly userRepository: UserRepository
    ) {}


    //Primeiro puxar os últimos 10 meses para criar um relatorio mensal dividido por mes e categoria
    reportMonthly = async (id: string) => {

        const user = await this.userRepository.findUserById(id);
        if (!user) throw new Error("User not found");

        //Retorna os últimos 10 meses de despesas
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

        return monthlyExpenses
    }

}