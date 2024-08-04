import { defaultSwaggerValues } from "../../assets/settings";
import type { OpenAPIV3 } from "openapi-types";

//===========================================//
export const ViewSendTicketsSwaggerDoc: OpenAPIV3.SchemaObject = {
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
export type ViewSendTickets = { ticketId: string };
//===========================================//

export const ParamsSendTicketSwaggerDoc = {
	name: "ticketId",
	in: "path",
	description: "id билета",
	required: true,
	default: defaultSwaggerValues.ticketId,
};
export type ParamsSendTicket = { ticketId: string };
//===========================================//

export const ViewSendTicketSwaggerDoc = {
	type: "object",
	properties: {
		question: {
			type: "string",
			description: "Вопрос билета",
			default: "В каком направлении вам разреено движение?",
		},
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
export type ViewSendTicket = {
	question: string;
	ticketId: string;
	questionId: string;
	img: string;
	answers: {
		answerText: string;
		answerId: string;
	}[];
};
//===========================================//
export const BodySendTicketResultSwaggerDoc: OpenAPIV3.SchemaObject = {
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
	},
};
export type BodySendTicketResult = {
	ticketId: string;
	questionId: string;
	answerId: string;
};
//===========================================//

export const ViewSendTicketResultSwaggerDoc: OpenAPIV3.SchemaObject = {
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
export type ViewSendTicketResult = {
	isCorrect: boolean;
	correctAnswer: string;
	help: string;
};
//===========================================//
