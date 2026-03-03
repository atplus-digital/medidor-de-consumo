import {
	Activity,
	BarChart3,
	BatteryCharging,
	DollarSign,
	Gauge,
	Hash,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useReports } from "@/app/reports/context/reports-context";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/format";

function ReportsStats() {
	const { stats, isLoadingStats } = useReports();

	if (isLoadingStats) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Skeleton className="h-28" />
				<Skeleton className="h-28" />
				<Skeleton className="h-28" />
				<Skeleton className="h-28" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Linha principal */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Consumido"
					value={formatNumber(stats?.totalConsumed ?? 0, 2)}
					unit="kWh"
					icon={Zap}
				/>
				<StatCard
					title="Total Gerado"
					value={formatNumber(stats?.totalGenerated ?? 0, 2)}
					unit="kWh"
					icon={BatteryCharging}
				/>
				<StatCard
					title="Potência Média"
					value={formatNumber(stats?.avgActivePower ?? 0, 1)}
					unit="W"
					icon={Activity}
				/>
				<StatCard
					title="Pico de Potência"
					value={formatNumber(stats?.maxActivePower ?? 0, 1)}
					unit="W"
					icon={TrendingUp}
				/>
			</div>

			{/* Linha secundária */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Tensão Média"
					value={formatNumber(stats?.avgVoltage ?? 0, 1)}
					unit="V"
					description={`Min: ${formatNumber(stats?.minVoltage ?? 0, 1)}V / Max: ${formatNumber(stats?.maxVoltage ?? 0, 1)}V`}
					icon={Gauge}
				/>
				<StatCard
					title="Fator de Potência"
					value={formatNumber(stats?.avgPowerFactor ?? 0, 3)}
					description={`Mínimo: ${formatNumber(stats?.minPowerFactor ?? 0, 3)}`}
					icon={BarChart3}
				/>
				<StatCard
					title="Custo Estimado"
					value={formatCurrency(stats?.estimatedCost ?? 0)}
					description={stats?.estimatedRevenue ? `Receita: ${formatCurrency(stats.estimatedRevenue)}` : undefined}
					icon={DollarSign}
				/>
				<StatCard
					title="Total de Leituras"
					value={formatNumber(stats?.totalReadings ?? 0, 0)}
					description={`Consumo médio/dia: ${formatNumber(stats?.avgDailyConsumption ?? 0, 2)} kWh`}
					icon={Hash}
				/>
			</div>
		</div>
	);
}

export { ReportsStats };
