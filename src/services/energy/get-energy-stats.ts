import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { EnergyStats } from "@/db/schema";

/**
 * Retorna estatísticas de energia para o período selecionado.
 *
 * Utiliza LAG() para calcular os deltas entre leituras consecutivas
 * e somar corretamente o consumo/geração (valores acumulados).
 * Detecta reinicializações do medidor para evitar valores negativos.
 */
export async function getEnergyStats({
	startDate,
	endDate,
	meterId,
}: {
	startDate?: string | null;
	endDate?: string | null;
	meterId?: string | null;
}) {
	// Filtros não-temporais vão no CTE para preservar o contexto do LAG()
	const meterConditions: ReturnType<typeof sql>[] = [];
	if (meterId) meterConditions.push(sql`meter_id = ${meterId}`);

	const meterWhereClause =
		meterConditions.length > 0
			? sql`WHERE ${sql.join(meterConditions, sql` AND `)}`
			: sql``;

	// Filtros temporais aplicados APÓS o cálculo de deltas
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
				power_factor,
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
				power_factor,
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
			COALESCE(SUM(delta_consumed), 0)::double precision AS "totalConsumed",
			COALESCE(SUM(delta_generated), 0)::double precision AS "totalGenerated",
			COALESCE(AVG(active_power), 0)::double precision AS "avgActivePower",
			COALESCE(MAX(active_power), 0)::double precision AS "maxActivePower",
			COALESCE(MIN(active_power), 0)::double precision AS "minActivePower",
			COALESCE(AVG(voltage), 0)::double precision AS "avgVoltage",
			COALESCE(AVG("current"), 0)::double precision AS "avgCurrent",
			COALESCE(AVG(power_factor), 0)::double precision AS "avgPowerFactor",
			CAST(COUNT(*) AS integer) AS "totalReadings"
		FROM deltas
	`);

	return (result.rows[0] ?? null) as unknown as EnergyStats | null;
}
