import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "../ui/chart";
import { Skeleton } from "../ui/skeleton";

type ChartType = "area" | "bar" | "line";

interface ConsumptionChartProps {
	title: string;
	data: Record<string, unknown>[];
	dataKeys: {
		key: string;
		label: string;
		color: string;
	}[];
	xAxisKey?: string;
	type?: ChartType;
	isLoading?: boolean;
	height?: number;
}

function ConsumptionChart({
	title,
	data,
	dataKeys,
	xAxisKey = "date",
	type = "area",
	isLoading,
	height = 350,
}: ConsumptionChartProps) {
	// Create chart configuration from dataKeys
	const chartConfig = dataKeys.reduce(
		(acc, dk) => ({
			// biome-ignore lint/performance/noAccumulatingSpread: This is a common pattern for building config objects from arrays.
			...acc,
			[dk.key]: {
				label: dk.label,
				color: dk.color,
			},
		}),
		{} as ChartConfig,
	);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-5 w-48" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className="w-full" style={{ height }} />
				</CardContent>
			</Card>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent
					className="flex items-center justify-center"
					style={{ height }}
				>
					<p className="text-muted-foreground">
						Sem dados para o período selecionado
					</p>
				</CardContent>
			</Card>
		);
	}

	const renderChart = () => {
		const margin = { top: 5, right: 20, left: 0, bottom: 0 };

		switch (type) {
			case "area":
				return (
					<AreaChart data={data} margin={margin}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey={xAxisKey} />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						{dataKeys.map((dk) => (
							<Area
								key={dk.key}
								type="monotone"
								dataKey={dk.key}
								fill={`var(--color-${dk.key})`}
								stroke={`var(--color-${dk.key})`}
								fillOpacity={0.2}
								strokeWidth={2}
							/>
						))}
					</AreaChart>
				);
			case "bar":
				return (
					<BarChart data={data} margin={margin}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey={xAxisKey} />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						{dataKeys.map((dk) => (
							<Bar
								key={dk.key}
								dataKey={dk.key}
								fill={`var(--color-${dk.key})`}
								radius={[4, 4, 0, 0]}
							/>
						))}
					</BarChart>
				);
			case "line":
				return (
					<LineChart data={data} margin={margin}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey={xAxisKey} />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						{dataKeys.map((dk) => (
							<Line
								key={dk.key}
								type="monotone"
								dataKey={dk.key}
								stroke={`var(--color-${dk.key})`}
								strokeWidth={2}
								dot={{ r: 3 }}
								activeDot={{ r: 5 }}
							/>
						))}
					</LineChart>
				);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className="w-full"
					style={{ height }}
				>
					{renderChart()}
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export { ConsumptionChart };
export type { ConsumptionChartProps, ChartType };
