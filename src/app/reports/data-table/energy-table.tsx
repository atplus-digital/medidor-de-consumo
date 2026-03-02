import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EnergyLog } from "@/db/schema";
import { ColumnVisibilitySelect } from "./colum-visibility-select";
import { columns } from "./columns";
import { EnergyTableBody } from "./energy-table-body";
import { EnergyTablePagination } from "./energy-table-pagination";

interface EnergyTableProps {
	logs: EnergyLog[];
	total?: number;
	page?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
	isLoading?: boolean;
}

function EnergyTable({
	logs,
	total = 0,
	page = 1,
	pageSize = 20,
	onPageChange,
	isLoading,
}: EnergyTableProps) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		voltage: false,
		current: false,
		powerFactor: false,
		frequency: false,
	});

	const table = useReactTable<EnergyLog>({
		data: logs,
		columns,
		pageCount: Math.ceil(total / pageSize),
		state: {
			pagination: {
				pageIndex: page - 1,
				pageSize,
			},
			columnVisibility,
		},
		manualPagination: true,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
	});

	if (isLoading) {
		return (
			<div className="space-y-3">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<ColumnVisibilitySelect table={table} />
			<div className="overflow-auto rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<EnergyTableBody table={table} />
				</Table>
			</div>

			<EnergyTablePagination
				table={table}
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={onPageChange ?? (() => {})}
			/>
		</div>
	);
}

export { EnergyTable };
