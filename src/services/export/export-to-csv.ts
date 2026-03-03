import type { EnergyLog, EnergyStats } from "@/db/schema";
import {
	formatCurrency,
	formatDateTime,
	formatDuration,
	formatNumber,
} from "@/lib/format";
import { downloadBlob } from "./download-blob";

export interface CsvExportOptions {
	logs: EnergyLog[];
	stats?: EnergyStats | null;
	filename?: string;
	periodLabel?: string;
	meterLabel?: string;
}

export function exportToCsv({
	logs,
	stats,
	filename = "relatorio-energia",
	periodLabel,
	meterLabel,
}: CsvExportOptions) {
	const sections: string[] = [];

	// ========================
	// SEÇÃO DE RESUMO
	// ========================
	if (stats) {
		sections.push("=== RESUMO DO PERÍODO ===");
		if (periodLabel) sections.push(`Período;${periodLabel}`);
		if (meterLabel) sections.push(`Medidor;${meterLabel}`);
		sections.push(`Gerado em;${formatDateTime(new Date())}`);
		sections.push("");
		sections.push("Indicador;Valor");
		sections.push(
			`Energia Consumida;${formatNumber(stats.totalConsumed ?? 0, 2)} kWh`,
		);
		sections.push(
			`Energia Gerada;${formatNumber(stats.totalGenerated ?? 0, 2)} kWh`,
		);
		sections.push(
			`Balanço Energético;${formatNumber(stats.energyBalance ?? 0, 2)} kWh`,
		);
		sections.push(
			`Consumo Médio Diário;${formatNumber(stats.avgDailyConsumption ?? 0, 2)} kWh`,
		);
		sections.push(
			`Potência Média;${formatNumber(stats.avgActivePower ?? 0, 1)} W`,
		);
		sections.push(
			`Pico de Potência;${formatNumber(stats.maxActivePower ?? 0, 1)} W`,
		);
		sections.push(
			`Tensão Média;${formatNumber(stats.avgVoltage ?? 0, 1)} V`,
		);
		sections.push(
			`Tensão (Min/Máx);${formatNumber(stats.minVoltage ?? 0, 1)} / ${formatNumber(stats.maxVoltage ?? 0, 1)} V`,
		);
		sections.push(
			`Corrente Média;${formatNumber(stats.avgCurrent ?? 0, 3)} A`,
		);
		sections.push(
			`Fator de Potência Médio;${formatNumber(stats.avgPowerFactor ?? 0, 3)}`,
		);
		sections.push(
			`FP Mínimo;${formatNumber(stats.minPowerFactor ?? 0, 3)}`,
		);
		sections.push(
			`Frequência Média;${formatNumber(stats.avgFrequency ?? 0, 2)} Hz`,
		);
		sections.push(
			`Total de Leituras;${formatNumber(stats.totalReadings ?? 0, 0)}`,
		);
		sections.push(
			`Tempo de Operação;${formatDuration(stats.totalOperationTime ?? 0)}`,
		);
		sections.push(
			`Custo Estimado;${formatCurrency(stats.estimatedCost ?? 0)}`,
		);
		sections.push(
			`Receita Estimada;${formatCurrency(stats.estimatedRevenue ?? 0)}`,
		);
		sections.push(
			`Custo Líquido;${formatCurrency(stats.netCost ?? 0)}`,
		);
		sections.push("");
		sections.push("");
	}

	// ========================
	// SEÇÃO DE DADOS
	// ========================
	sections.push("=== REGISTROS DETALHADOS ===");

	const headers = [
		"ID",
		"Medidor",
		"Potência Ativa (W)",
		"Potência Reativa (VAR)",
		"Potência Aparente (VA)",
		"Tensão (V)",
		"Corrente (A)",
		"Fator de Potência",
		"Ângulo de Fase (°)",
		"Frequência (Hz)",
		"Energia Consumida (kWh)",
		"Energia Gerada (kWh)",
		"Tempo de Operação (s)",
		"Data/Hora",
	];

	const rows = logs.map((log) => [
		log.id,
		log.meterId,
		formatNumber(log.activePower),
		formatNumber(log.reactivePower),
		formatNumber(log.apparentPower),
		formatNumber(log.voltage),
		formatNumber(log.current, 3),
		formatNumber(log.powerFactor, 3),
		formatNumber(log.phaseAngle),
		formatNumber(log.frequency),
		formatNumber(log.consumedEnergy, 4),
		formatNumber(log.generatedEnergy, 4),
		formatNumber(log.operationTime),
		log.createdAt ? formatDateTime(log.createdAt) : "",
	]);

	sections.push(headers.join(";"));
	for (const row of rows) {
		sections.push(row.join(";"));
	}

	const csv = sections.join("\n");
	const bom = "\uFEFF";
	const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
	downloadBlob(blob, `${filename}.csv`);
}
