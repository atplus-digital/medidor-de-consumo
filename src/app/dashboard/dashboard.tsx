import { MeterResets } from "@/app/dashboard/components/meter-resets";
import { RealTimeReading } from "@/app/dashboard/components/real-time-reading/real-time-reading";
import { DashboardProvider } from "@/app/dashboard/context/dashboard-provider";
import { DashboardHeader } from "./components/dashboard-header";
import { Stats } from "./components/stats/stats";
import { WeekConsumptionChart } from "./components/week-consumption-chart";

function Dashboard() {
	return (
		<DashboardProvider>
			<div className="space-y-4 pb-32">
				<DashboardHeader />
				<Stats />
				<RealTimeReading />
				<WeekConsumptionChart />
				<MeterResets />
			</div>
		</DashboardProvider>
	);
}

export { Dashboard };
