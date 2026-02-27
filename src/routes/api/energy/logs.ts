import { createFileRoute } from "@tanstack/react-router";
import { getEnergyLogsHandler } from "@/api/energy";

export const Route = createFileRoute("/api/energy/logs")({
	server: {
		handlers: {
			GET: getEnergyLogsHandler,
		},
	},
});
