import type { OpenAPIV3 } from "openapi-types";

export const BodySendExamResultSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета из которого был взят этот вопрос",
			default: "1717918012771",
		},
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
	ticketId: string;
	questionId: string;
	answerId: string;
};
