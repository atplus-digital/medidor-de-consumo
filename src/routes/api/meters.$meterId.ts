import { createFileRoute } from "@tanstack/react-router";
import {
	deleteMeterHandler,
	getMeterByIdHandler,
	updateMeterHandler,
} from "@/api/meters";

export const Route = createFileRoute("/api/meters/$meterId")({
	server: {
		handlers: {
			GET: async ({ params }: { params: { meterId: string } }) => {
				return getMeterByIdHandler(params.meterId);
			},
			PUT: async ({
				params,
				request,
			}: {
				params: { meterId: string };
				request: Request;
			}) => {
				return updateMeterHandler({ meterId: params.meterId, request });
			},
			DELETE: async ({ params }: { params: { meterId: string } }) => {
				return deleteMeterHandler(params.meterId);
			},
		},
	},
});
