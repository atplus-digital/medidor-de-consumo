import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { jsonResponse } from "@/api";
import { db } from "@/db";
import { energyLogTable, metersTable } from "@/db/schema";

export const Route = createFileRoute("/api/energy/meters")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const result = await db
						.selectDistinct({
							id: energyLogTable.meterId,
							meterName: metersTable.meterName,
						})
						.from(energyLogTable)
						.innerJoin(
							metersTable,
							eq(energyLogTable.meterId, metersTable.meterId),
						);

					return jsonResponse.success(result);
				} catch (_) {
					return jsonResponse.error("Erro ao buscar IDs de medidores", 500);
				}
			},
		},
	},
});
