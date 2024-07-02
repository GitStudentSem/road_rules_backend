import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const DeleteQuestionlSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета из которого нужно удалить вопрос",
			default: defaultSwaggerValues.ticketId,
		},
		questionId: {
			type: "string",
			description: "id вопроса который нужно удалить",
			default: defaultSwaggerValues.questionId,
		},
	},
	required: ["ticketId", "questionId"],
};

export type DeleteQuestionBody = { ticketId: string; questionId: string };
