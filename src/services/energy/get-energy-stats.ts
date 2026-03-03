import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { EnergyStats } from "@/db/schema";

/**
 * Retorna estatísticas completas de energia para o período selecionado.
 *
 * Utiliza LAG() para calcular os deltas entre leituras consecutivas
 * e somar corretamente o consumo/geração (valores acumulados).
 * Detecta reinicializações do medidor para evitar valores negativos.
 *
 * Inclui cálculos de custo estimado baseado no cadastro do medidor,
 * análise de qualidade de tensão/frequência, e consumo médio diário.
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
	if (meterId) meterConditions.push(sql`el.meter_id = ${meterId}`);

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
				el.consumed_energy,
				el.generated_energy,
				el.active_power,
				el.reactive_power,
				el.apparent_power,
				el.voltage,
				el."current",
				el.power_factor,
				el.frequency,
				el.operation_time,
				el.created_at,
				el.meter_id,
				COALESCE(m.cost_per_kwh, 0)::double precision AS cost_per_kwh,
				COALESCE(m.revenue_per_kwh, 0)::double precision AS revenue_per_kwh,
				LAG(el.consumed_energy) OVER (PARTITION BY el.meter_id ORDER BY el.created_at) AS prev_consumed,
				LAG(el.generated_energy) OVER (PARTITION BY el.meter_id ORDER BY el.created_at) AS prev_generated
			FROM energy_log el
			LEFT JOIN meters m ON el.meter_id = m.meter_id
			${meterWhereClause}
		),
		deltas AS (
			SELECT
				active_power,
				reactive_power,
				apparent_power,
				voltage,
				"current",
				power_factor,
				frequency,
				operation_time,
				created_at,
				cost_per_kwh,
				revenue_per_kwh,
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
			(COALESCE(SUM(delta_consumed), 0) - COALESCE(SUM(delta_generated), 0))::double precision AS "energyBalance",
			COALESCE(AVG(active_power), 0)::double precision AS "avgActivePower",
			COALESCE(MAX(active_power), 0)::double precision AS "maxActivePower",
			COALESCE(MIN(active_power), 0)::double precision AS "minActivePower",
			COALESCE(AVG(reactive_power), 0)::double precision AS "avgReactivePower",
			COALESCE(AVG(apparent_power), 0)::double precision AS "avgApparentPower",
			COALESCE(AVG(voltage), 0)::double precision AS "avgVoltage",
			COALESCE(MIN(voltage), 0)::double precision AS "minVoltage",
			COALESCE(MAX(voltage), 0)::double precision AS "maxVoltage",
			COALESCE(AVG("current"), 0)::double precision AS "avgCurrent",
			COALESCE(MAX("current"), 0)::double precision AS "maxCurrent",
			COALESCE(AVG(power_factor), 0)::double precision AS "avgPowerFactor",
			COALESCE(MIN(power_factor), 0)::double precision AS "minPowerFactor",
			COALESCE(AVG(frequency), 0)::double precision AS "avgFrequency",
			COALESCE(MIN(frequency), 0)::double precision AS "minFrequency",
			COALESCE(MAX(frequency), 0)::double precision AS "maxFrequency",
			CAST(COUNT(*) AS integer) AS "totalReadings",
			COALESCE(SUM(operation_time), 0)::double precision AS "totalOperationTime",
			CASE
				WHEN COUNT(DISTINCT (created_at AT TIME ZONE 'America/Sao_Paulo')::date) > 0
				THEN (COALESCE(SUM(delta_consumed), 0) / COUNT(DISTINCT (created_at AT TIME ZONE 'America/Sao_Paulo')::date))::double precision
				ELSE 0
			END AS "avgDailyConsumption",
			(COALESCE(SUM(delta_consumed), 0) * COALESCE(AVG(cost_per_kwh), 0))::double precision AS "estimatedCost",
			(COALESCE(SUM(delta_generated), 0) * COALESCE(AVG(revenue_per_kwh), 0))::double precision AS "estimatedRevenue",
			(
				(COALESCE(SUM(delta_consumed), 0) * COALESCE(AVG(cost_per_kwh), 0))
				- (COALESCE(SUM(delta_generated), 0) * COALESCE(AVG(revenue_per_kwh), 0))
			)::double precision AS "netCost"
		FROM deltas
	`);

	return (result.rows[0] ?? null) as unknown as EnergyStats | null;
}
