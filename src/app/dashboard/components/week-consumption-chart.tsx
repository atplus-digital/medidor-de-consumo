import { ConsumptionChart } from "@/app/charts/components/consumption-chart";
import { useDashboard } from "../context/use-dashboard";

function WeekConsumptionChart() {
	const { dailyData, isLoadingChart } = useDashboard();

	return (
		<ConsumptionChart
			title="Consumo dos Últimos 7 Dias"
			data={dailyData}
			dataKeys={[
				{
					key: "totalConsumed",
					label: "Consumo (Wh)",
					color: "var(--chart-1)",
				},
				{
					key: "totalGenerated",
					label: "Geração (Wh)",
					color: "var(--chart-5)",
				},
			]}
			type="area"
			isLoading={isLoadingChart}
		/>
	);
}

export { WeekConsumptionChart };
