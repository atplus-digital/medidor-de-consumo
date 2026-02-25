import { db } from "@/db";
import { energyLogTable } from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
	loader: async () => {
		return await db.select().from(energyLogTable);
	},
});

function App() {
	const energyLogs = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
			<pre>{JSON.stringify(energyLogs, null, 2)}</pre>
		</div>
	);
}
