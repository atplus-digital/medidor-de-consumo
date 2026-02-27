import { jsonResponse } from "@/api";
import * as metersService from "@/services/meters";

/**
 * GET /api/meters - Get all meters
 */
export async function getMetersHandler() {
	try {
		const meters = await metersService.getMeters();
		return jsonResponse.success(meters);
	} catch (error) {
		console.error("Error fetching meters:", error);
		return jsonResponse.error("Failed to fetch meters", 500);
	}
}

/**
 * GET /api/meters/:meterId - Get a specific meter
 */
export async function getMeterByIdHandler(meterId: string) {
	try {
		const meter = await metersService.getMeterById(meterId);

		if (!meter) {
			return jsonResponse.error("Meter not found", 404);
		}

		return jsonResponse.success(meter);
	} catch (error) {
		console.error("Error fetching meter:", error);
		return jsonResponse.error("Failed to fetch meter", 500);
	}
}

/**
 * POST /api/meters - Create a new meter
 */
export async function createMeterHandler({ request }: { request: Request }) {
	try {
		const body = await request.json();
		const newMeter = await metersService.createMeter(body);
		return jsonResponse.success(newMeter, "Meter created successfully", 201);
	} catch (error) {
		console.error("Error creating meter:", error);

		if (error instanceof SyntaxError) {
			return jsonResponse.error("Invalid JSON", 400);
		}
		if (error instanceof Error && error.message.includes("already exists")) {
			return jsonResponse.error(error.message, 409);
		}
		if (error instanceof Error && error.message.includes("validation")) {
			return jsonResponse.error(error.message, 400);
		}
		return jsonResponse.error("Failed to create meter", 500);
	}
}

/**
 * PUT /api/meters/:meterId - Update a meter
 */
export async function updateMeterHandler({
	meterId,
	request,
}: {
	meterId: string;
	request: Request;
}) {
	try {
		const body = await request.json();
		const updatedMeter = await metersService.updateMeter(meterId, body);
		return jsonResponse.success(updatedMeter);
	} catch (error) {
		if (error instanceof SyntaxError) {
			return jsonResponse.error("Invalid JSON", 400);
		}
		if (error instanceof Error && error.message.includes("not found")) {
			return jsonResponse.error(error.message, 404);
		}
		console.error("Error updating meter:", error);
		return jsonResponse.error("Failed to update meter", 500);
	}
}

/**
 * DELETE /api/meters/:meterId - Delete a meter and all associated logs
 */
export async function deleteMeterHandler(meterId: string) {
	try {
		const result = await metersService.deleteMeter(meterId);
		return jsonResponse.success(result);
	} catch (error) {
		if (error instanceof Error && error.message.includes("not found")) {
			return jsonResponse.error(error.message, 404);
		}
		console.error("Error deleting meter:", error);
		return jsonResponse.error("Failed to delete meter", 500);
	}
}
