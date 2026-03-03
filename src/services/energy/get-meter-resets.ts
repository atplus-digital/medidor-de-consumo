import { sql } from "drizzle-orm";
import { db } from "@/db";

export interface MeterReset {
	id: number;
	meterId: string;
	detectedAt: Date;
	previousConsumed: number;
	resetConsumed: number;
}

/**
 * Detecta reinicializações do medidor no período selecionado.
 *
 * Uma reinicialização é detectada quando o valor acumulado de consumo
 * diminui em relação à leitura anterior.
 */
export async function getMeterResets({
	startDate,
	endDate,
	meterId,
}: {
	startDate?: string | null;
	endDate?: string | null;
	meterId?: string | null;
}) {
	const meterConditions: ReturnType<typeof sql>[] = [];

	if (meterId) meterConditions.push(sql`meter_id = ${meterId}`);

	const meterWhereClause =
		meterConditions.length > 0
			? sql`WHERE ${sql.join(meterConditions, sql` AND `)}`
			: sql``;

	// Filtros temporais aplicados no SELECT final
	const dateConditions: ReturnType<typeof sql>[] = [];
	
	if (startDate) dateConditions.push(sql`created_at >= ${new Date(startDate)}`);
	if (endDate) dateConditions.push(sql`created_at <= ${new Date(endDate)}`);

	const query = sql`
		WITH ordered_readings AS (
			SELECT
				id,
				meter_id,
				consumed_energy,
				created_at,
				LAG(consumed_energy) OVER (PARTITION BY meter_id ORDER BY created_at) AS prev_consumed
			FROM energy_log
			${meterWhereClause}
		)
		SELECT
			id,
			meter_id AS "meterId",
			created_at AS "detectedAt",
			prev_consumed AS "previousConsumed",
			consumed_energy AS "resetConsumed"
		FROM ordered_readings
		WHERE
			prev_consumed IS NOT NULL
			AND consumed_energy < prev_consumed
			${dateConditions.length > 0 ? sql`AND ${sql.join(dateConditions, sql` AND `)}` : sql``}
		ORDER BY created_at DESC
	`;

	const result = await db.execute(query);

	return result.rows as unknown as MeterReset[];
}
