import { Home } from "@/app/home/home";
import { db } from "@/db";
import { energyLogTable } from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
	loader: async () => {
		return await db.select().from(energyLogTable);
	},
});

function HomePage() {
	const energyLogs = Route.useLoaderData();
	return <Home energyLogs={energyLogs} />;
}
