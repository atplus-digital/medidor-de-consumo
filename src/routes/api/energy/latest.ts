import { createFileRoute } from "@tanstack/react-router";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";
import { jsonResponse } from "@/lib/http";

export const Route = createFileRoute("/api/energy/latest")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				try {
					const url = new URL(request.url);
					const meterId = url.searchParams.get("meterId");

					const conditions = [];
					if (meterId) {
						conditions.push(eq(energyLogTable.meterId, meterId));
					}

					const result = await db
						.select()
						.from(energyLogTable)
						.where(conditions.length > 0 ? and(...conditions) : undefined)
						.orderBy(desc(energyLogTable.createdAt))
						.limit(1);

					return jsonResponse.success(result[0] ?? null);
				} catch (_) {
					return jsonResponse.error("Erro ao buscar leitura mais recente", 500);
				}
			},
		},
	},
});
