import type { OpenAPIV3 } from "openapi-types";

export const GetExamResultViewModelSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: "1719759332908",
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: "1719759345626",
		},
		answerId: {
			type: "string",
			description: "id ответа",
			default: "17197813656880",
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
