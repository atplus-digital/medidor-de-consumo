import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";
import type { EnergyLog, EnergyStats } from "@/db/schema";
import {
	getEnergyLogsFn,
	getEnergyMetersFn,
	getEnergyStatsFn,
} from "@/server/energy";

const PAGE_SIZE = 10;

interface ReportsContextValue {
	// Filters
	filters: {
		startDate: Date | undefined;
		endDate: Date | undefined;
		meterId: string | undefined;
	};
	setStartDate: (date: Date | undefined) => void;
	setEndDate: (date: Date | undefined) => void;
	setMeterId: (id: string | undefined) => void;

	// Pagination
	page: number;
	setPage: (page: number) => void;
	pageSize: number;

	// Data
	meterIds: Array<{ id: string; meterName: string }>;
	logs: EnergyLog[];
	total: number;
	stats?: EnergyStats | null;

	// Loading states
	isLoadingMeters: boolean;
	isLoadingLogs: boolean;
	isLoadingStats: boolean;
	isPlaceholderData: boolean;
	isFetching: boolean;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(
	undefined,
);

function ReportsProvider({ children }: { children: React.ReactNode }) {
	const { filters, setStartDate, setEndDate, setMeterId } = useEnergyFilters();
	const [page, setPage] = useState(1);

	const { data: meterIds = [], isLoading: isLoadingMeters } = useQuery({
		queryKey: ["meter-ids"],
		queryFn: () => getEnergyMetersFn(),
	});

	const {
		data: logsData,
		isLoading: isLoadingLogs,
		isPlaceholderData,
		isFetching,
		
	} = useQuery({
		queryKey: [
			"energy-logs",
			filters.startDate?.toISOString(),
			filters.endDate?.toISOString(),
			filters.meterId,
			page,
		],
		queryFn: () =>
			getEnergyLogsFn({
				data: {
					startDate: filters.startDate?.toISOString(),
					endDate: filters.endDate?.toISOString(),
					meterId: filters.meterId,
					limit: PAGE_SIZE,
					offset: (page - 1) * PAGE_SIZE,
				},
			}),
		placeholderData: (prev) => prev,
	});

	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: [
			"energy-stats-reports",
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

	const handleSetStartDate = (date: Date | undefined) => {
		setStartDate(date);
		setPage(1);
	};

	const handleSetEndDate = (date: Date | undefined) => {
		setEndDate(date);
		setPage(1);
	};

	const handleSetMeterId = (id: string | undefined) => {
		setMeterId(id);
		setPage(1);
	};

	const value: ReportsContextValue = {
		filters,
		setStartDate: handleSetStartDate,
		setEndDate: handleSetEndDate,
		setMeterId: handleSetMeterId,
		page,
		setPage,
		pageSize: PAGE_SIZE,
		meterIds,
		logs: logsData?.logs ?? [],
		total: logsData?.total ?? 0,
		stats,
		isLoadingMeters,
		isPlaceholderData,
		isFetching,
		isLoadingLogs,
		isLoadingStats,
	};

	return (
		<ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
	);
}

function useReports() {
	const context = useContext(ReportsContext);
	if (!context) {
		throw new Error("useReports must be used within ReportsProvider");
	}
	return context;
}

export { ReportsProvider, useReports };
