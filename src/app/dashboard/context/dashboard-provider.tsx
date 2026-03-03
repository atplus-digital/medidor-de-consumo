import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";
import {
	getConsumptionByPeriodFn,
	getEnergyMetersFn,
	getEnergyStatsFn,
	getLatestReadingFn,
} from "@/server/energy";
import { DashboardContext } from "./dashboard-context";

function DashboardProvider({ children }: { children: React.ReactNode }) {
	const { filters } = useEnergyFilters();

	const { data: meters = [], isLoading: isLoadingMeterIds } = useQuery({
		queryKey: ["meter-ids"],
		queryFn: () => getEnergyMetersFn(),
	});

	const {
		data: latestReading,
		isLoading: isLoadingReading,
		refetch: refetchReading,
	} = useQuery({
		queryKey: ["latest-reading", filters.meterId],
		queryFn: () => getLatestReadingFn({ data: { meterId: filters.meterId } }),
		refetchInterval: 10000,
	});

	const { data: consumptionResult, isLoading: isLoadingChart } = useQuery({
		queryKey: ["daily-consumption-dashboard", filters.meterId, new Date().toDateString()],
		queryFn: () =>
			getConsumptionByPeriodFn({
				data: {
					startDate: subDays(new Date(), 7).toISOString(),
					endDate: new Date().toISOString(),
					meterId: filters.meterId,
				},
			}),
	});

	const dailyData = consumptionResult?.data ?? [];

	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: [
			"energy-stats",
			filters.startDate?.toISOString(),
			filters.endDate?.toISOString(),
			filters.meterId,
		],
		queryFn: () =>
			getEnergyStatsFn({
				data: {
					startDate: filters.startDate?.toISOString(),
					endDate: filters.endDate?.toISOString(),
					meterId: filters.meterId,
				},
			}),
	});

	return (
		<DashboardContext.Provider
			value={{
				meters,
				isLoadingMeterIds,
				latestReading,
				isLoadingReading,
				refetchReading,
				dailyData,
				isLoadingChart,
				stats: stats ?? undefined,
				isLoadingStats,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
}
export { DashboardProvider };
