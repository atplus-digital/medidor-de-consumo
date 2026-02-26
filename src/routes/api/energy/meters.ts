import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";
import { jsonResponse } from "@/lib/http";

export const Route = createFileRoute("/api/energy/meters")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const result = await db
						.selectDistinct({ meterId: energyLogTable.meterId })
						.from(energyLogTable);

					return jsonResponse.success(result.map(r => r.meterId));
				} catch (_) {
					return jsonResponse.error("Erro ao buscar IDs de medidores", 500);
				}
			},
		},
	},
});
