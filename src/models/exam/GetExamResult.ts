import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const GetExamResultViewModelSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: defaultSwaggerValues.ticketId,
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: defaultSwaggerValues.questionId,
		},
		answerId: {
			type: "string",
			description: "id ответа",
			default: defaultSwaggerValues.answerId,
		},
		isCorrect: {
			type: "boolean",
			description: "Правильный ответ или нет",
			default: "true",
		},
	},
};

export type GetExamResult = {
	ticketId: string;
	questionId: string;
	answerId: string;
	isCorrect: boolean;
};
