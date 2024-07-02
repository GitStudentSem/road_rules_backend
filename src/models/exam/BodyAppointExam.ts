import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const BodyAppointExamSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		isAppoint: {
			type: "boolean",
			description: "Назначен ли экзамен для пользователя",
			default: "true",
		},
		email: {
			type: "string",
			description: "Почта пользователя для которого нужно назначить экзамен",
			default: defaultSwaggerValues.email,
		},
	},
	required: ["isAppoint", "email"],
};

export type BodyAppointExam = { isAppoint: boolean; email: string };
