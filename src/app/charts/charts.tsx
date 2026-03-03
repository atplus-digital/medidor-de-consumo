import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	type ChartType,
	ConsumptionChart,
} from "@/app/charts/components/consumption-chart";
import { DateRangePicker } from "@/components/filters/date-range-picker";
import { MeterSelect } from "@/components/filters/meter-select";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";
import { getConsumptionByPeriodFn, getEnergyMetersFn } from "@/server/energy";

function Charts() {
	const { filters, setStartDate, setEndDate, setMeterId } = useEnergyFilters();
	const [chartType, setChartType] = useState<ChartType>("area");

	const { data: meterIds = [] } = useQuery({
		queryKey: ["meter-ids"],
		queryFn: () => getEnergyMetersFn(),
	});

	const { data: consumptionResult, isLoading } = useQuery({
		queryKey: [
			"consumption-by-period",
			filters.startDate?.toISOString(),
			filters.endDate?.toISOString(),
			filters.meterId,
		],
		queryFn: () =>
			getConsumptionByPeriodFn({
				data: {
					startDate: filters.startDate?.toISOString(),
					endDate: filters.endDate?.toISOString(),
					meterId: filters.meterId,
				},
			}),
	});

	const consumptionData = consumptionResult?.data ?? [];
	const intervalLabel = consumptionResult?.intervalLabel ?? "";

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Gráficos</h1>
					<p className="text-muted-foreground">
						Visualização interativa do consumo de energia
					</p>
				</div>
				{intervalLabel && (
					<Badge variant="secondary">Intervalo: {intervalLabel}</Badge>
				)}
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

			{/* Charts */}
			<div className="space-y-6">
				{/* Consumption Chart */}
				<ConsumptionChart
					title={`Consumo por ${intervalLabel}`}
					data={consumptionData}
					dataKeys={[
						{
							key: "totalConsumed",
							label: "Consumo (kWh)",
							color: "var(--chart-1)",
						},
						{
							key: "totalGenerated",
							label: "Geração (kWh)",
							color: "var(--chart-2)",
						},
					]}
					type={chartType}
					isLoading={isLoading}
					height={400}
				/>

				{/* Energy Balance Chart */}
				<ConsumptionChart
					title={`Balanço Energético por ${intervalLabel}`}
					data={consumptionData}
					dataKeys={[
						{
							key: "energyBalance",
							label: "Balanço (kWh)",
							color: "var(--chart-3)",
						},
					]}
					type="bar"
					isLoading={isLoading}
					height={300}
				/>

				{/* Power Chart */}
				<ConsumptionChart
					title={`Potência por ${intervalLabel}`}
					data={consumptionData}
					dataKeys={[
						{
							key: "avgActivePower",
							label: "Pot. Média (W)",
							color: "var(--chart-3)",
						},
						{
							key: "maxActivePower",
							label: "Pot. Máxima (W)",
							color: "var(--chart-4)",
						},
					]}
					type="line"
					isLoading={isLoading}
					height={350}
				/>

				{/* Voltage Chart */}
				<ConsumptionChart
					title={`Tensão por ${intervalLabel}`}
					data={consumptionData}
					dataKeys={[
						{
							key: "avgVoltage",
							label: "Tensão Média (V)",
							color: "var(--chart-5)",
						},
						{
							key: "minVoltage",
							label: "Tensão Mín. (V)",
							color: "var(--chart-4)",
						},
						{
							key: "maxVoltage",
							label: "Tensão Máx. (V)",
							color: "var(--chart-1)",
						},
					]}
					type="line"
					isLoading={isLoading}
					height={300}
				/>

				{/* Current Chart */}
				<ConsumptionChart
					title={`Corrente Média por ${intervalLabel}`}
					data={consumptionData}
					dataKeys={[
						{
							key: "avgCurrent",
							label: "Corrente (A)",
							color: "var(--chart-2)",
						},
					]}
					type="line"
					isLoading={isLoading}
					height={280}
				/>

				{/* Power Factor Chart */}
				<ConsumptionChart
					title={`Fator de Potência por ${intervalLabel}`}
					data={consumptionData}
					dataKeys={[
						{
							key: "avgPowerFactor",
							label: "FP Médio",
							color: "var(--chart-1)",
						},
					]}
					type="line"
					isLoading={isLoading}
					height={280}
				/>

				{/* Frequency Chart */}
				<ConsumptionChart
					title={`Frequência por ${intervalLabel}`}
					data={consumptionData}
					dataKeys={[
						{
							key: "avgFrequency",
							label: "Frequência (Hz)",
							color: "var(--chart-3)",
						},
					]}
					type="line"
					isLoading={isLoading}
					height={250}
				/>
			</div>
		</div>
	);
}

export { Charts };
