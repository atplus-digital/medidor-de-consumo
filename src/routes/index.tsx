import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/app/dashboard/dashboard";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

function DashboardPage() {
	return <Dashboard />;
}
