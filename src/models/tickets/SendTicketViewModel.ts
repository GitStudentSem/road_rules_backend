import { defaultSwaggerValues } from "../../assets/settings";

export const SendTicketViewModelSwaggerDoc = {
	type: "object",
	properties: {
		question: {
			type: "string",
			description: "Вопрос билета",
			default: "В каком направлении вам разреено движение?",
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: defaultSwaggerValues.questionId,
		},
		img: {
			type: "string",
			description: "Картинка к вопросу в формате base64",
			default: "",
		},
		answers: {
			type: "array",
			description: "Варианты ответа на вопрос",
			items: {
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
	},
};
export type SendTicketViewModel = {
	question: string;
	questionId: string;
	img: string;
	answers: {
		answerText: string;
		answerId: string;
	}[];
};
