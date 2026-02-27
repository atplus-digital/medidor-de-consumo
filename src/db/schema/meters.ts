import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const metersTable = pgTable("meters", {
	// Identification
	meterId: varchar("meter_id", { length: 100 }).primaryKey(),

	// Information
	meterName: varchar("meter_name", { length: 255 }).notNull(),
	meterType: varchar("meter_type", { length: 50 }).notNull(),
	location: varchar("location", { length: 255 }).notNull(),
	status: varchar("status", { length: 50 }).notNull().default("active"),
	prefix: varchar("prefix", { length: 50 }),

	// Configuration
	isInverted: boolean("is_inverted").notNull().default(false), // 0 = normal, 1 = inverted

	// Timestamps
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Meters schemas
export const metersSchema = createSelectSchema(metersTable);
export const metersInsertSchema = createInsertSchema(metersTable);
export const metersUpdateSchema = createUpdateSchema(metersTable);

// Types
export type Meter = typeof metersTable.$inferSelect;
export type NewMeter = typeof metersTable.$inferInsert;
export type UpdateMeter = z.infer<typeof metersUpdateSchema>;

// Custom validation schema for meter form
export const meterFormSchema = z.object({
	meterName: z
		.string()
		.min(1, "Nome do medidor é obrigatório")
		.max(255, "Nome do medidor não pode exceder 255 caracteres")
		.trim(),
	meterType: z
		.string()
		.min(1, "Tipo de medidor é obrigatório")
		.max(50, "Tipo de medidor não pode exceder 50 caracteres")
		.trim(),
	location: z
		.string()
		.min(1, "Localização é obrigatória")
		.max(255, "Localização não pode exceder 255 caracteres")
		.trim(),
	status: z.enum(["active", "inactive", "maintenance"], {
		message: "Status deve ser: ativo, inativo ou manutenção",
	}),
	prefix: z
		.string()
		.max(50, "Prefixo não pode exceder 50 caracteres")
		.trim()
		.optional()
		.nullable(),
	isInverted: z.boolean(),
});

export type MeterFormData = z.infer<typeof meterFormSchema>;
