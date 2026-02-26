import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

	const commonXAxis = (
		<XAxis
			dataKey={xAxisKey}
			tick={{ fontSize: 12 }}
			tickLine={false}
			axisLine={false}
		/>
	);

	const commonYAxis = (
		<YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
	);

	const commonGrid = (
		<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
	);

	const commonTooltip = (
		<Tooltip
			contentStyle={{
				backgroundColor: "hsl(var(--card))",
				border: "1px solid hsl(var(--border))",
				borderRadius: "8px",
				fontSize: "12px",
				color: "hsl(var(--foreground))",
			}}
			labelStyle={{ color: "hsl(var(--foreground))" }}
		/>
	);

	const commonLegend = <Legend wrapperStyle={{ fontSize: "12px" }} />;

	const renderChart = () => {
		const margin = { top: 5, right: 20, left: 10, bottom: 5 };

		switch (type) {
			case "area":
				return (
					<AreaChart data={data} margin={margin}>
						{commonGrid}
						{commonXAxis}
						{commonYAxis}
						{commonTooltip}
						{commonLegend}
						{dataKeys.map(dk => (
							<Area
								key={dk.key}
								type="monotone"
								dataKey={dk.key}
								name={dk.label}
								stroke={dk.color}
								fill={dk.color}
								fillOpacity={0.2}
								strokeWidth={2}
							/>
						))}
					</AreaChart>
				);
			case "bar":
				return (
					<BarChart data={data} margin={margin}>
						{commonGrid}
						{commonXAxis}
						{commonYAxis}
						{commonTooltip}
						{commonLegend}
						{dataKeys.map(dk => (
							<Bar
								key={dk.key}
								dataKey={dk.key}
								name={dk.label}
								fill={dk.color}
								radius={[4, 4, 0, 0]}
							/>
						))}
					</BarChart>
				);
			case "line":
				return (
					<LineChart data={data} margin={margin}>
						{commonGrid}
						{commonXAxis}
						{commonYAxis}
						{commonTooltip}
						{commonLegend}
						{dataKeys.map(dk => (
							<Line
								key={dk.key}
								type="monotone"
								dataKey={dk.key}
								name={dk.label}
								stroke={dk.color}
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
				<ResponsiveContainer width="100%" height={height}>
					{renderChart()}
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export { ConsumptionChart };
export type { ConsumptionChartProps, ChartType };
