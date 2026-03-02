import puppeteer from "puppeteer";

interface DateReport {
  month: number | string;
  expenses: number;
  incomes: number;
  itens: Array<{ title: string; amount: number; type: "EXPENSE" | "INCOME" }>;
}

export async function Base64PdfGenerator(dados: DateReport) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const htmlContent = `
      <html>
          <head>
              <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #333; }
                  .header { text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px; }
                  .resumo { display: flex; justify-content: space-around; margin-bottom: 30px; }
                  .card { padding: 15px; border-radius: 10px; width: 40%; text-align: center; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                  .lucro { background: #27ae60; }
                  .despesa { background: #e74c3c; }
                  table { width: 100%; border-collapse: collapse; }
                  th { background: #f2f2f2; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
                  td { padding: 10px; border-bottom: 1px solid #eee; }
                  .v-lucro { color: #27ae60; font-weight: bold; }
                  .v-despesa { color: #e74c3c; font-weight: bold; }
                  .footer { margin-top: 30px; text-align: right; font-size: 1.2em; font-weight: bold; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>Relatório de Fluxo de Caixa</h1>
                  <p>Período: ${dados.month}</p>
              </div>

              <div class="resumo">
                  <div class="card lucro">
                      <h3>Receitas</h3>
                      <p>R$ ${dados.incomes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div class="card despesa">
                      <h3>Despesas</h3>
                      <p>R$ ${dados.expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  </div>
              </div>

              <table>
                  <thead>
                      <tr>
                          <th>Descrição</th>
                          <th>Categoria</th>
                          <th>Valor</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${dados.itens
                        .map(
                          (item) => `
                          <tr>
                              <td>${item.title}</td>
                              <td>${item.type === "EXPENSE" ? "Receita" : "Gasto"}</td>
                              <td class="${item.type === "EXPENSE" ? "v-lucro" : "v-despesa"}">
                                  R$ ${item.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                          </tr>
                      `,
                        )
                        .join("")}
                  </tbody>
              </table>

              <div class="footer">
                  Saldo Final: R$ ${(dados.incomes - dados.expenses).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
          </body>
      </html>
      `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
  });

  const base64String = Buffer.from(pdfBuffer).toString("base64");

  await browser.close();

  return base64String;
}
