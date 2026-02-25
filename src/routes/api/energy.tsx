import { db } from "@/db";
import {
	energyLogSchema,
	energyLogTable,
	type NewEnergyLog,
} from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";

export interface RawEnergyData {
	id?: string;
	pa?: string;
	qa?: string;
	sa?: string;
	uarms?: string;
	iarms?: string;
	pfa?: string;
	pga?: string;
	freq?: string;
	epa_c?: string;
	epa_g?: string;
	tpsd?: string;
}

export function adaptEnergyData(raw: RawEnergyData): NewEnergyLog {
	const validated = {
		meterId: raw?.id || "0",
		activePower: parseFloat(raw?.pa || "0"),
		reactivePower: parseFloat(raw?.qa || "0"),
		apparentPower: parseFloat(raw?.sa || "0"),
		voltage: parseFloat(raw?.uarms || "0"),
		current: parseFloat(raw?.iarms || "0"),
		powerFactor: parseFloat(raw?.pfa || "0"),
		phaseAngle: parseFloat(raw?.pga || "0"),
		frequency: parseFloat(raw?.freq || "0"),
		consumedEnergy: parseFloat(raw?.epa_c || "0"),
		generatedEnergy: parseFloat(raw?.epa_g || "0"),
		operationTime: parseFloat(raw?.tpsd || "0"),
	};
	return validated;
}

export const Route = createFileRoute("/api/energy")({
	validateSearch: adaptEnergyData,
	server: {
		handlers: {
			POST: postLogEnergy,
			GET: async ({ request }) => {
				try {
					const { searchParams } = new URL(request.url);
					const raw: RawEnergyData = Object.fromEntries(searchParams.entries());
					const parsed = energyLogSchema.parse(adaptEnergyData(raw));

					const data = {
						...parsed,
						rawData: raw,
					};

					await db.insert(energyLogTable).values(data);

					return new Response(
						JSON.stringify({
							status: "success",
							message: "Energy log saved successfully",
							data: data,
						}),
						{ status: 201 },
					);
				} catch (e) {
					return new Response(
						JSON.stringify({
							status: "error",
							message: "Invalid energy log data",
							error: e instanceof Error ? e.message : "Unknown error",
						}),
						{ status: 400 },
					);
				}
			},
		},
	},
});

async function postLogEnergy({ request }: { request: Request }) {
	try {
		const energyLog = await request.json();
		const parsed = energyLogSchema.parse(energyLog);

		const data = {
			...parsed,
			rawData: energyLog,
		};

		await db.insert(energyLogTable).values(data);

		return new Response(
			JSON.stringify({
				status: "success",
				message: "Energy log saved successfully",
				data: data,
			}),
			{ status: 201 },
		);
	} catch (e) {
		return new Response(
			JSON.stringify({
				status: "error",
				message: "Invalid energy log data",
				error: e instanceof Error ? e.message : "Unknown error",
			}),
			{ status: 400 },
		);
	}
}

// async function getEnergyLogs({ request }: { request: Request }) {
// 	const data = await request.json;
// }
