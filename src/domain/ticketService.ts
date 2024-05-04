import { getCountTickets } from "../assets/ticketsAssets";
import { ticketRepository } from "../repositories/ticketRepository";

export const ticketService = {
	async sendTicketsCount(userId: string) {
		await ticketRepository.sendTicketsCount(userId);
		return getCountTickets();
	},
};
