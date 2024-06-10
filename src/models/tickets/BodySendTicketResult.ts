import type { OpenAPIV3 } from "openapi-types";

export const BodySendTicketResultSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
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
	answerId: string;
	questionId: string;
};
