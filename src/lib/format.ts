import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

/** Offset de Brasília em minutos (-3h = -180min) */
const BRT_OFFSET_MINUTES = -180;

/**
 * Converte uma data UTC para o horário de Brasília (UTC-3).
 * Funciona tanto no servidor quanto no browser independente do fuso local.
 */
export function toLocalDate(date: Date | string): Date {
	const d = typeof date === "string" ? new Date(date) : date;
	// Calcula a diferença entre o fuso local e BRT
	const localOffset = d.getTimezoneOffset(); // em minutos, positivo = atrás de UTC
	const diffMinutes = localOffset - BRT_OFFSET_MINUTES;
	return new Date(d.getTime() - diffMinutes * 60_000);
}

export function formatNumber(value: number, decimals = 2): string {
	return new Intl.NumberFormat("pt-BR", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value);
}

export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
	return `${formatNumber(value, decimals)}%`;
}

export function formatDate(date: Date | string): string {
	const d = toLocalDate(date);
	return format(d, "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: Date | string): string {
	const d = toLocalDate(date);
	return format(d, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
}

export function formatDateShort(date: Date | string): string {
	const d = toLocalDate(date);
	return format(d, "dd/MM", { locale: ptBR });
}

export function formatTimeShort(date: Date | string): string {
	const d = toLocalDate(date);
	return format(d, "HH:mm", { locale: ptBR });
}

export function formatRelative(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

/**
 * Formata datas vindas das queries SQL (UTC) para exibição nos gráficos.
 * Aceita formatos: "2024-01-15", "2024-01-15 10:00:00", ISO strings, etc.
 * Ajusta para UTC-3 automaticamente.
 */
export function formatChartDate(dateStr: string): string {
	if (!dateStr) return "";

	// Tenta detectar o formato e formatar adequadamente
	const d = toLocalDate(dateStr);

	// Se contém hora (não é apenas data)
	if (dateStr.includes(" ") || dateStr.includes("T")) {
		// Se é intervalo curto (15min/horário), mostra dd/MM HH:mm
		return format(d, "dd/MM HH:mm", { locale: ptBR });
	}

	// Se é apenas data (daily/weekly)
	return format(d, "dd/MM", { locale: ptBR });
}

export function formatUnit(value: number, unit: string, decimals = 2): string {
	return `${formatNumber(value, decimals)} ${unit}`;
}

export function formatDuration(seconds: number): string {
	if (seconds < 60) return `${Math.round(seconds)}s`;
	if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
	const hours = Math.floor(seconds / 3600);
	const mins = Math.round((seconds % 3600) / 60);
	return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}
