import type { Request, Response, Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { registerSwaggerDoc } from "../routes/auth";
import { editorSwaggerDoc } from "../routes/editor";
import { examSwaggerDoc } from "../routes/exam";
import { ticketsSwaggerDoc } from "../routes/tickets";

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
			"/auth/getAllUsers": registerSwaggerDoc["/auth/getAllUsers"],

			"/editor/createTicket": editorSwaggerDoc["/editor/createTicket"],
			"/editor/addQuestion": editorSwaggerDoc["/editor/addQuestion"],
			"/editor/editQuestion": editorSwaggerDoc["/editor/editQuestion"],
			"/editor/deleteTicket": editorSwaggerDoc["/editor/deleteTicket"],
			"/editor/deleteQuestion": editorSwaggerDoc["/editor/deleteQuestion"],

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
