import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { createContext, useContext } from "react";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";
import type { ConsumptionData, EnergyLog, EnergyStats } from "@/db/schema";
import {
	getConsumptionByPeriodFn,
	getEnergyMetersFn,
	getEnergyStatsFn,
	getLatestReadingFn,
} from "@/server/energy";

interface DashboardContextType {
	// Meter Data
	meters: Array<{ id: string; meterName: string }>;
	isLoadingMeterIds: boolean;

	// Latest Reading
	latestReading?: EnergyLog | null;
	isLoadingReading: boolean;
	refetchReading: () => void;

	// Daily Consumption
	dailyData: ConsumptionData[];
	isLoadingChart: boolean;

	// Stats
	stats: EnergyStats | undefined;
	isLoadingStats: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined,
);

function DashboardProvider({ children }: { children: React.ReactNode }) {
	const { filters } = useEnergyFilters();

	// Meter IDs
	const { data: meters = [], isLoading: isLoadingMeterIds } = useQuery({
		queryKey: ["meter-ids"],
		queryFn: () => getEnergyMetersFn(),
	});

	// Latest Reading
	const {
		data: latestReading,
		isLoading: isLoadingReading,
		refetch: refetchReading,
	} = useQuery({
		queryKey: ["latest-reading", filters.meterId],
		queryFn: () => getLatestReadingFn({ data: { meterId: filters.meterId } }),
		refetchInterval: 10000,
	});

	// Daily Consumption
	const { data: dailyData = [], isLoading: isLoadingChart } = useQuery({
		queryKey: ["daily-consumption-dashboard", filters.meterId],
		queryFn: () =>
			getConsumptionByPeriodFn({
				data: {
					period: "daily",
					startDate: subDays(new Date(), 7).toISOString(),
					endDate: new Date().toISOString(),
					meterId: filters.meterId,
				},
			}),
	});

	// Stats
	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: ["energy-stats", filters.meterId],
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
				latestReading: latestReading,
				isLoadingReading,
				refetchReading: () => refetchReading(),
				dailyData,
				isLoadingChart,
				stats,
				isLoadingStats,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
}

function useDashboard(): DashboardContextType {
	const context = useContext(DashboardContext);
	if (context === undefined) {
		throw new Error("useDashboard must be used within a DashboardProvider");
	}
	return context;
}

export { DashboardProvider, useDashboard, DashboardContext };
