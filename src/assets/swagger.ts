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
			"/api/auth/register": registerSwaggerDoc["/api/auth/register"],
			"/api/auth/login": registerSwaggerDoc["/api/auth/login"],
			"/api/auth/adminLogin": registerSwaggerDoc["/api/auth/adminLogin"],

			"/api/userEditor/getAllUsers":
				userEditorSwaggerDoc["/api/userEditor/getAllUsers"],
			"/api/userEditor/role": userEditorSwaggerDoc["/api/userEditor/role"],
			"/api/userEditor/appoint":
				userEditorSwaggerDoc["/api/userEditor/appoint"],
			"/api/userEditor/deleteUser":
				userEditorSwaggerDoc["/api/userEditor/deleteUser"],
			"/api/userEditor/getExamResult":
				userEditorSwaggerDoc["/api/userEditor/getExamResult"],

			"/api/ticketEditor/createTicket":
				ticketEditorSwaggerDoc["/api/ticketEditor/createTicket"],
			"/api/ticketEditor/createQuestion":
				ticketEditorSwaggerDoc["/api/ticketEditor/createQuestion"],
			"/api/ticketEditor/getQuestions":
				ticketEditorSwaggerDoc["/api/ticketEditor/getQuestions"],
			"/api/ticketEditor/editQuestion":
				ticketEditorSwaggerDoc["/api/ticketEditor/editQuestion"],
			"/api/ticketEditor/deleteTicket":
				ticketEditorSwaggerDoc["/api/ticketEditor/deleteTicket"],
			"/api/ticketEditor/deleteQuestion":
				ticketEditorSwaggerDoc["/api/ticketEditor/deleteQuestion"],
			"/api/ticketEditor/tickets":
				ticketEditorSwaggerDoc["/api/ticketEditor/tickets"],

			"/api/exam": examSwaggerDoc["/api/exam"],
			"/api/exam/training": examSwaggerDoc["/api/exam/training"],
			"/api/exam/getResult": examSwaggerDoc["/api/exam/getResult"],
			"/api/exam/getTrainingResult":
				examSwaggerDoc["/api/exam/getTrainingResult"],

			"/api/tickets": ticketsSwaggerDoc["/api/tickets"],
			"/api/tickets/{ticketId}": ticketsSwaggerDoc["/api/tickets/{ticketId}"],

			"/api/question": questionSwaggerDoc["/api/question"],
		},
	},
	apis: ["./src/routes/*.ts", "./src/models/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerDocs = (app: Express, port: number) => {
	// swagger page
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	//Docs is JSON format

	app.get("/api/docs.json", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};

export default swaggerDocs;
