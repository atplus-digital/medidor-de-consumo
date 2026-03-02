import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { EnergyLog } from "@/db/schema";
import { formatDateTime, formatNumber } from "@/lib/format";

const columnHelper = createColumnHelper<EnergyLog>();

export const columns = [
	columnHelper.accessor("id", {
		header: "ID",
		cell: (info) => (
			<span className="font-mono text-xs">{info.getValue()}</span>
		),
		size: 64,
	}),
	columnHelper.accessor("meterId", {
		header: "Medidor",
		cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
	}),
	columnHelper.accessor("consumedEnergy", {
		header: () => (
			<span className="w-full text-right block">Consumo (kWh)</span>
		),
		cell: (info) => (
			<span className="block text-right font-mono">
				{formatNumber(info.getValue(), 4)}
			</span>
		),
	}),
	columnHelper.accessor("generatedEnergy", {
		header: () => (
			<span className="w-full text-right block">Geração (kWh)</span>
		),
		cell: (info) => (
			<span className="block text-right font-mono">
				{formatNumber(info.getValue(), 4)}
			</span>
		),
	}),
	columnHelper.accessor("activePower", {
		header: () => (
			<span className="w-full text-right block">Pot. Ativa (W)</span>
		),
		cell: (info) => (
			<span className="block text-right font-mono">
				{formatNumber(info.getValue())}
			</span>
		),
	}),
	columnHelper.accessor("voltage", {
		header: () => <span className="w-full text-right block">Tensão (V)</span>,
		cell: (info) => (
			<span className="block text-right font-mono">
				{formatNumber(info.getValue(), 1)}
			</span>
		),
	}),
	columnHelper.accessor("current", {
		header: () => <span className="w-full text-right block">Corrente (A)</span>,
		cell: (info) => (
			<span className="block text-right font-mono">
				{formatNumber(info.getValue(), 3)}
			</span>
		),
	}),
	columnHelper.accessor("powerFactor", {
		header: () => <span className="w-full text-right block">FP</span>,
		cell: (info) => (
			<span className="block text-right font-mono">
				{formatNumber(info.getValue(), 3)}
			</span>
		),
	}),
	columnHelper.accessor("frequency", {
		header: () => <span className="w-full text-right block">Freq. (Hz)</span>,
		cell: (info) => (
			<span className="block text-right font-mono">
				{formatNumber(info.getValue(), 1)}
			</span>
		),
	}),

	columnHelper.accessor("createdAt", {
		header: "Data/Hora",
		cell: (info) => {
			const value = info.getValue();
			return (
				<span className="text-xs">{value ? formatDateTime(value) : "-"}</span>
			);
		},
	}),
];
