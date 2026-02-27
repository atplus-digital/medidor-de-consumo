import { createFileRoute } from "@tanstack/react-router";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";
import { jsonResponse } from "@/lib/http";

export const Route = createFileRoute("/api/energy/logs")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				try {
					const url = new URL(request.url);
					const startDate = url.searchParams.get("startDate");
					const endDate = url.searchParams.get("endDate");
					const meterId = url.searchParams.get("meterId");
					const limit = parseInt(url.searchParams.get("limit") ?? "100", 10);
					const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);

					const conditions: Array<
						ReturnType<typeof eq | typeof gte | typeof lte>
					> = [];

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

					const logs = await db
						.select()
						.from(energyLogTable)
						.where(where)
						.orderBy(desc(energyLogTable.createdAt))
						.limit(limit)
						.offset(offset);

					const countResult = await db
						.select({
							count: sql<number>`cast(count(*) as integer)`,
						})
						.from(energyLogTable)
						.where(where);

					return jsonResponse.success({
						logs,
						total: countResult[0]?.count ?? 0,
					});
				} catch (_) {
					return jsonResponse.error("Erro ao buscar logs de energia", 500);
				}
			},
		},
	},
});
