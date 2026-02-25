import { adaptEnergyData } from "@/lib/energy";
import { getLogEnergy, postLogEnergy } from "@/server/energy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/energy")({
	validateSearch: adaptEnergyData,
	server: {
		handlers: {
			GET: getLogEnergy,
			POST: postLogEnergy,
		},
	},
});
