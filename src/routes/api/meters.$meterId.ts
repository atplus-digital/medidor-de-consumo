import { createFileRoute } from "@tanstack/react-router";
import { deleteMeter, getMeterById, updateMeter } from "@/server/meters";

export const Route = createFileRoute("/api/meters/$meterId")({
	server: {
		handlers: {
			GET: async ({ params }: { params: { meterId: string } }) => {
				return getMeterById(params.meterId);
			},
			PUT: async ({
				params,
				request,
			}: {
				params: { meterId: string };
				request: Request;
			}) => {
				return updateMeter({ meterId: params.meterId, request });
			},
			DELETE: async ({ params }: { params: { meterId: string } }) => {
				return deleteMeter(params.meterId);
			},
		},
	},
});
