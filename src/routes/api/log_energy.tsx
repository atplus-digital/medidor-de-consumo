import { db } from "@/db";
import { energyLogSchema, energyLogTable } from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/log_energy")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const energyLog = await request.json();
					const parsed = energyLogSchema.parse(energyLog);

					await db.insert(energyLogTable).values(parsed);

					return new Response(
						JSON.stringify({
							status: "success",
							message: "Energy log saved successfully",
							data: parsed,
						}),
						{ status: 201 },
					);
				} catch (e) {
					return new Response(
						JSON.stringify({
							status: "error",
							message: "Invalid energy log data",
							error: e instanceof Error ? e.message : "Unknown error",
						}),
						{ status: 400 },
					);
				}
			},
		},
	},
});
