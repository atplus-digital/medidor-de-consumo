import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/app/reports/reports";

export const Route = createFileRoute("/reports")({
	component: Reports,
});
