import { createFileRoute } from "@tanstack/react-router";
import { getLatestReadingHandler } from "@/api/energy";

export const Route = createFileRoute("/api/energy/latest")({
	server: {
		handlers: {
			GET: getLatestReadingHandler,
		},
	},
});
