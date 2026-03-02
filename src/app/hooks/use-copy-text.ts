import { useState } from "react";

function useCopyText(timeout: number = 1500) {
	const [value, setValue] = useState(false);

	const handleCopy = async (meterId: string) => {
		try {
			await navigator.clipboard.writeText(meterId);
			setValue(true);
			setTimeout(() => setValue(false), timeout);
		} catch (err) {
			console.error("Failed to copy meter ID:", err);
		}
	};

	return [value, handleCopy] as const;
}

export { useCopyText };
