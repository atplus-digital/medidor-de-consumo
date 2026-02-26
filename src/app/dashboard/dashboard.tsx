import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { Activity, Gauge, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { ConsumptionChart } from "@/components/charts/consumption-chart";
import { RealTimeReading } from "@/components/dashboard/real-time-reading";
import { StatCard } from "@/components/dashboard/stat-card";
import { MeterSelect } from "@/components/filters/meter-select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";
import {
	getConsumptionByPeriod,
	getEnergyStats,
	getLatestReading,
	getMeterIds,
} from "@/lib/energy-client";
import { formatNumber } from "@/lib/format";

function Dashboard() {
	const { filters, setMeterId } = useEnergyFilters();

	const { data: meterIds = [] } = useQuery({
		queryKey: ["meter-ids"],
		queryFn: () => getMeterIds(),
	});

	const {
		data: latestReading,
		isLoading: isLoadingReading,
		refetch: refetchReading,
	} = useQuery({
		queryKey: ["latest-reading", filters.meterId],
		queryFn: () => getLatestReading(filters.meterId),
		refetchInterval: 10000,
	});

	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: ["energy-stats", filters.meterId],
		queryFn: () =>
			getEnergyStats(
				filters.startDate?.toISOString(),
				filters.endDate?.toISOString(),
				filters.meterId,
			),
	});

	const { data: dailyData = [], isLoading: isLoadingChart } = useQuery({
		queryKey: ["daily-consumption-dashboard", filters.meterId],
		queryFn: () =>
			getConsumptionByPeriod(
				"daily",
				subDays(new Date(), 7).toISOString(),
				new Date().toISOString(),
				filters.meterId,
			),
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Visão geral do consumo de energia
					</p>
				</div>
				<div className="flex items-center gap-2">
					<MeterSelect
						meterIds={meterIds}
						value={filters.meterId}
						onChange={setMeterId}
					/>
					<Button variant="outline" size="sm" onClick={() => refetchReading()}>
						<RefreshCw className="size-4" />
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
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

			{/* Real-time Reading */}
			<RealTimeReading
				reading={latestReading ?? null}
				isLoading={isLoadingReading}
			/>

			{/* Quick Chart */}
			<ConsumptionChart
				title="Consumo dos Últimos 7 Dias"
				data={dailyData}
				dataKeys={[
					{
						key: "totalConsumed",
						label: "Consumo (kWh)",
						color: "hsl(var(--chart-1))",
					},
					{
						key: "totalGenerated",
						label: "Geração (kWh)",
						color: "hsl(var(--chart-2))",
					},
				]}
				type="area"
				isLoading={isLoadingChart}
			/>
		</div>
	);
}

export { Dashboard };
