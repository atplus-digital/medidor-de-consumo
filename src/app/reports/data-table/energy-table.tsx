import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { EnergyLog } from "@/db/schema";
import { formatDateTime, formatNumber } from "@/lib/format";

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
	const totalPages = Math.ceil(total / pageSize);

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
			<div className="overflow-auto rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">ID</TableHead>
							<TableHead>Medidor</TableHead>
							<TableHead className="text-right">Pot. Ativa (W)</TableHead>
							<TableHead className="text-right">Tensão (V)</TableHead>
							<TableHead className="text-right">Corrente (A)</TableHead>
							<TableHead className="text-right">FP</TableHead>
							<TableHead className="text-right">Freq. (Hz)</TableHead>
							<TableHead className="text-right">Consumo (kWh)</TableHead>
							<TableHead className="text-right">Geração (kWh)</TableHead>
							<TableHead>Data/Hora</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{logs.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={10}
									className="py-8 text-center text-muted-foreground"
								>
									Nenhum registro encontrado
								</TableCell>
							</TableRow>
						) : (
							logs.map(log => (
								<TableRow key={log.id}>
									<TableCell className="font-mono text-xs">{log.id}</TableCell>
									<TableCell>
										<Badge variant="outline">{log.meterId}</Badge>
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(log.activePower)}
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(log.voltage, 1)}
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(log.current, 3)}
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(log.powerFactor, 3)}
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(log.frequency, 1)}
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(log.consumedEnergy, 4)}
									</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(log.generatedEnergy, 4)}
									</TableCell>
									<TableCell className="text-xs">
										{log.createdAt ? formatDateTime(log.createdAt) : "-"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Mostrando {(page - 1) * pageSize + 1} a{" "}
						{Math.min(page * pageSize, total)} de {total} registros
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange?.(page - 1)}
							disabled={page <= 1}
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
							onClick={() => onPageChange?.(page + 1)}
							disabled={page >= totalPages}
						>
							Próxima
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export { EnergyTable };
