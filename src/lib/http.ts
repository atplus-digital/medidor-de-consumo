export type ApiPayload<T = unknown> = {
	status: "success" | "error";
	message?: string;
	data?: T;
	error?: string;
};

interface JsonResponseFn {
	<T = unknown>(
		payload: ApiPayload<T>,
		statusCode?: number,
		headers?: HeadersInit,
	): Response;
	success<T = unknown>(
		data?: T,
		message?: string,
		statusCode?: number,
		headers?: HeadersInit,
	): Response;
	error(
		message?: string,
		statusCode?: number,
		error?: string,
		headers?: HeadersInit,
	): Response;
}

const jsonResponse: JsonResponseFn = Object.assign(
	<T = unknown>(
		payload: ApiPayload<T>,
		statusCode = 200,
		headers: HeadersInit = {},
	) => {
		return new Response(JSON.stringify(payload), {
			status: statusCode,
			headers: { "Content-Type": "application/json", ...headers },
		});
	},
	{
		success<T = unknown>(
			data?: T,
			message?: string,
			statusCode = 200,
			headers: HeadersInit = {},
		) {
			return jsonResponse<T>(
				{ status: "success", message, data },
				statusCode,
				headers,
			);
		},
		error(
			message?: string,
			statusCode = 500,
			errorStr?: string,
			headers: HeadersInit = {},
		) {
			return jsonResponse(
				{ status: "error", message, error: errorStr },
				statusCode,
				headers,
			);
		},
	},
);

export { jsonResponse };
