import type {
	BodyLogin,
	BodyRegister,
} from "./types/controllers/authController";

export const HTTP_STATUSES = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,

	BAD_REQUEST_400: 400,
	FORRIBDEN_403: 403,
	NOT_FOUND_404: 404,
};

export const testRegisterUser: BodyRegister = {
	firstName: "test firstName",
	secondName: "test secondName",
	email: "test@email.com",
	password: "123456",
	department: "1",
};
export const testLoginnedUser: BodyLogin = {
	email: "test@email.com",
	password: "123456",
};
