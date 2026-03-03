import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { useReports } from "@/app/reports/context/reports-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type QualityStatus = "ok" | "warning" | "critical";

interface QualityItem {
	label: string;
	status: QualityStatus;
	value: string;
	description: string;
}

function getStatusIcon(status: QualityStatus) {
	switch (status) {
		case "ok":
			return <CheckCircle2 className="size-4 text-green-500" />;
		case "warning":
			return <AlertTriangle className="size-4 text-yellow-500" />;
		case "critical":
			return <ShieldAlert className="size-4 text-red-500" />;
	}
}

function getStatusBadge(status: QualityStatus) {
	const labels: Record<QualityStatus, string> = {
		ok: "Adequado",
		warning: "Atenção",
		critical: "Crítico",
	};

	return (
		<Badge
			variant="outline"
			className={cn(
				status === "ok" && "border-green-500 text-green-600",
				status === "warning" && "border-yellow-500 text-yellow-600",
				status === "critical" && "border-red-500 text-red-600",
			)}
		>
			{labels[status]}
		</Badge>
	);
}

function ReportsQualityAnalysis() {
	const { stats, isLoadingStats } = useReports();

	if (isLoadingStats) {
		return <Skeleton className="h-48 w-full" />;
	}

	if (!stats || !stats.totalReadings) {
		return null;
	}

	const qualityItems: QualityItem[] = [];

	// Análise de tensão (referência ANEEL: 127V ±10%)
	const avgVoltage = stats.avgVoltage ?? 0;
	if (avgVoltage > 0) {
		const voltageStatus: QualityStatus =
			avgVoltage >= 117 && avgVoltage <= 133
				? "ok"
				: avgVoltage >= 110 && avgVoltage <= 140
					? "warning"
					: "critical";

		const voltageVariation =
			stats.maxVoltage && stats.minVoltage && avgVoltage > 0
				? ((stats.maxVoltage - stats.minVoltage) / avgVoltage) * 100
				: 0;

		qualityItems.push({
			label: "Tensão",
			status: voltageStatus,
			value: `${formatNumber(avgVoltage, 1)}V (${formatNumber(stats.minVoltage ?? 0, 1)} - ${formatNumber(stats.maxVoltage ?? 0, 1)}V)`,
			description:
				voltageStatus === "ok"
					? `Dentro da faixa adequada ANEEL (117-133V). Variação: ${formatNumber(voltageVariation, 1)}%`
					: voltageStatus === "warning"
						? `Faixa precária. Variação: ${formatNumber(voltageVariation, 1)}%. Considere verificar a instalação.`
						: `Fora da faixa aceitável! Variação: ${formatNumber(voltageVariation, 1)}%. Contate a concessionária.`,
		});
	}

	// Análise de fator de potência (mínimo regulatório: 0,92)
	const avgPF = stats.avgPowerFactor ?? 0;
	const minPF = stats.minPowerFactor ?? 0;
	const pfStatus: QualityStatus =
		avgPF >= 0.92
			? minPF >= 0.85
				? "ok"
				: "warning"
			: avgPF >= 0.85
				? "warning"
				: "critical";

	qualityItems.push({
		label: "Fator de Potência",
		status: pfStatus,
		value: `Média: ${formatNumber(avgPF, 3)} / Mínimo: ${formatNumber(minPF, 3)}`,
		description:
			pfStatus === "ok"
				? "Acima do mínimo regulatório de 0,92. Sem risco de multa."
				: pfStatus === "warning"
					? "Próximo ao limite regulatório de 0,92. Recomenda-se correção do fator de potência."
					: "Abaixo de 0,92 — risco de multa por excesso de energia reativa. Instale banco de capacitores.",
	});

	// Análise de frequência (referência: 60Hz ± 0,5Hz)
	const avgFreq = stats.avgFrequency ?? 0;
	if (avgFreq > 0) {
		const freqStatus: QualityStatus =
			avgFreq >= 59.5 && avgFreq <= 60.5
				? "ok"
				: avgFreq >= 59.0 && avgFreq <= 61.0
					? "warning"
					: "critical";

		qualityItems.push({
			label: "Frequência",
			status: freqStatus,
			value: `${formatNumber(avgFreq, 2)} Hz (${formatNumber(stats.minFrequency ?? 0, 2)} - ${formatNumber(stats.maxFrequency ?? 0, 2)} Hz)`,
			description:
				freqStatus === "ok"
					? "Dentro da faixa normal (60 Hz ± 0,5 Hz)."
					: "Desvio detectado na frequência da rede.",
		});
	}

	// Análise de balanço energético
	const consumed = stats.totalConsumed ?? 0;
	const generated = stats.totalGenerated ?? 0;
	if (consumed > 0 || generated > 0) {
		const ratio = consumed > 0 ? (generated / consumed) * 100 : 0;
		const balanceStatus: QualityStatus =
			ratio >= 80 ? "ok" : ratio >= 30 ? "warning" : "critical";

		qualityItems.push({
			label: "Autossuficiência",
			status: generated > 0 ? balanceStatus : "critical",
			value:
				generated > 0
					? `${formatNumber(ratio, 1)}% do consumo coberto por geração`
					: "Sem geração registrada",
			description:
				generated > 0
					? ratio >= 80
						? "Excelente cobertura de geração própria."
						: `Geração cobre ${formatNumber(ratio, 1)}% do consumo. Considere ampliar a geração.`
					: "Nenhuma geração de energia foi registrada no período.",
		});
	}

	if (qualityItems.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Info className="size-5 text-blue-500" />
					Análise de Qualidade da Energia
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{qualityItems.map((item) => (
						<div
							key={item.label}
							className="flex flex-col gap-2 rounded-lg border p-4"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{getStatusIcon(item.status)}
									<span className="font-medium">{item.label}</span>
								</div>
								{getStatusBadge(item.status)}
							</div>
							<p className="text-sm font-mono text-foreground">{item.value}</p>
							<p className="text-xs text-muted-foreground">
								{item.description}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export { ReportsQualityAnalysis };
