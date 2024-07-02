import type { Request, Response, Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { registerSwaggerDoc } from "../routes/auth";
import { ticketEditorSwaggerDoc } from "../routes/ticketEditor";
import { examSwaggerDoc } from "../routes/exam";
import { ticketsSwaggerDoc } from "../routes/tickets";
import { userEditorSwaggerDoc } from "../routes/userEditor";
import { questionSwaggerDoc } from "../routes/question";
import { defaultSwaggerValues } from "./settings";

const options: swaggerJSDoc.Options = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: { title: "API описание для АТУ тестирования", version },

		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: defaultSwaggerValues.authToken,
				},
			},
		},
		servers: [
			{
				url: "http://localhost:3333",
				description: "Локальный сервер",
			},
			{
				url: "http://road-rules-backend.webtm.ru",
				description: "Продакшен сервер",
			},
		],
		paths: {
			"/auth/register": registerSwaggerDoc["/auth/register"],
			"/auth/login": registerSwaggerDoc["/auth/login"],
			"/auth/adminLogin": registerSwaggerDoc["/auth/adminLogin"],
			"/auth/deleteUser": registerSwaggerDoc["/auth/deleteUser"],

			"/userEditor/getAllUsers":
				userEditorSwaggerDoc["/userEditor/getAllUsers"],
			"/userEditor/role": userEditorSwaggerDoc["/userEditor/role"],
			"/userEditor/appoint": userEditorSwaggerDoc["/userEditor/appoint"],

			"/ticketEditor/createTicket":
				ticketEditorSwaggerDoc["/ticketEditor/createTicket"],
			"/ticketEditor/createQuestion":
				ticketEditorSwaggerDoc["/ticketEditor/createQuestion"],
			"/ticketEditor/getQuestions":
				ticketEditorSwaggerDoc["/ticketEditor/getQuestions"],
			"/ticketEditor/editQuestion":
				ticketEditorSwaggerDoc["/ticketEditor/editQuestion"],
			"/ticketEditor/deleteTicket":
				ticketEditorSwaggerDoc["/ticketEditor/deleteTicket"],
			"/ticketEditor/deleteQuestion":
				ticketEditorSwaggerDoc["/ticketEditor/deleteQuestion"],

			"/exam": examSwaggerDoc["/exam"],
			"/exam/training": examSwaggerDoc["/exam/training"],
			"/exam/getResult": examSwaggerDoc["/exam/getResult"],
			"/exam/getTrainingResult": examSwaggerDoc["/exam/getTrainingResult"],

			"/tickets": ticketsSwaggerDoc["/tickets"],
			"/tickets/{ticketId}": ticketsSwaggerDoc["/tickets/{ticketId}"],

			"/question": questionSwaggerDoc["/question"],
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
