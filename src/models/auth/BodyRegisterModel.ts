import { defaultSwaggerValues } from "../../assets/settings";

export const BodyRegisterModelSwaggerDoc = {
	type: "object",
	properties: {
		email: {
			type: "string",
			description: "Почта пользователя",
			default: defaultSwaggerValues.email,
			required: true,
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

export type BodyRegisterModel = {
	email: string;
	firstName: string;
	secondName: string;
	password: string;
	department: string;
};
