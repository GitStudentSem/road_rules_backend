import type { OpenAPIV3 } from "openapi-types";

export const BodySendExamResultSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		answerId: {
			type: "string",
			description: "id варианта ответа",
			default: "17179180127710",
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: "1717918012771",
		},
	},
	required: ["answerId", "questionId"],
};

export type BodySendExamResult = { answerId: string; questionNumber: number };
