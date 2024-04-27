//@ts-ignore
import request from "supertest";
import { app, db } from "../../src/app";
import { HTTP_STATUSES, testRegisterUser } from "../../src/utils";

const getRequest = () => request(app);

export const onRegister = async (
	status: number,
	body?: { [key: string]: string },
) => {
	const expectedData = {
		email: testRegisterUser.email,
		firstName: testRegisterUser.firstName,
		secondName: testRegisterUser.secondName,
		_id: expect.any(String),
	};
	const expectedError = { message: expect.any(String) };

	const registerResponse = await getRequest()
		.post("/auth/register")
		.send({ ...testRegisterUser, ...body })
		.expect(status);

	expect(registerResponse.body).toEqual(
		status > 299 ? expectedError : expectedData,
	);
};

describe("Регистрация", () => {
	beforeAll(async () => {
		await db.push("./users/", {});
	});

	it("1. Регистрация нового пользователя", async () => {
		await onRegister(HTTP_STATUSES.OK_200);
	});

	it("2. Регистрация уже существующего пользователя", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400);
	});

	it("3. Регистрация пользователя c невалидной почтой", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400, {
			email: "unknown_user.com",
		});
	});

	it("4. Регистрация пользователя c пустой почтой", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400, { email: "" });
	});

	it("4. Регистрация пользователя c пробелами вместо почты", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400, { email: "     " });
	});

	it("5. Регистрация пользователя c пустым паролем", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400, { password: "" });
	});

	it("6. Регистрация пользователя c неправильным паролем", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400, { password: "__**__" });
	});

	it("7. Регистрация пользователя c коротким паролем", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400, { password: "__**__" });
	});

	it("7. Регистрация пользователя c пробелами вместо пароля", async () => {
		await onRegister(HTTP_STATUSES.BAD_REQUEST_400, { password: "      " });
	});
});
