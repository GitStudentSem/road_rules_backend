import { defaultSwaggerValues } from "../../assets/settings";
import type { OpenAPIV3 } from "openapi-types";

//===========================================//
export const ViewSendExamSwaggerDoc: OpenAPIV3.SchemaObject = {
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
export type ViewSendExam = {
	question: string;
	img: string;
	ticketId: string;
	questionId: string;
	answers: {
		answerText: string;
		answerId: string;
	}[];
};
//===========================================//

export const BodySendExamAnswerSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: defaultSwaggerValues.ticketId,
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: defaultSwaggerValues.questionId,
		},
		answerId: {
			type: "string",
			description: "id варианта ответа",
			default: defaultSwaggerValues.answerId,
		},
	},
	required: ["answerId", "questionId", "ticketId"],
};

export type BodySendExamAnswer = {
	ticketId: string;
	questionId: string;
	answerId: string;
};
//===========================================//

export const ViewSendExamAnswerSwaggerDoc: OpenAPIV3.SchemaObject = {
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
export type ViewSendExamAnswer = {
	isCorrect: boolean;
	correctAnswer: string;
	help: string;
};
//===========================================//

export const BodyAppointExamSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		isAppoint: {
			type: "boolean",
			description: "Назначен ли экзамен для пользователя",
			default: "true",
		},
		email: {
			type: "string",
			description: "Почта пользователя для которого нужно назначить экзамен",
			default: defaultSwaggerValues.email,
		},
	},
	required: ["isAppoint", "email"],
};
export type BodyAppointExam = { isAppoint: boolean; email: string };
//===========================================//

export const ViewGetExamResultSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: defaultSwaggerValues.ticketId,
		},
		questionId: {
			type: "string",
			description: "id вопроса",
			default: defaultSwaggerValues.questionId,
		},
		answerId: {
			type: "string",
			description: "id ответа",
			default: defaultSwaggerValues.answerId,
		},
		isCorrect: {
			type: "boolean",
			description: "Правильный ответ или нет",
			default: "true",
		},
	},
};

export type ViewGetExamResult = {
	ticketId: string;
	questionId: string;
	answerId: string;
	isCorrect: boolean;
};
//===========================================//

export type BodySetAlwaysCompleteExam = {
	email: string;
	isAlwaysComplete: boolean;
};
