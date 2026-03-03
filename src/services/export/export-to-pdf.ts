import type { EnergyLog, EnergyStats } from "@/db/schema";
import {
	formatCurrency,
	formatDateTime,
	formatDuration,
	formatNumber,
} from "@/lib/format";

export interface PdfExportOptions {
	logs: EnergyLog[];
	stats?: EnergyStats | null;
	filename?: string;
	periodLabel?: string;
	meterLabel?: string;
}

export async function exportToPdf({
	logs,
	stats,
	filename = "relatorio-energia",
	periodLabel,
	meterLabel,
}: PdfExportOptions) {
	const { jsPDF } = await import("jspdf");
	const { default: autoTable } = await import("jspdf-autotable");

	const doc = new jsPDF({ orientation: "landscape" });
	const pageWidth = doc.internal.pageSize.getWidth();
	let y = 15;

	// ========================
	// CABEÇALHO DO RELATÓRIO
	// ========================
	doc.setFontSize(18);
	doc.setTextColor(30, 41, 59);
	doc.text("Relatório de Consumo de Energia", 14, y);
	y += 8;

	doc.setFontSize(10);
	doc.setTextColor(100, 100, 100);
	doc.text(`Gerado em: ${formatDateTime(new Date())}`, 14, y);
	y += 5;

	if (periodLabel) {
		doc.text(`Período: ${periodLabel}`, 14, y);
		y += 5;
	}

	if (meterLabel) {
		doc.text(`Medidor: ${meterLabel}`, 14, y);
		y += 5;
	}

	doc.text(`Total de registros: ${logs.length}`, 14, y);
	y += 3;

	// Linha separadora
	doc.setDrawColor(200, 200, 200);
	doc.line(14, y, pageWidth - 14, y);
	y += 5;

	// ========================
	// RESUMO ESTATÍSTICO
	// ========================
	if (stats) {
		doc.setFontSize(14);
		doc.setTextColor(30, 41, 59);
		doc.text("Resumo do Período", 14, y);
		y += 7;

		autoTable(doc, {
			startY: y,
			theme: "grid",
			headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
			bodyStyles: { fontSize: 8 },
			columnStyles: {
				0: { cellWidth: 55, fontStyle: "bold" },
				1: { cellWidth: 55, halign: "right" },
				2: { cellWidth: 55, fontStyle: "bold" },
				3: { cellWidth: 55, halign: "right" },
			},
			head: [["Indicador", "Valor", "Indicador", "Valor"]],
			body: [
				[
					"Energia Consumida",
					`${formatNumber(stats.totalConsumed ?? 0, 2)} kWh`,
					"Energia Gerada",
					`${formatNumber(stats.totalGenerated ?? 0, 2)} kWh`,
				],
				[
					"Balanço Energético",
					`${formatNumber(stats.energyBalance ?? 0, 2)} kWh`,
					"Consumo Médio/Dia",
					`${formatNumber(stats.avgDailyConsumption ?? 0, 2)} kWh`,
				],
				[
					"Potência Média",
					`${formatNumber(stats.avgActivePower ?? 0, 1)} W`,
					"Pico de Potência",
					`${formatNumber(stats.maxActivePower ?? 0, 1)} W`,
				],
				[
					"Tensão Média",
					`${formatNumber(stats.avgVoltage ?? 0, 1)} V`,
					"Tensão (Min/Máx)",
					`${formatNumber(stats.minVoltage ?? 0, 1)} / ${formatNumber(stats.maxVoltage ?? 0, 1)} V`,
				],
				[
					"Corrente Média",
					`${formatNumber(stats.avgCurrent ?? 0, 3)} A`,
					"Corrente Máxima",
					`${formatNumber(stats.maxCurrent ?? 0, 3)} A`,
				],
				[
					"Fator de Potência Médio",
					formatNumber(stats.avgPowerFactor ?? 0, 3),
					"FP Mínimo",
					formatNumber(stats.minPowerFactor ?? 0, 3),
				],
				[
					"Frequência Média",
					`${formatNumber(stats.avgFrequency ?? 0, 2)} Hz`,
					"Freq. (Min/Máx)",
					`${formatNumber(stats.minFrequency ?? 0, 2)} / ${formatNumber(stats.maxFrequency ?? 0, 2)} Hz`,
				],
				[
					"Total de Leituras",
					formatNumber(stats.totalReadings ?? 0, 0),
					"Tempo de Operação",
					formatDuration(stats.totalOperationTime ?? 0),
				],
				[
					"Custo Estimado",
					formatCurrency(stats.estimatedCost ?? 0),
					"Receita Estimada",
					formatCurrency(stats.estimatedRevenue ?? 0),
				],
				[
					"Custo Líquido",
					formatCurrency(stats.netCost ?? 0),
					"",
					"",
				],
			],
		});

		// biome-ignore lint/suspicious/noExplicitAny: jsPDF autoTable uses any for lastAutoTable
		y = (doc as any).lastAutoTable.finalY + 10;
	}

	// ========================
	// ANÁLISE DE QUALIDADE
	// ========================
	if (stats) {
		// Verifica se precisa de nova página
		if (y > 160) {
			doc.addPage();
			y = 15;
		}

		doc.setFontSize(14);
		doc.setTextColor(30, 41, 59);
		doc.text("Análise de Qualidade", 14, y);
		y += 7;

		const qualityItems: string[][] = [];

		// Análise de tensão
		const avgVoltage = stats.avgVoltage ?? 0;
		if (avgVoltage > 0) {
			const voltageVariation =
				((stats.maxVoltage ?? 0) - (stats.minVoltage ?? 0)) /
				avgVoltage *
				100;
			const voltageStatus =
				avgVoltage >= 117 && avgVoltage <= 133
					? "Adequada"
					: avgVoltage >= 110 && avgVoltage <= 140
						? "Precária"
						: "Crítica";
			qualityItems.push([
				"Tensão",
				voltageStatus,
				`Variação: ${formatNumber(voltageVariation, 1)}%`,
				avgVoltage >= 117 && avgVoltage <= 133 ? "Dentro da faixa ANEEL (117-133V)" : "Fora da faixa adequada ANEEL",
			]);
		}

		// Análise de fator de potência
		const avgPF = stats.avgPowerFactor ?? 0;
		const pfStatus =
			avgPF >= 0.92
				? "Adequado"
				: avgPF >= 0.85
					? "Atenção"
					: "Crítico (multa ANEEL)";
		qualityItems.push([
			"Fator de Potência",
			pfStatus,
			`Média: ${formatNumber(avgPF, 3)}`,
			avgPF >= 0.92 ? "Acima do mínimo regulatório (0,92)" : "Abaixo de 0,92 - risco de multa",
		]);

		// Análise de frequência
		const avgFreq = stats.avgFrequency ?? 0;
		if (avgFreq > 0) {
			const freqStatus =
				avgFreq >= 59.9 && avgFreq <= 60.1 ? "Normal" : "Fora da faixa";
			qualityItems.push([
				"Frequência",
				freqStatus,
				`Média: ${formatNumber(avgFreq, 2)} Hz`,
				"Referência: 60 Hz ± 0,1 Hz",
			]);
		}

		autoTable(doc, {
			startY: y,
			theme: "striped",
			headStyles: { fillColor: [59, 130, 246], fontSize: 8 },
			bodyStyles: { fontSize: 8 },
			head: [["Indicador", "Status", "Valor", "Observação"]],
			body: qualityItems,
		});

		// biome-ignore lint/suspicious/noExplicitAny: jsPDF autoTable uses any for lastAutoTable
		y = (doc as any).lastAutoTable.finalY + 10;
	}

	// ========================
	// TABELA DE DADOS
	// ========================
	if (y > 160) {
		doc.addPage();
		y = 15;
	}

	doc.setFontSize(14);
	doc.setTextColor(30, 41, 59);
	doc.text("Registros Detalhados", 14, y);
	y += 7;

	autoTable(doc, {
		startY: y,
		head: [
			[
				"ID",
				"Medidor",
				"Pot. Ativa (W)",
				"Pot. Reativa (VAR)",
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
			formatNumber(log.reactivePower),
			formatNumber(log.voltage, 1),
			formatNumber(log.current, 3),
			formatNumber(log.powerFactor, 3),
			formatNumber(log.frequency, 1),
			formatNumber(log.consumedEnergy, 4),
			formatNumber(log.generatedEnergy, 4),
			log.createdAt ? formatDateTime(log.createdAt) : "",
		]),
		styles: { fontSize: 7 },
		headStyles: { fillColor: [30, 41, 59] },
	});

	// ========================
	// RODAPÉ
	// ========================
	const totalPages = doc.getNumberOfPages();
	for (let i = 1; i <= totalPages; i++) {
		doc.setPage(i);
		doc.setFontSize(8);
		doc.setTextColor(150, 150, 150);
		doc.text(
			`Página ${i} de ${totalPages}`,
			pageWidth - 14,
			doc.internal.pageSize.getHeight() - 10,
			{ align: "right" },
		);
		doc.text(
			"Medidor de Consumo - Relatório gerado automaticamente",
			14,
			doc.internal.pageSize.getHeight() - 10,
		);
	}

	doc.save(`${filename}.pdf`);
}
