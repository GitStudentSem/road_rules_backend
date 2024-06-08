export const SendTicketsViewModelSwaggerDoc = {
	type: "array",
	items: {
		type: "object",
		properties: {
			ticketId: {
				type: "string",
				example: "8694939581",
			},
		},
	},
};
export type SendTicketsViewModel = { ticketId: string }[];
