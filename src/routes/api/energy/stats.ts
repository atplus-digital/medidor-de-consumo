import { createFileRoute } from "@tanstack/react-router";
import { getEnergyStatsHandler } from "@/api/energy";

export const Route = createFileRoute("/api/energy/stats")({
	server: {
		handlers: {
			GET: getEnergyStatsHandler,
		},
	},
});
