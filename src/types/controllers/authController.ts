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
		autoSchoolName: {
			type: "string",
			description: "Цех в котором работает пользователь",
			default: "1",
		},
	},
	required: ["email", "password", "firstName", "secondName", "autoSchoolName"],
};
export type BodyRegister = {
	email: string;
	firstName: string;
	secondName: string;
	password: string;
	autoSchoolName: string;
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
		avatar: { type: "string", default: "", description: "Аватар пользователя" },
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
	avatar: string;
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
		avatar: { type: "string", default: "", description: "Аватар пользователя" },
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
		userId: {
			type: "string",
			description: "id пользователя пользователя",
			default: "1717440741304",
		},
	},
};
export type ViewLogin = {
	token: string;
	firstName: string;
	secondName: string;
	avatar: string;
	userId: string;
	isAppointExam: boolean;
};
//===========================================//

export const BodySetAvatarSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		avatar: {
			type: "string",
			format: "binary",
			description: "Аватар пользователя (отправьте null для удаления)",
		},
	},
};
export type BodySetAvatar = {
	avatar: ArrayBuffer | null;
};

//===========================================//

//===========================================//

export const ViewSetAvatarSwaggerDoc: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		avatar: {
			type: "string",
			description: "Аватар пользователя",
		},
	},
};
export type ViewSetAvatar = {
	avatar: string;
};
//===========================================//
