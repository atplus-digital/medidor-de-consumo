import { createFileRoute } from "@tanstack/react-router";
import { MetersManager } from "@/app/meters/meters-manager";

export const Route = createFileRoute("/meters")({
	component: MetersManager,
});
