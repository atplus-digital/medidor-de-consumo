import type { EnergyLog } from "@/db/schema";
import { formatDateTime, formatNumber } from "@/lib/format";
import { downloadBlob } from "./download-blob";

export function exportToCsv(logs: EnergyLog[], filename = "relatorio-energia") {
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

	const csv = [headers, ...rows].map((row) => row.join(";")).join("\n");
	const bom = "\uFEFF";
	const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
	downloadBlob(blob, `${filename}.csv`);
}
