import type { OpenAPIV3 } from "openapi-types";

export const BodySendExamResultSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		questionId: {
			type: "string",
			description: "id вопроса",
			default: "1717918012771",
		},
		answerId: {
			type: "string",
			description: "id варианта ответа",
			default: "17179180127710",
		},
	},
	required: ["answerId", "questionId"],
};

export type BodySendExamResult = {
	questionId: string;
	answerId: string;
};
