import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatNumber(value: number, decimals = 2): string {
	return new Intl.NumberFormat("pt-BR", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value);
}

export function formatDate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return format(d, "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return format(d, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
}

export function formatRelative(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

export function formatUnit(value: number, unit: string, decimals = 2): string {
	return `${formatNumber(value, decimals)} ${unit}`;
}
