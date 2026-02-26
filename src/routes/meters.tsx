import { createFileRoute } from "@tanstack/react-router";
import { Meters } from "@/app/meters/meters";

export const Route = createFileRoute("/meters")({
	component: Meters,
});
