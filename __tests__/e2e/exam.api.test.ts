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
	status: number,
	ticketNumber: string,
	answerId: string,
	questionNumber: number,
) => {
	const getExamRespose = await getRequest()
		.post(`/exam/${ticketNumber}`)
		.set("Authorization", `Bearer ${token}`)
		.send({ answerId, questionNumber })
		.expect(status);

	const expectedData = {
		isCorrect: expect.any(Boolean),
		correctAnswer: expect.any(String),
		help: expect.any(String),
	};
	const expectedError = { message: expect.any(String) };

	expect(getExamRespose.body).toEqual(
		status > 299 ? expectedError : expectedData,
	);
};

describe("Получить билет на экзамен", () => {
	beforeAll(async () => {
		await db.push("./users/", {});
	});

	it("1. Регистрация нового пользователя", async () => {
		await onRegister(HTTP_STATUSES.OK_200);
	});

	it("2. Логин пользователя", async () => await onLogin());

	it("3. Получить экзамен", async () => {
		const ticketCountResponse = await getRequest()
			.get("/exam")
			.set("Authorization", `Bearer ${token}`)
			.expect(HTTP_STATUSES.OK_200);

		const expectedStructure = [
			{
				question: expect.any(String),
				img: expect.any(String),
				ticketNumber: expect.any(Number),
				answers: expect.arrayContaining([
					{ answerText: expect.any(String), id: expect.any(String) },
				]),
			},
		];

		expect(ticketCountResponse.body).toEqual(
			expect.arrayContaining(expectedStructure),
		);
	});

	it("4. Получить экзамен с неправильным токеном авторизации", async () => {
		const getTicketRespose = await getRequest()
			.get("/exam")
			.set("Authorization", "Bearer invalid_token}")
			.expect(HTTP_STATUSES.FORRIBDEN_403);

		expect(getTicketRespose.body).toEqual({
			message: expect.any(String),
		});
	});

	it("5. Получить экзамен без токена авторизации", async () => {
		const getTicketRespose = await getRequest()
			.get("/exam")
			.expect(HTTP_STATUSES.FORRIBDEN_403);

		expect(getTicketRespose.body).toEqual({
			message: expect.any(String),
		});
	});
});

describe("Отправить ответ на вопрос по экзамену", () => {
	beforeAll(async () => {
		await db.push("./users/", {});
	});

	it("1. Регистрация нового пользователя", async () => {
		await onRegister(HTTP_STATUSES.OK_200);
	});

	it("2. Логин пользователя", async () => await onLogin());

	it("3. Отправить корректный ответ на вопрос по экзамену", async () => {
		onSendAnswer(HTTP_STATUSES.OK_200, "1", "1_1_1", 1);
	});

	it("4. Отправить несуществующий билет", async () => {
		onSendAnswer(HTTP_STATUSES.NOT_FOUND_404, "-1", "1_1_1", 1);
	});

	it("5. Отправить несуществующий ответ", async () => {
		onSendAnswer(HTTP_STATUSES.OK_200, "1", "-1_1_1", 1);
	});

	it("6. Отправить несуществующий вопрос", async () => {
		onSendAnswer(HTTP_STATUSES.NOT_FOUND_404, "1", "1_1_1", -1);
	});
});
