import { createFileRoute } from "@tanstack/react-router";
import { getConsumptionByPeriodHandler } from "@/api/energy";

export const Route = createFileRoute("/api/energy/consumption")({
	server: {
		handlers: {
			GET: getConsumptionByPeriodHandler,
		},
	},
});
