import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const EditQuestionBodySwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		img: {
			type: "string",
			format: "binary",
			description: "Картинка в виде ArrayBuffer",
		},
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "id билета",
		},
		questionId: {
			type: "string",
			default: defaultSwaggerValues.questionId,
			description: "id вопроса который редактируется",
		},
		question: {
			type: "string",
			default: "В каком направлении разрешен поворот?",
			description: "Текст вопроса",
		},
		help: {
			type: "string",
			default: "В направлении движения по полосам",
			description: "Текст помощи по вопросу",
		},
		correctAnswer: {
			type: "number",
			default: "1",
			description: "индекс правильного ответа ответа",
		},
		answers: {
			type: "array",
			description: "Варианты ответов на вопрос",

			items: {
				type: "string",
				default: "Только направо",
				description: "Текст варианта ответа на вопрос",
			},
		},
	},
	required: ["ticketId", "questionId", "question", "correctAnswer", "answers"],
};
export type EditQuestionBody = {
	img?: ArrayBuffer;
	ticketId: string;
	questionId: string;
	question: string;
	help?: string;
	correctAnswer: number;
	answers: string[];
};
