import { Activity, Hash, TrendingUp, Zap } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { useReports } from "@/app/reports/context/reports-context";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";

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
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title="Total Consumido"
				value={formatNumber(stats?.totalConsumed ?? 0, 2)}
				unit="kWh"
				icon={Zap}
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
			<StatCard
				title="Total de Leituras"
				value={formatNumber(stats?.totalReadings ?? 0, 0)}
				icon={Hash}
			/>
		</div>
	);
}

export { ReportsStats };
