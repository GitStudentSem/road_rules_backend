import { defaultSwaggerValues } from "../../assets/settings";

export const SendExamViewModelSwaggerDoc = {
	type: "object",
	properties: {
		img: {
			type: "string",
			default: "",
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
			default: defaultSwaggerValues.ticketId,
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: defaultSwaggerValues.questionId,
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
					default: defaultSwaggerValues.answerId,
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
