import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const BodySendTicketResultSwaggerDoc: OpenAPIV3.SchemaObject = {
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
	},
};
export type BodySendTicketResult = {
	ticketId: string;
	questionId: string;
	answerId: string;
};
