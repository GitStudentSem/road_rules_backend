import { defaultSwaggerValues } from "../assets/settings";

export const AnswerSwaggerDoc = {
	type: "object",
	properties: {
		answerText: {
			type: "string",
			description: "Текст варианта ответа",
			default: "Только направо",
		},
		answerId: {
			type: "string",
			description: "id варианта ответа",
			default: defaultSwaggerValues.answerId,
		},
		isCorrect: {
			type: "boolean",
			description: "правильный ли ответ",
			default: "true",
		},
	},
};
export type Answer = {
	answerText: string;
	answerId: string;
	isCorrect: boolean;
};
