import { FileDown, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { EnergyLog, EnergyStats } from "@/db/schema";
import { exportToCsv, exportToPdf } from "@/services/export";

interface ExportButtonsProps {
	logs: EnergyLog[];
	stats?: EnergyStats | null;
	filename?: string;
	periodLabel?: string;
	meterLabel?: string;
}

function ExportButtons({
	logs,
	stats,
	filename,
	periodLabel,
	meterLabel,
}: ExportButtonsProps) {
	const [exporting, setExporting] = useState<"pdf" | "csv" | null>(null);

	const handleExportPdf = async () => {
		setExporting("pdf");
		try {
			await exportToPdf({ logs, stats, filename, periodLabel, meterLabel });
		} finally {
			setExporting(null);
		}
	};

	const handleExportCsv = () => {
		setExporting("csv");
		try {
			exportToCsv({ logs, stats, filename, periodLabel, meterLabel });
		} finally {
			setExporting(null);
		}
	};

	return (
		<div className="flex items-center gap-2 ml-auto">
			<Button
				variant="outline"
				size="sm"
				onClick={handleExportPdf}
				disabled={logs.length === 0 || exporting !== null}
			>
				<FileDown className="mr-2 size-4" />
				{exporting === "pdf" ? "Exportando..." : "PDF"}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={handleExportCsv}
				disabled={logs.length === 0 || exporting !== null}
			>
				<FileSpreadsheet className="mr-2 size-4" />
				{exporting === "csv" ? "Exportando..." : "CSV"}
			</Button>
		</div>
	);
}

export { ExportButtons };
