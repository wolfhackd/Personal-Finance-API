import puppeteer from "puppeteer";
import fs from "fs";

interface DateReport {
  mes: string;
  lucros: number;
  despesas: number;
  itens: Array<{ descricao: string; valor: number; tipo: "lucro" | "despesa" }>;
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
                  <p>Período: ${dados.mes}</p>
              </div>

              <div class="resumo">
                  <div class="card lucro">
                      <h3>Receitas</h3>
                      <p>R$ ${dados.lucros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div class="card despesa">
                      <h3>Despesas</h3>
                      <p>R$ ${dados.despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
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
                              <td>${item.descricao}</td>
                              <td>${item.tipo === "lucro" ? "Receita" : "Gasto"}</td>
                              <td class="${item.tipo === "lucro" ? "v-lucro" : "v-despesa"}">
                                  R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                          </tr>
                      `,
                        )
                        .join("")}
                  </tbody>
              </table>

              <div class="footer">
                  Saldo Final: R$ ${(dados.lucros - dados.despesas).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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

  //   @ts-ignore
  return base64String;
}

const dadosTeste: DateReport = {
  mes: "Março 2024",
  lucros: 50000,
  despesas: 32000,
  itens: [
    { descricao: "Venda Licença A", valor: 30000, tipo: "lucro" },
    { descricao: "Consultoria B", valor: 20000, tipo: "lucro" },
    { descricao: "Servidores Cloud", valor: 15000, tipo: "despesa" },
    { descricao: "Folha Pagamento", valor: 17000, tipo: "despesa" },
  ],
};

Base64PdfGenerator(dadosTeste).then((b64) => {
  console.log("PDF Gerado!");
  console.log("Começa com JVBER?", b64.startsWith("JVBER"));
  fs.writeFileSync("teste.pdf", Buffer.from(b64, "base64")); // Opcional: salva arquivo real
});
