import { ticket_1, ticket_2, ticket_3 } from "../tickets/index.js";
import fs from "fs";
// const answersData = [
// 	[2, 1, 1, 4, 2, 2, 4, 3, 1, 3, 1, 3, 3, 1, 3, 4, 3, 4, 3, 2],
// 	[2, 1, 1, 3, 3, 1, 3, 3, 1, 3, 3, 2, 3, 3, 1, 3, 2, 1, 3, 3],
// 	[1, 3, 3, 2, 2, 3, 2, 1, 3, 3, 3, 2, 2, 1, 3, 3, 4, 2, 3, 3],
// ];

const imageToBase64 = (imagePath) => {
	const image = fs.readFileSync(imagePath, { encoding: "base64" });
	return image;
};
export const tickets = [ticket_1, ticket_2, ticket_3];

export const getCountTickets = () => tickets.length;

export const getTiket = (ticketNumber) => {
	const ticket = tickets[ticketNumber - 1];
	// console.log("ticket", ticket);
	const ticketWithoutAnswers = ticket.map((question) => {
		return {
			...question,
			img: imageToBase64(question.img),
			answers: question.answers.map((answer) => answer.text),
		};
	});
	return ticketWithoutAnswers;
};
console.log("ticketWithoutAnswers(", getTiket(1));
