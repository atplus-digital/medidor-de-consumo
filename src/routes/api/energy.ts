import { createFileRoute } from "@tanstack/react-router";
import { postLogEnergy } from "@/server/energy";

export const Route = createFileRoute("/api/energy")({
	server: {
		handlers: {
			POST: postLogEnergy,
		},
	},
});
