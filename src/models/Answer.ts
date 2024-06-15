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
			default: "17178541405880",
		},
		isCorrect: {
			type: "boolean",
			description: "правильный ли ответ",
			default: "false",
		},
	},
};
export type Answer = {
	answerText: string;
	answerId: string;
	isCorrect: boolean;
};
