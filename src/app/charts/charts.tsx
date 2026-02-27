import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getConsumptionByPeriod, getMeterIds } from "@/api/energy-client";
import {
	type ChartType,
	ConsumptionChart,
} from "@/components/charts/consumption-chart";
import { DateRangePicker } from "@/components/filters/date-range-picker";
import { MeterSelect } from "@/components/filters/meter-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";

type Period = "daily" | "weekly" | "monthly";

const periodLabels: Record<Period, string> = {
	daily: "Diário",
	weekly: "Semanal",
	monthly: "Mensal",
};

function Charts() {
	const { filters, setStartDate, setEndDate, setMeterId } = useEnergyFilters();
	const [period, setPeriod] = useState<Period>("daily");
	const [chartType, setChartType] = useState<ChartType>("area");

	const { data: meterIds = [] } = useQuery({
		queryKey: ["meter-ids"],
		queryFn: () => getMeterIds(),
	});

	const { data: consumptionData = [], isLoading } = useQuery({
		queryKey: [
			"consumption-by-period",
			period,
			filters.startDate?.toISOString(),
			filters.endDate?.toISOString(),
			filters.meterId,
		],
		queryFn: () =>
			getConsumptionByPeriod(
				period,
				filters.startDate?.toISOString(),
				filters.endDate?.toISOString(),
				filters.meterId,
			),
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Gráficos</h1>
				<p className="text-muted-foreground">
					Visualização interativa do consumo de energia
				</p>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-4">
				<DateRangePicker
					startDate={filters.startDate}
					endDate={filters.endDate}
					onStartDateChange={setStartDate}
					onEndDateChange={setEndDate}
				/>
				<MeterSelect
					meters={meterIds}
					value={filters.meterId}
					onChange={setMeterId}
				/>
				<Select
					value={chartType}
					onValueChange={(val) => setChartType(val as ChartType)}
				>
					<SelectTrigger className="w-32">
						<SelectValue placeholder="Tipo de gráfico" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="area">Área</SelectItem>
						<SelectItem value="bar">Barras</SelectItem>
						<SelectItem value="line">Linha</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Period Tabs */}
			<Tabs value={period} onValueChange={(val) => setPeriod(val as Period)}>
				<TabsList>
					{(Object.entries(periodLabels) as [Period, string][]).map(
						([key, label]) => (
							<TabsTrigger key={key} value={key}>
								{label}
							</TabsTrigger>
						),
					)}
				</TabsList>

				{(Object.keys(periodLabels) as Period[]).map((p) => (
					<TabsContent key={p} value={p} className="space-y-6">
						{/* Consumption Chart */}
						<ConsumptionChart
							title={`Consumo ${periodLabels[p]}`}
							data={consumptionData}
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
							type={chartType}
							isLoading={isLoading}
							height={400}
						/>

						{/* Power Chart */}
						<ConsumptionChart
							title={`Potência ${periodLabels[p]}`}
							data={consumptionData}
							dataKeys={[
								{
									key: "avgActivePower",
									label: "Pot. Média (W)",
									color: "hsl(var(--chart-3))",
								},
								{
									key: "maxActivePower",
									label: "Pot. Máxima (W)",
									color: "hsl(var(--chart-4))",
								},
							]}
							type="line"
							isLoading={isLoading}
							height={350}
						/>

						{/* Voltage Chart */}
						<ConsumptionChart
							title={`Tensão Média ${periodLabels[p]}`}
							data={consumptionData}
							dataKeys={[
								{
									key: "avgVoltage",
									label: "Tensão (V)",
									color: "hsl(var(--chart-5))",
								},
							]}
							type="line"
							isLoading={isLoading}
							height={300}
						/>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}

export { Charts };
