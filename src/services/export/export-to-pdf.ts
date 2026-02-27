import type { EnergyLog } from "@/db/schema";
import { formatDateTime, formatNumber } from "@/lib/format";

export async function exportToPdf(
	logs: EnergyLog[],
	filename = "relatorio-energia",
) {
	const { jsPDF } = await import("jspdf");
	const { default: autoTable } = await import("jspdf-autotable");

	const doc = new jsPDF({ orientation: "landscape" });

	doc.setFontSize(16);
	doc.text("Relatório de Consumo de Energia", 14, 15);
	doc.setFontSize(10);
	doc.text(`Gerado em: ${formatDateTime(new Date())}`, 14, 22);
	doc.text(`Total de registros: ${logs.length}`, 14, 28);

	autoTable(doc, {
		startY: 35,
		head: [
			[
				"ID",
				"Medidor",
				"Pot. Ativa (W)",
				"Tensão (V)",
				"Corrente (A)",
				"FP",
				"Freq. (Hz)",
				"Consumo (kWh)",
				"Geração (kWh)",
				"Data/Hora",
			],
		],
		body: logs.map((log) => [
			log.id,
			log.meterId,
			formatNumber(log.activePower),
			formatNumber(log.voltage),
			formatNumber(log.current, 3),
			formatNumber(log.powerFactor, 3),
			formatNumber(log.frequency),
			formatNumber(log.consumedEnergy, 4),
			formatNumber(log.generatedEnergy, 4),
			log.createdAt ? formatDateTime(log.createdAt) : "",
		]),
		styles: { fontSize: 7 },
		headStyles: { fillColor: [30, 41, 59] },
	});

	doc.save(`${filename}.pdf`);
}
