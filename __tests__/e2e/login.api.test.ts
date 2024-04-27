//@ts-ignore
import request from "supertest";
import { app, db } from "../../src/app";
import {
	HTTP_STATUSES,
	testLoginnedUser,
	testRegisterUser,
} from "../../src/utils";
import { onRegister } from "./register.api.test";

const getRequest = () => request(app);

const onLogin = async (status: number, body?: { [key: string]: string }) => {
	const registerResponse = await getRequest()
		.post("/auth/login")
		.send({ ...testLoginnedUser, ...body })
		.expect(status);

	const expectedData = {
		firstName: testRegisterUser.firstName,
		secondName: testRegisterUser.secondName,
		token: expect.any(String),
	};

	const expectedError = { message: expect.any(String) };

	expect(registerResponse.body).toEqual(
		status > 299 ? expectedError : expectedData,
	);
};

describe("Логин", () => {
	beforeAll(async () => {
		await db.push("./users/", {});
	});

	it("1. Регистрация нового пользователя", async () => {
		await onRegister(HTTP_STATUSES.OK_200);
	});

	it("2. Логин пользователя", async () => {
		await onLogin(HTTP_STATUSES.OK_200);
	});

	it("3. Логин пользователя c неправильной почтой", async () => {
		await onLogin(HTTP_STATUSES.NOT_FOUND_404, { email: "unknown@user.com" });
	});

	it("4. Логин пользователя c невалидной почтой", async () => {
		await onLogin(HTTP_STATUSES.BAD_REQUEST_400, { email: "unknown_user.com" });
	});

	it("5. Логин пользователя c пустой почтой", async () => {
		await onLogin(HTTP_STATUSES.BAD_REQUEST_400, { email: "" });
	});

	it("6. Логин пользователя c пустым паролем", async () => {
		await onLogin(HTTP_STATUSES.BAD_REQUEST_400, { password: "" });
	});

	it("7. Логин пользователя c неправильным паролем", async () => {
		await onLogin(HTTP_STATUSES.BAD_REQUEST_400, { password: "__**__" });
	});

	it("8. Логин пользователя c коротким паролем", async () => {
		await onLogin(HTTP_STATUSES.BAD_REQUEST_400, { password: "__**__" });
	});
});
