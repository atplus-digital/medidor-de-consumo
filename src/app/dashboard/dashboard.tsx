import { ConsumptionChart } from "@/app/charts/components/consumption-chart";
import { RealTimeReading } from "@/app/dashboard/components/real-time-reading";
import {
	DashboardProvider,
	useDashboard,
} from "@/app/dashboard/context/dashboard-context";
import { DashboardHeader } from "./components/dashboard-header";
import { Stats } from "./components/stats/stats";

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
