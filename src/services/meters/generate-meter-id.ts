import { randomUUID } from "node:crypto";

export function generateMeterId(prefix?: string | null): string {
	const uuid = randomUUID();
	const cleanUuid = uuid.replace(/-/g, "").substring(0, 12);

	if (prefix && prefix.trim().length > 0) {
		return `${prefix.trim()}-${cleanUuid}`;
	}

	return cleanUuid;
}
