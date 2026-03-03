import { useReports } from "@/app/reports/context/reports-context";
import { DateRangePicker } from "@/components/filters/date-range-picker";
import { MeterSelect } from "@/components/filters/meter-select";
import { formatDate } from "@/lib/format";
import { ExportButtons } from "./export-buttons";

function ReportsFilters() {
	const {
		filters,
		logs,
		stats,
		setStartDate,
		setEndDate,
		setMeterId,
		meterIds,
	} = useReports();

	const periodLabel =
		filters.startDate && filters.endDate
			? `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
			: undefined;

	const selectedMeter = meterIds.find((m) => m.id === filters.meterId);
	const meterLabel = selectedMeter?.meterName ?? "Todos os medidores";

	return (
		<div className="flex flex-wrap items-center gap-4">
			<DateRangePicker
				startDate={filters.startDate}
				endDate={filters.endDate}
				onStartDateChange={setStartDate}
				onEndDateChange={setEndDate}
			/>
			<MeterSelect
				meters={meterIds}
				value={filters.meterId}
				onChange={setMeterId}
			/>
			<ExportButtons
				logs={logs}
				stats={stats}
				filename="relatorio-energia"
				periodLabel={periodLabel}
				meterLabel={meterLabel}
			/>
		</div>
	);
}

export { ReportsFilters };
