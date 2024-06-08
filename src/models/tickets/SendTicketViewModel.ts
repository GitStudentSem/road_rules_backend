import { QuestionSwaggerDoc, type Question } from "../Question";

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
			default: "1717854140588",
		},
		img: {
			type: "string",
			description: "Картинка к вопросу в формате base64",
			default: "",
		},
		answers: {
			type: "array",
			description: "Варианты ответа на вопрос",
			items: QuestionSwaggerDoc,
		},
	},
};
export type SendTicketViewModel = {
	question: string;
	questionId: string;
	img: string;
	answers: Question[];
};
