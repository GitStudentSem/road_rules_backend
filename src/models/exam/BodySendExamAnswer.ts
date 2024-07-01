import type { OpenAPIV3 } from "openapi-types";

export const BodySendExamAnswerSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: "1717841402302",
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
	required: ["answerId", "questionId", "ticketId"],
};

export type BodySendExamAnswer = {
	ticketId: string;
	questionId: string;
	answerId: string;
};
