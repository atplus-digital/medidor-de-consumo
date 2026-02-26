import { useState } from "react";

export function useMeterDelete() {
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async (meterId: string, onDelete: () => void) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this meter and all its associated logs?",
			)
		) {
			return;
		}

		setDeleting(true);
		try {
			const response = await fetch(`/api/meters/${meterId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				onDelete();
			}
		} finally {
			setDeleting(false);
		}
	};

	return { deleting, handleDelete };
}
