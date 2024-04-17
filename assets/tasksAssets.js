import { ticket_1, ticket_2, ticket_3 } from "../tickets/index.js";
import fs from "fs";
import { sendError } from "./requestAssets.js";
// const answersData = [
// 	[2, 1, 1, 4, 2, 2, 4, 3, 1, 3, 1, 3, 3, 1, 3, 4, 3, 4, 3, 2],
// 	[2, 1, 1, 3, 3, 1, 3, 3, 1, 3, 3, 2, 3, 3, 1, 3, 2, 1, 3, 3],
// 	[1, 3, 3, 2, 2, 3, 2, 1, 3, 3, 3, 2, 2, 1, 3, 3, 4, 2, 3, 3],
// ];

const imageToBase64 = (imagePath) => {
	const image = fs.readFileSync(imagePath, { encoding: "base64" });
	return image;
};

export const isTicketExist = (ticketNumber, res) => {
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

const removeCorrectAnswersFromTicket = (ticket) => {
	return ticket.map((question) => {
		return {
			...question,
			img: `data:image/jpeg;base64,${imageToBase64(question.img)}`,
			answers: question.answers.map((answer) => answer.text),
		};
	});
};

export const tickets = [ticket_1, ticket_2, ticket_3];

export const getCountTickets = () => tickets.length;

export const getTiket = (ticketNumber) => {
	const ticket = tickets[ticketNumber - 1];
	const ticketWithoutAnswers = removeCorrectAnswersFromTicket(ticket);
	return ticketWithoutAnswers;
};

export const checkUserAnswer = ({
	ticketNumber,
	userAnswer,
	questionNumber,
	res,
}) => {
	const ticket = tickets[ticketNumber - 1];
	if (!ticket) {
		sendError({
			message: `Указанный билет не существует, всего билетов: ${ticketsCount}`,
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
