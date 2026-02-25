export type ApiPayload<T = unknown> = {
	status: "success" | "error";
	message?: string;
	data?: T;
	error?: string;
};

export function jsonResponse<T = unknown>(
	payload: ApiPayload<T>,
	statusCode = 200,
	headers: HeadersInit = {},
) {
	return new Response(JSON.stringify(payload), {
		status: statusCode,
		headers: { "Content-Type": "application/json", ...headers },
	});
}
