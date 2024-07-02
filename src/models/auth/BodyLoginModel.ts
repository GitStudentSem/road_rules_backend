import { defaultSwaggerValues } from "../../assets/settings";

export const BodyLoginModelSwaggerDoc = {
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

export type BodyLoginModel = {
	email: string;
	password: string;
};
