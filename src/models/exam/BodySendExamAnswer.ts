import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const BodySendExamAnswerSwaggerDoc: OpenAPIV3.SchemaObject = {
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
			description: "id варианта ответа",
			default: defaultSwaggerValues.answerId,
		},
	},
	required: ["answerId", "questionId", "ticketId"],
};

export type BodySendExamAnswer = {
	ticketId: string;
	questionId: string;
	answerId: string;
};
