import { flexRender, type Table } from "@tanstack/react-table";
import {
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import type { EnergyLog } from "@/db/schema";

interface EnergyTableBodyProps {
	table: Table<EnergyLog>;
}

function EnergyTableBody({ table }: EnergyTableBodyProps) {
	const rows = table.getRowModel().rows;

	if (rows.length === 0) {
		return (
			<TableBody>
				<TableRow>
					<TableCell
						colSpan={table.getAllColumns().length}
						className="py-8 text-center text-muted-foreground"
					>
						Nenhum registro encontrado
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	return (
		<TableBody>
			{rows.map((row) => (
				<TableRow key={row.id}>
					{row.getVisibleCells().map((cell) => (
						<TableCell key={cell.id}>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	);
}

export { EnergyTableBody };
