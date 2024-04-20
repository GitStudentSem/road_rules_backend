import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import fs from "fs";
import { sendError } from "./requestAssets.js";
import { TypeQuestion } from "../tickets/types";
import { Response } from "express";

export const tickets = [ticket_1, ticket_2, ticket_3];

const imageToBase64 = (imagePath: string) => {
	const image = fs.readFileSync(imagePath, { encoding: "base64" });
	return image;
};

export const isTicketExist = (ticketNumber: number, res: Response) => {
	if (!ticketNumber) {
		sendError({ message: "Не указан номер билета", res });
		return null;
	}

	const ticketsCount = getCountTickets();

	if (ticketNumber > ticketsCount || ticketNumber < 1) {
		sendError({
			message: `Указанный билет не существует, всего билетов: ${ticketsCount}`,
			res,
		});

		return null;
	}

	return getTiket(ticketNumber);
};

const removeCorrectAnswersFromTicket = (ticket: TypeQuestion[]) => {
	return ticket.map((question) => {
		return {
			...question,
			img: `data:image/jpeg;base64,${imageToBase64(question.img)}`,
			answers: question.answers.map((answer) => answer.text),
		};
	});
};

export const getCountTickets = () => tickets.length;

export const getTiket = (ticketNumber: number) => {
	const ticket = tickets[ticketNumber - 1];
	const ticketWithoutAnswers = removeCorrectAnswersFromTicket(ticket);
	return ticketWithoutAnswers;
};

type TypeCheckUserAnswer = {
	ticketNumber: number;
	userAnswer: number;
	questionNumber: number;
	res: Response;
};
export const checkUserAnswer = ({
	ticketNumber,
	userAnswer,
	questionNumber,
	res,
}: TypeCheckUserAnswer) => {
	const ticket = tickets[ticketNumber - 1];
	if (!ticket) {
		sendError({
			message: `Указанный билет не существует, всего билетов: ${getCountTickets()}`,
			res,
		});
		return null;
	}
	const question = ticket[questionNumber - 1];

	if (!question) {
		sendError({
			message: "Указанный номер вопроса не существует",
			res,
		});
		return null;
	}
	const answer = question.answers[userAnswer - 1];

	if (!answer) {
		sendError({
			message: "Указанный номер ответа не существует",
			res,
		});
		return null;
	}

	return { isCorrect: answer.isCorrect };
};

function randomInteger(min: number, max: number) {
	// случайное число от min до (max+1)
	const rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

export const getExam = () => {
	type ExtendedType = TypeQuestion & {
		ticketNumber: number;
	};

	const questions: ExtendedType[] = [];
	for (let i = 0; i < 20; i++) {
		const ticketNumber = randomInteger(1, tickets.length);
		const question = tickets[ticketNumber - 1][i];
		questions.push({ ...question, ticketNumber });
	}

	const questionsWithoutAnswers = removeCorrectAnswersFromTicket(questions);
	return questionsWithoutAnswers;
};
