import type { Request, Response, Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { registerSwaggerDoc } from "../routes/auth";
import { editTicketSwaggerDoc } from "../routes/editTicket";
import { examSwaggerDoc } from "../routes/exam";
import { ticketsSwaggerDoc } from "../routes/tickets";

const options: swaggerJSDoc.Options = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: { title: "API описание для АТУ тестирования", version },

		components: {
			securitySchemes: {
				bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
			},
		},
		servers: [
			{
				url: "http://localhost:3333",
				description: "Локальный сервер",
			},
		],
		paths: {
			"/auth/register": registerSwaggerDoc["/auth/register"],
			"/auth/login": registerSwaggerDoc["/auth/login"],
			"/auth/deleteUser": registerSwaggerDoc["/auth/deleteUser"],
			"/auth/getAllUsers": registerSwaggerDoc["/auth/getAllUsers"],

			"/editor/createTicket": editTicketSwaggerDoc["/editor/createTicket"],
			"/editor/addQuestion": editTicketSwaggerDoc["/editor/addQuestion"],
			"/editor/deleteTicket": editTicketSwaggerDoc["/editor/deleteTicket"],
			"/editor/deleteQuestion": editTicketSwaggerDoc["/editor/deleteQuestion"],

			"/exam/{ticketNumber}": examSwaggerDoc["/exam/{ticketNumber}"],
			"/exam": examSwaggerDoc["/exam"],

			"/tickets/count": ticketsSwaggerDoc["/tickets/count"],
			"/tickets/{ticketNumber}": ticketsSwaggerDoc["/tickets/{ticketNumber}"],
		},
	},
	apis: ["./src/routes/*.ts", "./src/models/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerDocs = (app: Express, port: number) => {
	// swagger page
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	//Docs is JSON format

	app.get("/docs.json", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};

export default swaggerDocs;
