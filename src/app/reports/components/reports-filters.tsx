import { DateRangePicker } from "@/components/filters/date-range-picker";
import { MeterSelect } from "@/components/filters/meter-select";
import { useReports } from "@/app/reports/context/reports-context";

function ReportsFilters() {
	const { filters, setStartDate, setEndDate, setMeterId, meterIds } =
		useReports();

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
		</div>
	);
}

export { ReportsFilters };
