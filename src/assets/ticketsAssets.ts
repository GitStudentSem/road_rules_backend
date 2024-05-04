import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import fs from "node:fs";
import { sendError } from "./requestAssets";
import type { TypeQuestion } from "../types";
import type { Response } from "express";
import { HTTP_STATUSES } from "../utils";

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
			status: HTTP_STATUSES.NOT_FOUND_404,
			res,
		});

		return null;
	}

	return getTiket(ticketNumber);
};

const removeCorrectAnswersFromTicket = (ticket: TypeQuestion[]) => {
	return ticket.map((question) => {
		return {
			question: question.question,
			img: question.img
				? `data:image/jpeg;base64,${imageToBase64(question.img)}`
				: "",
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
	questionNumber,
	userAnswer,
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

	if (questionNumber < 1 || ticket.length < questionNumber) {
		sendError({
			message: `Указанный номер вопроса не найден, всего вопросов: ${ticket.length}`,
			status: HTTP_STATUSES.NOT_FOUND_404,
			res,
		});
		return;
	}
	const answersLength = ticket[questionNumber - 1].answers.length;

	if (userAnswer < 1 || userAnswer > answersLength) {
		sendError({
			message: `Указанный номер ответа не найден, всего ответов: ${answersLength}`,
			status: HTTP_STATUSES.NOT_FOUND_404,
			res,
		});
		return;
	}

	const question = ticket[questionNumber - 1];

	if (!question) {
		sendError({
			message: "Указанный номер вопроса не существует",
			res,
		});
		return null;
	}

	const correctAnswer =
		question.answers.findIndex((question) => question.isCorrect) + 1 || -1; // Просто отрицательное число, что бы бло ясно что он не нашелся

	const isCorrect = correctAnswer === userAnswer;
	return {
		isCorrect,
		correctAnswer,
		help: isCorrect ? "" : question.help,
	};
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
	const questionsWithTicketNumber = questionsWithoutAnswers.map(
		(question, i) => {
			return { ...question, ticketNumber: questions[i].ticketNumber };
		},
	);
	return questionsWithTicketNumber;
};
