export const SendExamViewModelSwaggerDoc = {
	type: "object",
	properties: {
		img: {
			type: "string",
			default: [],
			description: "Картинка в формате base64",
		},
		question: {
			type: "string",
			description: "Вопрос экзамена",
			default: "В каком направлении вам разрешено движение?",
		},
		ticketId: {
			type: "string",
			description: "id билета из которого был взят этот вопрос",
			default: "1717841402302",
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: "1717841402302",
		},
		answers: {
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
			},
		},
	},
};
export type SendExamViewModel = {
	question: string;
	img: string;
	ticketId: string;
	questionId: string;
	answers: {
		answerText: string;
		answerId: string;
	}[];
};
