import { eq } from "drizzle-orm";
import { db } from "@/db";
import { metersTable } from "@/db/schema";

export async function getMeterById(meterId: string) {
	const meter = await db
		.select()
		.from(metersTable)
		.where(eq(metersTable.meterId, meterId))
		.limit(1);

	return meter.length > 0 ? meter[0] : null;
}
