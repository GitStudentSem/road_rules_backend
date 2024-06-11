import type { OpenAPIV3 } from "openapi-types";

export const DeleteQuestionlSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета из которого нужно удалить вопрос",
			default: "1717841402302",
		},
		questionId: {
			type: "string",
			description: "id вопроса который нужно удалить",
			default: "1717918012771",
		},
	},
	required: ["ticketId", "questionId"],
};
export type DeleteQuestionBody = { ticketId: string; questionId: string };
