import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { energyLogTable, metersTable } from "@/db/schema";
import { jsonResponse } from "@/lib/http";

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
							(energy, meter) =>
								energy[energyLogTable.meterId.name as never] ===
								meter[metersTable.meterId.name as never],
						);

					return jsonResponse.success(result);
				} catch (_) {
					return jsonResponse.error("Erro ao buscar IDs de medidores", 500);
				}
			},
		},
	},
});
