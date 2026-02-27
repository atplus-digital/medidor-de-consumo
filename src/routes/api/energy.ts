import { createFileRoute } from "@tanstack/react-router";
import { postLogEnergyHandler } from "@/api/energy";

export const Route = createFileRoute("/api/energy")({
	server: {
		handlers: {
			POST: postLogEnergyHandler,
		},
	},
});
