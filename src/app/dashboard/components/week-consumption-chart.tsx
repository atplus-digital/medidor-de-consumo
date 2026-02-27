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
	);
}

export { WeekConsumptionChart };
