import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";

export const QuestionViewModelSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		img: {
			type: "string",
			description: "Картинка к вопросу",
			default: "",
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: defaultSwaggerValues.questionId,
		},
		question: {
			type: "string",
			description: "Вопрос билета",
			default: "В каком направлении разрешено движение?",
		},
		help: {
			type: "string",
			description: "Помощь по вопросу",
			default: "В направлении указанному на знаке движение по полосам",
		},
		answers: {
			type: "array",
			description: "Варианты ответа на вопрос",
			items: {
				type: "object",
				properties: {
					answerText: {
						type: "string",
						description: "Вариант ответа",
						default: "Только направо",
					},
					isCorrect: {
						type: "boolean",
						description: "Правильный ответ или нет",
						default: "true",
					},
				},
			},
		},
	},
};

export type QuestionViewModel = {
	img: string;
	questionId: string;
	question: string;
	help: string;
	answers: { answerText: string; isCorrect: boolean }[];
};
