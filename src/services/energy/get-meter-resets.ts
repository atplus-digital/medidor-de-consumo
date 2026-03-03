import { sql } from "drizzle-orm";
import { db } from "@/db";

export interface MeterReset {
	id: number;
	meterId: string;
	detectedAt: Date;
	lastReadingBefore: Date | null;
	previousConsumed: number | null;
	resetConsumed: number;
	previousGenerated: number | null;
	resetGenerated: number;
	previousOperationTime: number | null;
	resetOperationTime: number;
}

/**
 * Detecta reinicializações do medidor no período selecionado.
 *
 * Uma reinicialização é detectada quando:
 * - O valor acumulado de consumo diminui em relação à leitura anterior
 * - OU o tempo de operação diminui (indicando restart do dispositivo)
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
	if (startDate)
		dateConditions.push(sql`created_at >= ${new Date(startDate)}`);
	if (endDate)
		dateConditions.push(sql`created_at <= ${new Date(endDate)}`);

	const result = await db.execute(sql`
		WITH ordered_readings AS (
			SELECT
				id,
				meter_id,
				consumed_energy,
				generated_energy,
				operation_time,
				created_at,
				LAG(consumed_energy) OVER (PARTITION BY meter_id ORDER BY created_at) AS prev_consumed,
				LAG(generated_energy) OVER (PARTITION BY meter_id ORDER BY created_at) AS prev_generated,
				LAG(operation_time) OVER (PARTITION BY meter_id ORDER BY created_at) AS prev_operation_time,
				LAG(created_at) OVER (PARTITION BY meter_id ORDER BY created_at) AS prev_created_at
			FROM energy_log
			${meterWhereClause}
		)
		SELECT
			id,
			meter_id AS "meterId",
			created_at AS "detectedAt",
			prev_created_at AS "lastReadingBefore",
			prev_consumed AS "previousConsumed",
			consumed_energy AS "resetConsumed",
			prev_generated AS "previousGenerated",
			generated_energy AS "resetGenerated",
			prev_operation_time AS "previousOperationTime",
			operation_time AS "resetOperationTime"
		FROM ordered_readings
		WHERE
			(
				(prev_consumed IS NOT NULL AND consumed_energy < prev_consumed)
				OR (prev_operation_time IS NOT NULL AND operation_time < prev_operation_time)
			)
			${dateConditions.length > 0 ? sql`AND ${sql.join(dateConditions, sql` AND `)}` : sql``}
		ORDER BY created_at DESC
	`);

	return result.rows as unknown as MeterReset[];
}
