import type { OpenAPIV3 } from "openapi-types";
import { defaultSwaggerValues } from "../../assets/settings";
// import type { Answer } from "../DBModels";

//===========================================//
export const ViewClearQuestionInfoSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		question: {
			type: "string",
			default: "В каком направлении разрешен поворот?",
			description: "Текст вопроса",
		},
		img: {
			type: "string",
			format: "binary",
			description: "Картинка в виде ArrayBuffer",
		},
		help: {
			type: "string",
			default: "В направлении движения по полосам",
			description: "Текст помощи по вопросу",
		},
		questionId: {
			type: "string",
			description: "id варианта вопроса",
			default: defaultSwaggerValues.questionId,
		},
		userAnswerId: {
			type: "string",
			description: "id варианта ответа который дал пользователь",
			default: defaultSwaggerValues.answerId,
		},
		answers: {
			type: "array",
			description: "Варианты ответов на вопрос",
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
					isCorrect: {
						type: "boolean",
						description: "правильный ли ответ",
						default: "true",
					},
				},
			},
		},
	},
};
export type ViewClearQuestionInfo = {
	question: string;
	img: string;
	help: string;
	questionId: string;
	userAnswerId: string;
	answers: {
		answerText: string;
		answerId: string;
		isCorrect: boolean;
	}[];
};
//===========================================//

export const ViewUserInfoSwaggerDoc = {
	type: "object",
	properties: {
		email: {
			type: "string",
			default: defaultSwaggerValues.email,
			description: "Почта пользователя",
		},
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя пользователя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия пользователя",
		},
		role: {
			type: "string",
			default: "user",
			description: "Роль пользователя",
		},
		isAppointExam: {
			type: "boolean",
			default: "false",
			description: "Назначен ли экзамен для пользователя",
		},
		department: {
			type: "string",
			default: "1",
			description: "Цех в котором работает пользователь",
		},
	},
};
export type ViewUserInfo = {
	email: string;
	firstName: string;
	secondName: string;
	isAppointExam: boolean;
	role: "superadmin" | "admin" | "user";
	department: string;
};
//===========================================//

export const ViewUserInfoResultExamSwaggerDoc = {
	type: "object",
	properties: {
		email: {
			type: "string",
			default: defaultSwaggerValues.email,
			description: "Почта пользователя",
		},
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя пользователя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия пользователя",
		},
		role: {
			type: "string",
			default: "user",
			description: "Роль пользователя",
		},
		isAppointExam: {
			type: "boolean",
			default: "false",
			description: "Назначен ли экзамен для пользователя",
		},
		department: {
			type: "string",
			default: "1",
			description: "Цех в котором работает пользователь",
		},
		passAt: {
			type: "string",
			default: 869674968368,
			description: "Дата сдачи экзамена",
		},
	},
};
export type ViewUserInfoResultExam = {
	email: string;
	firstName: string;
	secondName: string;
	isAppointExam: boolean;
	role: "superadmin" | "admin" | "user";
	department: string;
	passAt: number;
};
//===========================================//

export const BodyGetUsersWithResultExamSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		isPassExam: {
			type: "boolean",
			default: true,
			description: "Пользователи которые сдали или не сдали экзамен",
		},
	},
	required: ["isPassExam"],
};
export type BodyGetUsersWithResultExam = { isPassExam: boolean };
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

export const BodyIsBannedForChatSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		isBannedForChat: {
			type: "boolean",
			description: "Заблокирован ли чат для пользователя",
			default: "false",
		},
		email: {
			type: "string",
			description: "Почта пользователя для которого нужно назначить экзамен",
			default: defaultSwaggerValues.email,
		},
	},
	required: ["isBannedForChat", "email"],
};
export type BodyIsBannedForChat = { isBannedForChat: boolean; email: string };
//===========================================//

export const BodyDeleteUserSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя для которого нужно назначить экзамен",
			default: defaultSwaggerValues.email,
		},
	},
	required: ["email"],
};
export type BodyDeleteUser = { email: string };
//===========================================//

export const BodyGetExamResultSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя для которого нужно назначить экзамен",
			default: defaultSwaggerValues.email,
		},
	},
	required: ["email"],
};
export type BodyGetExamResult = { email: string };
//===========================================//

export const BodySetRoleSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		email: {
			type: "string",
			default: defaultSwaggerValues.email,
			description: "Почта пользователя",
		},
		role: {
			type: "string",
			default: "user",
			description: "Роль пользователя 'user' или 'admin'",
		},
	},
	required: ["email", "role"],
};
export type BodySetRole = { email: string; role: "user" | "admin" };
//===========================================//
