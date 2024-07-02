import { defaultSwaggerValues } from "../../assets/settings";

export const UserRegisterViewModelSwaggerDoc = {
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
	},
};

export type UserRegisterViewModel = {
	email: string;
	firstName: string;
	secondName: string;
	userId: string;
};
