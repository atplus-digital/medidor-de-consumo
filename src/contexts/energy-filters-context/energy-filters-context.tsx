import { subDays } from "date-fns";
import { createContext, type ReactNode, useContext, useState } from "react";

interface EnergyFilters {
	startDate: Date | undefined;
	endDate: Date | undefined;
	meterId: string | undefined;
}

interface EnergyFiltersContextType {
	filters: EnergyFilters;
	setStartDate: (date: Date | undefined) => void;
	setEndDate: (date: Date | undefined) => void;
	setMeterId: (id: string | undefined) => void;
	setDateRange: (start: Date | undefined, end: Date | undefined) => void;
	resetFilters: () => void;
}

function getDefaultFilters(): EnergyFilters {
	return {
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
		meterId: undefined,
	};
}

const EnergyFiltersContext = createContext<EnergyFiltersContextType | null>(
	null,
);

function EnergyFiltersProvider({ children }: { children: ReactNode }) {
	const [filters, setFilters] = useState<EnergyFilters>(getDefaultFilters);

	const setStartDate = (date: Date | undefined) =>
		setFilters(prev => ({ ...prev, startDate: date }));

	const setEndDate = (date: Date | undefined) =>
		setFilters(prev => ({ ...prev, endDate: date }));

	const setMeterId = (id: string | undefined) =>
		setFilters(prev => ({ ...prev, meterId: id }));

	const setDateRange = (start: Date | undefined, end: Date | undefined) =>
		setFilters(prev => ({ ...prev, startDate: start, endDate: end }));

	const resetFilters = () => setFilters(getDefaultFilters());

	return (
		<EnergyFiltersContext
			value={{
				filters,
				setStartDate,
				setEndDate,
				setMeterId,
				setDateRange,
				resetFilters,
			}}
		>
			{children}
		</EnergyFiltersContext>
	);
}

function useEnergyFilters() {
	const context = useContext(EnergyFiltersContext);
	if (!context) {
		throw new Error(
			"useEnergyFilters must be used within EnergyFiltersProvider",
		);
	}
	return context;
}

export { EnergyFiltersProvider, useEnergyFilters };
