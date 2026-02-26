import { randomUUID } from "crypto";

/**
 * Generates a unique meter ID with optional prefix + UUID hash
 * @param prefix Optional prefix for the meter ID
 * @returns Unique meter ID in format: "prefix-uuid" or just "uuid" if no prefix
 */
export function generateMeterId(prefix?: string | null): string {
	const uuid = randomUUID();
	const cleanUuid = uuid.replace(/-/g, "").substring(0, 12);

	if (prefix && prefix.trim().length > 0) {
		return `${prefix.trim()}-${cleanUuid}`;
	}

	return cleanUuid;
}
