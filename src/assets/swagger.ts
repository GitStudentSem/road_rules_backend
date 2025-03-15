import type { Request, Response, Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { registerSwaggerDoc } from "../routes/auth";
import { ticketEditorSwaggerDoc } from "../routes/ticketEditor";
import { examSwaggerDoc } from "../routes/exam";
import { ticketsSwaggerDoc } from "../routes/tickets";
import { userEditorSwaggerDoc } from "../routes/userEditor";
import { defaultSwaggerValues } from "./settings";
import { commentsSwaggerDoc } from "../routes/comments";
import { commentsConnectSwaggerDoc } from "..";

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
			...commentsConnectSwaggerDoc,
			...registerSwaggerDoc,
			...userEditorSwaggerDoc,
			...ticketEditorSwaggerDoc,
			...examSwaggerDoc,
			...ticketsSwaggerDoc,
			...commentsSwaggerDoc,
		},
	},
	apis: ["./src/routes/*.ts", "./src/models/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
export const swaggerDocPath = "/api/docs";
const swaggerDocs = (app: Express, port: number) => {
	// swagger page
	app.use(swaggerDocPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	//Docs is JSON format

	app.get("/api/docs.json", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};

export default swaggerDocs;
