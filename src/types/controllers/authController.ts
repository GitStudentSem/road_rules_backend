import { defaultSwaggerValues } from "../../assets/settings";
import type { OpenAPIV3 } from "openapi-types";

//===========================================//
export const BodyRegisterSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя",
			default: defaultSwaggerValues.email,
		},
		password: {
			type: "string",
			description: "Пароль пользователя",
			default: defaultSwaggerValues.password,
		},
		firstName: {
			type: "string",
			description: "Имя пользователя",
			default: "Иван",
		},
		secondName: {
			type: "string",
			description: "Фамилия пользователя",
			default: "Иванов",
		},
		department: {
			type: "string",
			description: "Цех в котором работает пользователь",
			default: "1",
		},
	},
	required: ["email", "password", "firstName", "secondName", "department"],
};
export type BodyRegister = {
	email: string;
	firstName: string;
	secondName: string;
	password: string;
	department: string;
};
//===========================================//

export const ViewRegisterSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя",
			default: defaultSwaggerValues.email,
		},
		firstName: {
			type: "string",
			description: "Имя пользователя",
			default: "Иван",
		},
		secondName: {
			type: "string",
			description: "Фамилия пользователя",
			default: "Иванов",
		},
		userId: {
			type: "string",
			description: "id пользователя пользователя",
			default: "1717440741304",
		},
		token: {
			type: "string",
			default: defaultSwaggerValues.authToken,
			description: "Токен авторизации",
		},
	},
};
export type ViewRegister = {
	email: string;
	firstName: string;
	secondName: string;
	userId: string;
	token: string;
};
//===========================================//

export const BodyLoginSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя",
			default: defaultSwaggerValues.email,
		},
		password: {
			type: "string",
			description: "Пароль пользователя",
			default: defaultSwaggerValues.password,
		},
	},
	required: ["email", "password"],
};
export type BodyLogin = {
	email: string;
	password: string;
};
//===========================================//

export const ViewLoginSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		firstName: {
			type: "string",
			default: "Иван",
			description: "Имя",
		},
		secondName: {
			type: "string",
			default: "Иванов",
			description: "Фамилия",
		},
		isAppointExam: {
			type: "boolean",
			default: "false",
			description: "назначен ли экзамен пользователю",
		},
		token: {
			type: "string",
			default: defaultSwaggerValues.authToken,
			description: "Токен авторизации",
		},
	},
};
export type ViewLogin = {
	token: string;
	firstName: string;
	secondName: string;
	isAppointExam: boolean;
};
//===========================================//
