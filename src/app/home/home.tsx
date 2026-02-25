import type { EnergyLog } from "@/db/schema";

function Home({ energyLogs }: { energyLogs: EnergyLog[] }) {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
			<pre>{JSON.stringify(energyLogs, null, 2)}</pre>
		</div>
	);
}

export { Home };
