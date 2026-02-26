import { createMeter, getMeters } from "@/server/meters";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/meters")({
	server: {
		handlers: {
			GET: getMeters,
			POST: createMeter,
		},
	},
});
