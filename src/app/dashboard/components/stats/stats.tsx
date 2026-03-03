import {
	Activity,
	BatteryCharging,
	DollarSign,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useDashboard } from "@/app/dashboard/context/use-dashboard";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/format";

function Stats() {
	const { stats, isLoadingStats } = useDashboard();

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{isLoadingStats ? (
				<>
					<Skeleton className="h-28" />
					<Skeleton className="h-28" />
					<Skeleton className="h-28" />
					<Skeleton className="h-28" />
					<Skeleton className="h-28" />
				</>
			) : (
				<>
					<StatCard
						title="Energia Consumida"
						value={formatNumber(stats?.totalConsumed ?? 0, 2)}
						unit="Wh"
						description="Últimos 30 dias"
						icon={Zap}
					/>
					<StatCard
						title="Energia Gerada"
						value={formatNumber(stats?.totalGenerated ?? 0, 2)}
						unit="Wh"
						description="Últimos 30 dias"
						icon={BatteryCharging}
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
						title="Custo Estimado"
						value={formatCurrency(stats?.estimatedCost ?? 0)}
						description="Últimos 30 dias"
						icon={DollarSign}
					/>
				</>
			)}
		</div>
	);
}

export { Stats };
