import { ReportsFilters } from "@/app/reports/components/reports-filters";
import { ReportsHeader } from "@/app/reports/components/reports-header";
import { ReportsQualityAnalysis } from "@/app/reports/components/reports-quality-analysis";
import { ReportsStats } from "@/app/reports/components/reports-stats";
import {
	ReportsProvider,
	useReports,
} from "@/app/reports/context/reports-context";
import { EnergyTable } from "@/app/reports/data-table/energy-table";
import { Separator } from "@/components/ui/separator";

function ReportsContent() {
	const {
		logs,
		total,
		page,
		setPage,
		pageSize,
		isLoadingLogs,
		isFetching,
		isPlaceholderData,
	} = useReports();

	return (
		<div className="space-y-6">
			<ReportsHeader />
			<ReportsFilters />
			<ReportsStats />
			<ReportsQualityAnalysis />
			<Separator />
			<EnergyTable
				logs={logs}
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				isLoading={isLoadingLogs}
				isPlaceholderData={isPlaceholderData}
				isFetching={isFetching}
			/>
		</div>
	);
}

function Reports() {
	return (
		<ReportsProvider>
			<ReportsContent />
		</ReportsProvider>
	);
}

export { Reports };
