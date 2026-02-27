import { createFileRoute } from "@tanstack/react-router";
import { createMeterHandler, getMetersHandler } from "@/api/meters";

export const Route = createFileRoute("/api/meters")({
	server: {
		handlers: {
			GET: getMetersHandler,
			POST: createMeterHandler,
		},
	},
});
