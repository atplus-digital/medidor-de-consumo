import { createContext } from "react";
import type { ConsumptionData, EnergyLog, EnergyStats } from "@/db/schema";

export interface DashboardContextType {
	meters: Array<{ id: string; meterName: string }>;
	isLoadingMeterIds: boolean;
	latestReading?: EnergyLog | null;
	isLoadingReading: boolean;
	refetchReading: () => void;
	dailyData: ConsumptionData[];
	isLoadingChart: boolean;
	stats: EnergyStats | undefined;
	isLoadingStats: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined,
);

export { DashboardContext };
