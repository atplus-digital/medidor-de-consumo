export const STATUS_OPTIONS = ["active", "inactive", "maintenance"] as const;

export const STATUS_LABELS: Record<string, string> = {
	active: "Ativo",
	inactive: "Inativo",
	maintenance: "Manutenção",
};

export const FORM_PLACEHOLDERS = {
	meterName: "ex.: Medidor Principal, Prédio A",
	meterType: "Modelo, Marca, Tipo...",
	location: "ex.: Prédio A - Andar 1",
	prefix: "ex.: MTR, MEDIDOR-A",
};

export const FORM_LABELS = {
	meterName: "Nome do Medidor *",
	meterType: "Tipo do Medidor *",
	location: "Localização *",
	prefix: "Prefixo do Id (Opcional)",
	status: "Status",
	isInverted: "Medidor Invertido",
};

export const FORM_DESCRIPTIONS = {
	prefix:
		"O prefixo será combinado com um hash único para gerar o ID do medidor",
	isInverted:
		"Ative se o medidor foi instalado invertido. Isso inverterá o sinal da potência ativa/reativa e trocará consumo com geração.",
};
