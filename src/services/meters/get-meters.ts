import { db } from "@/db";
import { metersTable } from "@/db/schema";

export async function getMeters() {
	const meters = await db
		.select()
		.from(metersTable)
		.orderBy(metersTable.createdAt);
	return meters;
}
