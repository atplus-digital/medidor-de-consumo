import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EnergyLog } from "@/db/schema";

interface EnergyTablePaginationProps {
	table: Table<EnergyLog>;
	total: number;
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}

function EnergyTablePagination({
	table,
	total,
	page,
	pageSize,
	onPageChange,
}: EnergyTablePaginationProps) {
	const totalPages = table.getPageCount();

	if (totalPages <= 1) return null;

	const from = (page - 1) * pageSize + 1;
	const to = Math.min(page * pageSize, total);

	return (
		<div className="flex items-center justify-between">
			<p className="text-sm text-muted-foreground">
				Mostrando {from} a {to} de {total} registros
			</p>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						table.previousPage();
						onPageChange(page - 1);
					}}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft className="size-4" />
					Anterior
				</Button>
				<span className="text-sm text-muted-foreground">
					Página {page} de {totalPages}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						table.nextPage();
						onPageChange(page + 1);
					}}
					disabled={!table.getCanNextPage()}
				>
					Próxima
					<ChevronRight className="size-4" />
				</Button>
			</div>
		</div>
	);
}

export { EnergyTablePagination };
