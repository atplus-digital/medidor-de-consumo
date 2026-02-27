import { Activity, Gauge, TrendingUp, Zap } from "lucide-react";
import { useDashboard } from "@/app/dashboard/context/use-dashboard";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";

function Stats() {
	const { stats, isLoadingStats } = useDashboard();

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{isLoadingStats ? (
				<>
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
				</>
			) : (
				<>
					<StatCard
						title="Energia Consumida"
						value={formatNumber(stats?.totalConsumed ?? 0, 2)}
						unit="kWh"
						description="Últimos 30 dias"
						icon={Zap}
					/>
					<StatCard
						title="Potência Média"
						value={formatNumber(stats?.avgActivePower ?? 0, 1)}
						unit="W"
						description="Últimos 30 dias"
						icon={Activity}
					/>
					<StatCard
						title="Pico de Potência"
						value={formatNumber(stats?.maxActivePower ?? 0, 1)}
						unit="W"
						description="Máximo registrado"
						icon={TrendingUp}
					/>
					<StatCard
						title="Fator de Potência"
						value={formatNumber(stats?.avgPowerFactor ?? 0, 3)}
						description="Média do período"
						icon={Gauge}
					/>
				</>
			)}
		</div>
	);
}

export { Stats };
