import { useState } from "react";

export function useCopyMeterID() {
	const [copiedMeterID, setCopiedMeterID] = useState(false);

	const handleCopyMeterID = async (meterId: string) => {
		try {
			await navigator.clipboard.writeText(meterId);
			setCopiedMeterID(true);
			setTimeout(() => setCopiedMeterID(false), 1000);
		} catch (err) {
			console.error("Failed to copy meter ID:", err);
		}
	};

	return { copiedMeterID, handleCopyMeterID };
}
