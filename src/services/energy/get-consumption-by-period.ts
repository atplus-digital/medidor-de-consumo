import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { ConsumptionData } from "@/db/schema";

export type IntervalType = "15min" | "hourly" | "daily" | "weekly";

export const intervalLabels: Record<IntervalType, string> = {
	"15min": "15 minutos",
	hourly: "Hora",
	daily: "Dia",
	weekly: "Semana",
};

/**
 * Resolve o intervalo de agrupamento automaticamente com base no range de datas.
 * - ≤ 24h → agrupamento a cada 15 minutos
 * - ≤ 2 dias → agrupamento por hora
 * - ≤ 45 dias → agrupamento por dia
 * - > 45 dias → agrupamento por semana
 */
function resolveInterval(
	startDate?: string | null,
	endDate?: string | null,
): IntervalType {
	if (!startDate || !endDate) return "daily";

	const start = new Date(startDate);
	const end = new Date(endDate);
	const diffMs = end.getTime() - start.getTime();
	const diffHours = diffMs / (1000 * 60 * 60);
	const diffDays = diffHours / 24;

	if (diffHours <= 24) return "15min";
	if (diffDays <= 2) return "hourly";
	if (diffDays > 45) return "weekly";
	return "daily";
}

function getDateGroupExpression(interval: IntervalType) {
	switch (interval) {
		case "15min":
			return sql`(date_trunc('hour', created_at) + (EXTRACT(minute FROM created_at)::int / 15) * interval '15 minutes')::text`;
		case "hourly":
			return sql`date_trunc('hour', created_at)::text`;
		case "weekly":
			return sql`date_trunc('week', created_at)::date::text`;
		case "daily":
		default:
			return sql`date(created_at)::text`;
	}
}

/**
 * Retorna dados de consumo agrupados por período.
 *
 * Utiliza LAG() para calcular os deltas entre leituras consecutivas
 * (já que consumedEnergy/generatedEnergy são valores acumulados).
 * Detecta reinicializações do medidor (quando o acumulado diminui)
 * e trata o valor pós-reset como o delta do período.
 *
 * O intervalo de agrupamento é calculado automaticamente com base
 * no range de datas selecionado.
 */
export async function getConsumptionByPeriod({
	startDate,
	endDate,
	meterId,
}: {
	startDate?: string | null;
	endDate?: string | null;
	meterId?: string | null;
}) {
	const interval = resolveInterval(startDate, endDate);
	const dateExpr = getDateGroupExpression(interval);

	// Filtros não-temporais (meter) vão no CTE para que LAG()
	// veja leituras antes do startDate e calcule o delta correto
	const meterConditions: ReturnType<typeof sql>[] = [];
	if (meterId) meterConditions.push(sql`meter_id = ${meterId}`);

	const meterWhereClause =
		meterConditions.length > 0
			? sql`WHERE ${sql.join(meterConditions, sql` AND `)}`
			: sql``;

	// Filtros temporais são aplicados APÓS o cálculo de deltas
	const dateConditions: ReturnType<typeof sql>[] = [];
	if (startDate)
		dateConditions.push(sql`created_at >= ${new Date(startDate)}`);
	if (endDate)
		dateConditions.push(sql`created_at <= ${new Date(endDate)}`);

	const dateWhereClause =
		dateConditions.length > 0
			? sql`WHERE ${sql.join(dateConditions, sql` AND `)}`
			: sql``;

	const result = await db.execute(sql`
		WITH ordered_readings AS (
			SELECT
				consumed_energy,
				generated_energy,
				active_power,
				voltage,
				"current",
				created_at,
				LAG(consumed_energy) OVER (PARTITION BY meter_id ORDER BY created_at) AS prev_consumed,
				LAG(generated_energy) OVER (PARTITION BY meter_id ORDER BY created_at) AS prev_generated
			FROM energy_log
			${meterWhereClause}
		),
		deltas AS (
			SELECT
				active_power,
				voltage,
				"current",
				created_at,
				CASE
					WHEN prev_consumed IS NULL THEN 0
					WHEN consumed_energy < prev_consumed THEN consumed_energy
					ELSE consumed_energy - prev_consumed
				END AS delta_consumed,
				CASE
					WHEN prev_generated IS NULL THEN 0
					WHEN generated_energy < prev_generated THEN generated_energy
					ELSE generated_energy - prev_generated
				END AS delta_generated
			FROM ordered_readings
			${dateWhereClause}
		)
		SELECT
			${dateExpr} AS "date",
			COALESCE(SUM(delta_consumed), 0)::double precision AS "totalConsumed",
			COALESCE(SUM(delta_generated), 0)::double precision AS "totalGenerated",
			COALESCE(AVG(active_power), 0)::double precision AS "avgActivePower",
			COALESCE(MAX(active_power), 0)::double precision AS "maxActivePower",
			COALESCE(AVG(voltage), 0)::double precision AS "avgVoltage",
			COALESCE(AVG("current"), 0)::double precision AS "avgCurrent",
			CAST(COUNT(*) AS integer) AS "readings"
		FROM deltas
		GROUP BY 1
		ORDER BY 1
	`);

	return {
		data: result.rows as unknown as ConsumptionData[],
		interval,
		intervalLabel: intervalLabels[interval],
	};
}
