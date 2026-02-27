import { createFileRoute } from "@tanstack/react-router";
import { getEnergyMetersHandler } from "@/api/energy";

export const Route = createFileRoute("/api/energy/meters")({
	server: {
		handlers: {
			GET: getEnergyMetersHandler,
		},
	},
});
