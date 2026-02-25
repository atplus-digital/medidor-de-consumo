import { parseRawEnergyData, type RawEnergyData } from "@/lib/energy";
import { energyLogTable } from "@/db/schema";
import { jsonResponse } from "@/lib/http";
import { db } from "@/db";

export async function getLogEnergy({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url);
		const raw: RawEnergyData = Object.fromEntries(searchParams.entries());

		const data = parseRawEnergyData(raw);

		await db.insert(energyLogTable).values(data);

		return jsonResponse(
			{
				status: "success",
				message: "Energy log saved successfully",
				data,
			},
			201,
		);
	} catch (e) {
		return jsonResponse(
			{
				status: "error",
				message: "Invalid energy log data",
			},
			400,
		);
	}
}

export async function postLogEnergy({
	request,
}: {
	request: Request;
}): Promise<Response> {
	try {
		const raw: RawEnergyData = await request.json();

		const data = parseRawEnergyData(raw);

		await db.insert(energyLogTable).values(data);

		return jsonResponse(
			{
				status: "success",
				message: "Energy log saved successfully",
				data,
			},
			201,
		);
	} catch (e) {
		return jsonResponse(
			{
				status: "error",
				message: "Invalid energy log data",
			},
			400,
		);
	}
}
