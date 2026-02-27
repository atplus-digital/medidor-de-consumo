import { RealTimeReading } from "@/app/dashboard/components/real-time-reading/real-time-reading";
import { DashboardProvider } from "@/app/dashboard/context/dashboard-provider";
import { WeekConsumptionChart } from "./components/week-consumption-chart";
import { DashboardHeader } from "./components/dashboard-header";
import { Stats } from "./components/stats/stats";

function Dashboard() {
	return (
		<DashboardProvider>
			<div className="space-y-4 pb-32">
				<DashboardHeader />
				<Stats />
				<RealTimeReading />
				<WeekConsumptionChart />
			</div>
		</DashboardProvider>
	);
}

export { Dashboard };
