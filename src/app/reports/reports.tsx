import {
	ReportsProvider,
	useReports,
} from "@/app/reports/context/reports-context";
import { ReportsHeader } from "@/app/reports/components/reports-header";
import { ReportsFilters } from "@/app/reports/components/reports-filters";
import { ReportsStats } from "@/app/reports/components/reports-stats";
import { EnergyTable } from "@/app/reports/data-table/energy-table";
import { Separator } from "@/components/ui/separator";

function ReportsContent() {
	const { logs, total, page, setPage, pageSize, isLoadingLogs } = useReports();

	return (
		<div className="space-y-6">
			<ReportsHeader />
			<ReportsFilters />
			<ReportsStats />
			<Separator />
			<EnergyTable
				logs={logs}
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				isLoading={isLoadingLogs}
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
