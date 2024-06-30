import type { Request, Response, Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { registerSwaggerDoc } from "../routes/auth";
import { ticketEditorSwaggerDoc } from "../routes/ticketEditor";
import { examSwaggerDoc } from "../routes/exam";
import { ticketsSwaggerDoc } from "../routes/tickets";
import { userEditorSwaggerDoc } from "../routes/userEditor";

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
					description:
						"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MTc0NDA3NDEzMDQiLCJpYXQiOjE3MTc0NDI1MjAsImV4cCI6MTcyMDAzNDUyMH0.imiX_CYuKDB1u58elXLfQfE8_oNpO8rvh3Uk2fkWEsU",
				},
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

			"/userEditor/getAllUsers":
				userEditorSwaggerDoc["/userEditor/getAllUsers"],
			"/userEditor/role": userEditorSwaggerDoc["/userEditor/role"],
			"/userEditor/appoint": userEditorSwaggerDoc["/userEditor/appoint"],

			"/ticketEditor/createTicket":
				ticketEditorSwaggerDoc["/ticketEditor/createTicket"],
			"/ticketEditor/getQuestions":
				ticketEditorSwaggerDoc["/ticketEditor/getQuestions"],
			"/ticketEditor/addQuestion":
				ticketEditorSwaggerDoc["/ticketEditor/addQuestion"],
			"/ticketEditor/editQuestion":
				ticketEditorSwaggerDoc["/ticketEditor/editQuestion"],
			"/ticketEditor/deleteTicket":
				ticketEditorSwaggerDoc["/ticketEditor/deleteTicket"],
			"/ticketEditor/deleteQuestion":
				ticketEditorSwaggerDoc["/ticketEditor/deleteQuestion"],

			"/exam": examSwaggerDoc["/exam"],
			"/exam/training": examSwaggerDoc["/exam/training"],

			"/tickets": ticketsSwaggerDoc["/tickets"],
			"/tickets/{ticketId}": ticketsSwaggerDoc["/tickets/{ticketId}"],
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
