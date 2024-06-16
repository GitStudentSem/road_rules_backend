import type { OpenAPIV3 } from "openapi-types";

export const BodySendTicketResultSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: "1717918012771",
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: "1717918012771",
		},
		answerId: {
			type: "string",
			description: "id ответа",
			default: "17179180127710",
		},
	},
};
export type BodySendTicketResult = {
	ticketId: string;
	questionId: string;
	answerId: string;
};
