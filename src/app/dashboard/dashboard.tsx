import { ConsumptionChart } from "@/components/charts/consumption-chart";
import { RealTimeReading } from "@/app/dashboard/components/real-time-reading";
import { Stats } from "./components/stats/stats";
import { DashboardHeader } from "./components/dashboard-header";
import {
	DashboardProvider,
	useDashboard,
} from "@/app/dashboard/context/dashboard-context";

function DashboardContent() {
	const { dailyData, isLoadingChart } = useDashboard();

	return (
		<div className="space-y-6">
			<DashboardHeader />
			<Stats />
			<RealTimeReading />
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

function Dashboard() {
	return (
		<DashboardProvider>
			<DashboardContent />
		</DashboardProvider>
	);
}

export { Dashboard };
