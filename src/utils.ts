import { BodyLoginModel } from "./modeles/auth/BodyLoginModel";
import { BodyRegisterModel } from "./modeles/auth/BodyRegisterModel";

export const HTTP_STATUSES = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,

	BAD_REQUEST_400: 400,
	FORRIBDEN_403: 403,
	NOT_FOUND_404: 404,
};

export const testRegisterUser: BodyRegisterModel = {
	firstName: "test firstName",
	secondName: "test secondName",
	email: "test@email.com",
	password: "123456",
};
export const testLoginnedUser: BodyLoginModel = {
	email: "test@email.com",
	password: "123456",
};