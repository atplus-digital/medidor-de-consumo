import { createFileRoute } from "@tanstack/react-router";
import { Charts } from "@/app/charts/charts";

export const Route = createFileRoute("/charts")({
	component: Charts,
});
