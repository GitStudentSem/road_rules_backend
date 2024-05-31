import express from "express";
import * as editTicketController from "../controllers/editTicket";

export const editTicketRouter = () => {
	const router = express.Router();

	router.post("/addQuestion", editTicketController.addQuestion);
	router.get("/createTicket", editTicketController.createTicket);

	return router;
};
