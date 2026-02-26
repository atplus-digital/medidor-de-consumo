import { useQuery } from "@tanstack/react-query";
import { Activity, Hash, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/app/dashboard/components/stat-card";
import { EnergyTable } from "@/app/reports/data-table/energy-table";
import { ExportButtons } from "@/app/reports/export/export-buttons";
import { DateRangePicker } from "@/components/filters/date-range-picker";
import { MeterSelect } from "@/components/filters/meter-select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";
import {
	getEnergyLogs,
	getEnergyStats,
	getMeterIds,
} from "@/lib/energy-client";
import { formatNumber } from "@/lib/format";

const PAGE_SIZE = 20;

function Reports() {
	const { filters, setStartDate, setEndDate, setMeterId } = useEnergyFilters();
	const [page, setPage] = useState(1);

	const { data: meterIds = [] } = useQuery({
		queryKey: ["meter-ids"],
		queryFn: () => getMeterIds(),
	});

	const { data: logsData, isLoading: isLoadingLogs } = useQuery({
		queryKey: [
			"energy-logs",
			filters.startDate?.toISOString(),
			filters.endDate?.toISOString(),
			filters.meterId,
			page,
		],
		queryFn: () =>
			getEnergyLogs(
				filters.startDate?.toISOString(),
				filters.endDate?.toISOString(),
				filters.meterId,
				PAGE_SIZE,
				(page - 1) * PAGE_SIZE,
			),
	});

	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: [
			"energy-stats-reports",
			filters.startDate?.toISOString(),
			filters.endDate?.toISOString(),
			filters.meterId,
		],
		queryFn: () =>
			getEnergyStats(
				filters.startDate?.toISOString(),
				filters.endDate?.toISOString(),
				filters.meterId,
			),
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
					<p className="text-muted-foreground">
						Dados detalhados e exportação de relatórios
					</p>
				</div>
				<ExportButtons
					logs={logsData?.logs ?? []}
					filename="relatorio-energia"
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-4">
				<DateRangePicker
					startDate={filters.startDate}
					endDate={filters.endDate}
					onStartDateChange={date => {
						setStartDate(date);
						setPage(1);
					}}
					onEndDateChange={date => {
						setEndDate(date);
						setPage(1);
					}}
				/>
				<MeterSelect
					meters={meterIds}
					value={filters.meterId}
					onChange={id => {
						setMeterId(id);
						setPage(1);
					}}
				/>
			</div>

			{/* Summary Stats */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{isLoadingStats ? (
					<>
						<Skeleton className="h-28" />
						<Skeleton className="h-28" />
						<Skeleton className="h-28" />
						<Skeleton className="h-28" />
					</>
				) : (
					<>
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
					</>
				)}
			</div>

			<Separator />

			{/* Data Table */}
			<EnergyTable
				logs={logsData?.logs ?? []}
				total={logsData?.total ?? 0}
				page={page}
				pageSize={PAGE_SIZE}
				onPageChange={setPage}
				isLoading={isLoadingLogs}
			/>
		</div>
	);
}

export { Reports };
