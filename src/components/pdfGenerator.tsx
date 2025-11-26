import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportPDFProps {
  expenses: any[];
  incomes: any[];
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  monthText: string | null;
  year: number | null;
}

export function generateReportPDF({
  expenses,
  incomes,
  totalExpenses,
  totalIncomes,
  balance,
  monthText,
  year,
}: ReportPDFProps) {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Informe Financiero", 14, 20);

  // Subtítulo
  doc.setFontSize(12);
  doc.text(`Periodo: ${monthText || "Todos los meses"} ${year || ""}`, 14, 28);

  // Resumen general
  autoTable(doc, {
    startY: 35,
    head: [["Ingresos Totales", "Gastos Totales", "Balance"]],
    body: [[`$${totalIncomes}`, `$${totalExpenses}`, `$${balance}`]],
  });

  // ⚠️ Obtener la posición final de la última tabla
  let finalY = (doc as any).lastAutoTable?.finalY || 35;

  // Tabla de Ingresos
  autoTable(doc, {
    startY: finalY + 10,
    head: [["Descripción", "Monto", "Fecha"]],
    body: incomes.map((inc) => [
      inc.description,
      `$${inc.amount}`,
      formatDate(inc.date),
    ]),
  });

  finalY = (doc as any).lastAutoTable?.finalY || finalY;

  // Tabla de Gastos
  autoTable(doc, {
    startY: finalY + 10,
    head: [["Descripción", "Monto", "Fecha"]],
    body: expenses.map((exp) => [
      exp.description,
      `$${exp.amount}`,
      formatDate(exp.date),
    ]),
  });

  // Descargar PDF
  doc.save("informe_financiero.pdf");
}

// Helper
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}