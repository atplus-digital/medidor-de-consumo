export const STATUS_OPTIONS = ["active", "inactive", "maintenance"] as const;

export const FORM_PLACEHOLDERS = {
	meterName: "e.g., Main Meter, Building A",
	meterType: "e.g., Electric, Gas, Water",
	location: "e.g., Building A - Floor 1",
	prefix: "e.g., MTR, METER-A",
};

export const FORM_LABELS = {
	meterName: "Meter Name *",
	meterType: "Meter Type *",
	location: "Location *",
	prefix: "Prefix (Optional)",
	status: "Status",
};

export const FORM_DESCRIPTIONS = {
	prefix: "Prefix will be combined with a unique hash to generate the Meter ID",
};
