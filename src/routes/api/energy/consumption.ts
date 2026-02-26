import { createFileRoute } from "@tanstack/react-router";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";
import { jsonResponse } from "@/lib/http";

export const Route = createFileRoute("/api/energy/consumption")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				try {
					const url = new URL(request.url);
					const period = (url.searchParams.get("period") ?? "daily") as
						| "daily"
						| "weekly"
						| "monthly";
					const startDate = url.searchParams.get("startDate");
					const endDate = url.searchParams.get("endDate");
					const meterId = url.searchParams.get("meterId");

					const conditions = [];

					if (meterId) {
						conditions.push(eq(energyLogTable.meterId, meterId));
					}
					if (startDate) {
						conditions.push(gte(energyLogTable.createdAt, new Date(startDate)));
					}
					if (endDate) {
						conditions.push(lte(energyLogTable.createdAt, new Date(endDate)));
					}

					const where = conditions.length > 0 ? and(...conditions) : undefined;

					let dateExpr = sql`date(${energyLogTable.createdAt})`;

					switch (period) {
						case "daily":
							dateExpr = sql`date(${energyLogTable.createdAt})`;
							break;
						case "weekly":
							dateExpr = sql`date_trunc('week', ${energyLogTable.createdAt})::date`;
							break;
						case "monthly":
							dateExpr = sql`date_trunc('month', ${energyLogTable.createdAt})::date`;
							break;
						default:
							dateExpr = sql`date(${energyLogTable.createdAt})`;
					}

					const result = await db
						.select({
							date: sql<string>`${dateExpr}`,
							totalConsumed: sql<number>`coalesce(sum(${energyLogTable.consumedEnergy}), 0)`,
							totalGenerated: sql<number>`coalesce(sum(${energyLogTable.generatedEnergy}), 0)`,
							avgActivePower: sql<number>`coalesce(avg(${energyLogTable.activePower}), 0)`,
							maxActivePower: sql<number>`coalesce(max(${energyLogTable.activePower}), 0)`,
							avgVoltage: sql<number>`coalesce(avg(${energyLogTable.voltage}), 0)`,
							avgCurrent: sql<number>`coalesce(avg(${energyLogTable.current}), 0)`,
							readings: sql<number>`cast(count(*) as integer)`,
						})
						.from(energyLogTable)
						.where(where)
						.groupBy(dateExpr)
						.orderBy(dateExpr);

					return jsonResponse.success(result);
				} catch (_) {
					return jsonResponse.error("Erro ao buscar consumo por período", 500);
				}
			},
		},
	},
});
