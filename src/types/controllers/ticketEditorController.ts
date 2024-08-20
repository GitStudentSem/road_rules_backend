import { defaultSwaggerValues } from "../../assets/settings";
import type { OpenAPIV3 } from "openapi-types";

export const ViewSendTicketsSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "array",
	description: "id билетов доступных для выбора, включая пустые билеты",
	items: {
		type: "string",
		description: "id билета",
		default: defaultSwaggerValues.ticketId,
	},
};
//===========================================//

export const ViewCreateTicketSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: defaultSwaggerValues.ticketId,
		},
	},
	required: ["ticketId"],
};
export type ViewCreateTicket = { ticketId: string };
//===========================================//

export const BodyGetQuestionsInTicketSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета",
			default: defaultSwaggerValues.ticketId,
		},
	},
	required: ["ticketId"],
};
export type BodyGetQuestionsInTicket = { ticketId: string };
//===========================================//

export const ViewGetQuestionsInTicketSwaggerDoc: OpenAPIV3.SchemaObject = {
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
export type ViewGetQuestionsInTicket = {
	img: string;
	questionId: string;
	question: string;
	help: string;
	answers: { answerText: string; isCorrect: boolean }[];
};
//===========================================//

export const BodyCreateQuestionSwaggerDoc: OpenAPIV3.SchemaObject = {
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
	required: ["ticketId", "question", "correctAnswer", "answers"],
};
export type BodyCreateQuestion = {
	img?: ArrayBuffer;
	ticketId: string;
	question: string;
	help?: string;
	correctAnswer: number;
	answers: string[];
};
//===========================================//

export const BodyEditQuestionSwaggerDoc: OpenAPIV3.SchemaObject = {
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
export type BodyEditQuestion = {
	img?: ArrayBuffer;
	ticketId: string;
	questionId: string;
	question: string;
	help?: string;
	correctAnswer: number;
	answers: string[];
};
//===========================================//
export const BodyDeleteTicketSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			default: defaultSwaggerValues.ticketId,
			description: "id удаляемого билета",
		},
	},
	required: ["ticketId"],
};
export type BodyDeleteTicket = { ticketId: string };
//===========================================//

export const BodyDeleteQuestionSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		ticketId: {
			type: "string",
			description: "id билета из которого нужно удалить вопрос",
			default: defaultSwaggerValues.ticketId,
		},
		questionId: {
			type: "string",
			description: "id вопроса который нужно удалить",
			default: defaultSwaggerValues.questionId,
		},
	},
	required: ["ticketId", "questionId"],
};
export type BodyDeleteQuestion = { ticketId: string; questionId: string };
//===========================================//
