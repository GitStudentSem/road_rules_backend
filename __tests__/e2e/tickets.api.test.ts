//@ts-ignore
import request from "supertest";
import { app, db } from "../../src/app";
import {
	HTTP_STATUSES,
	testRegisterUser,
	testLoginnedUser,
} from "../../src/utils";
import { onRegister } from "./register.api.test";

const getRequest = () => request(app);

let token: string;
const onLogin = async () => {
	const loginResponse = await getRequest()
		.post("/auth/login")
		.send(testLoginnedUser)
		.expect(HTTP_STATUSES.OK_200);

	token = loginResponse.body.token;

	expect(loginResponse.body).toEqual({
		firstName: testRegisterUser.firstName,
		secondName: testRegisterUser.secondName,
		token: expect.any(String),
	});
};

const onSendAnswer = async (
	ticketNumber: string,
	userAnswer: number,
	questionNumber: number,
	status: number,
) => {
	const ticketCountResponse = await getRequest()
		.post(`/tickets/${ticketNumber}`)
		.set("Authorization", `Bearer ${token}`)
		.send({ userAnswer, questionNumber })
		.expect(status);

	const expectedData = {
		correctAnswer: expect.any(Number),
		help: expect.any(String),
		isCorrect: expect.any(Boolean),
	};
	const expectedError = { message: expect.any(String) };

	expect(ticketCountResponse.body).toEqual(
		status > 299 ? expectedError : expectedData,
	);
};

describe("Получить количество билетов", () => {
	beforeAll(async () => {
		await db.push("./users/", {});
	});

	it("1. Регистрация нового пользователя", async () => {
		await onRegister(HTTP_STATUSES.OK_200);
	});

	it("2. Логин пользователя", onLogin);

	it("3. Получить количество билетов", async () => {
		const ticketCountResponse = await getRequest()
			.get("/tickets/count")
			.set("Authorization", `Bearer ${token}`)
			.expect(HTTP_STATUSES.OK_200);

		expect(ticketCountResponse.body).toEqual({
			ticketsCount: expect.any(Number),
		});
	});
});

describe("Получить билет", () => {
	beforeAll(async () => {
		await db.push("./users/", {});
	});

	it("1. Регистрация нового пользователя", async () => {
		await onRegister(HTTP_STATUSES.OK_200);
	});

	it("2. Логин пользователя", onLogin);

	it("3. Получить 1й билет", async () => {
		const ticketCountResponse = await getRequest()
			.get("/tickets/1")
			.set("Authorization", `Bearer ${token}`)
			.expect(HTTP_STATUSES.OK_200);

		const expectedStructure = [
			{
				question: expect.any(String),
				img: expect.any(String),
				answers: expect.arrayContaining([expect.any(String)]),
			},
		];

		expect(ticketCountResponse.body).toEqual(
			expect.arrayContaining(expectedStructure),
		);
	});

	it("4. Получить не существующий билет", async () => {
		const getTicketRespose = await getRequest()
			.get("/tickets/-1")
			.set("Authorization", `Bearer ${token}`)
			.expect(HTTP_STATUSES.NOT_FOUND_404);

		expect(getTicketRespose.body).toEqual({
			message: expect.any(String),
		});
	});
});

describe("Отправить ответ на вопрос", () => {
	beforeAll(async () => {
		await db.push("./users/", {});
	});

	it("1. Регистрация нового пользователя", async () => {
		await onRegister(HTTP_STATUSES.OK_200);
	});

	it("2. Логин пользователя", onLogin);

	it("3. Отправить ответ на 1й вопрос", async () =>
		await onSendAnswer("1", 1, 2, HTTP_STATUSES.OK_200));

	it("4. Отправить ответ на несуществующий билет", async () =>
		await onSendAnswer("-1", 1, 2, HTTP_STATUSES.NOT_FOUND_404));

	it("5. Отправить несуществующий номер ответа", async () =>
		await onSendAnswer("1", -1, 2, HTTP_STATUSES.NOT_FOUND_404));

	it("6. Отправить несуществующий номер вопроса", async () =>
		await onSendAnswer("1", 1, -1, HTTP_STATUSES.NOT_FOUND_404));
});
