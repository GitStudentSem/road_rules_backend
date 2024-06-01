import express from "express";
import cors from "cors";

import { getAuthRouter } from "./routes/auth";
import { getTicketsRouter } from "./routes/tickets";
import { getExamRouter } from "./routes/exam";
import { editTicketRouter } from "./routes/editTicket";

export const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", getAuthRouter());
app.use("/tickets", getTicketsRouter());
app.use("/exam", getExamRouter());
app.use("/editTicket", editTicketRouter());
