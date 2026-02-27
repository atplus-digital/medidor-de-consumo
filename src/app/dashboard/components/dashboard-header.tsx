import { RefreshCwIcon } from "lucide-react";
import { useDashboard } from "@/app/dashboard/context/dashboard-context";
import { MeterSelect } from "@/components/filters/meter-select";
import { Button } from "@/components/ui/button";
import { useEnergyFilters } from "@/contexts/energy-filters-context/energy-filters-context";

function DashboardHeader() {
	const { meters, refetchReading } = useDashboard();
	const { filters, setMeterId } = useEnergyFilters();

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Visão geral do consumo de energia
				</p>
			</div>
			<div className="flex items-center gap-2">
				<MeterSelect
					meters={meters}
					value={filters.meterId}
					onChange={setMeterId}
				/>
				<Button variant="outline" size="sm" onClick={() => refetchReading()}>
					<RefreshCwIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}

export { DashboardHeader };
