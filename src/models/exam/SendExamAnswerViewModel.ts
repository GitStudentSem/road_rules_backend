import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const SendExamAnswerViewModelSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		isCorrect: {
			type: "boolean",
			description: "Правильный ответ или нет",
			default: "true",
		},
		correctAnswer: {
			type: "string",
			description: "id правильного ответа",
			default: defaultSwaggerValues.answerId,
		},
		help: {
			type: "string",
			description: "Помощь по вопросу",
			default: "В направлении казаном на знаке движение по полосам",
		},
	},
};
export type SendExamAnswerViewModel = {
	isCorrect: boolean;
	correctAnswer: string;
	help: string;
};
