import express from "express";
import cors from "cors";

import { getAuthRouter } from "./routes/auth";

import { JsonDB, Config } from "node-json-db";
import { getTicketsRouter } from "./routes/tickets";
import { getExamRouter } from "./routes/exam";

export const app = express();
app.use(cors());

app.use(express.json());

export const db = new JsonDB(new Config("myDataBase", true, true, "/"));

app.use("/auth", getAuthRouter());
app.use("/tickets", getTicketsRouter());
app.use("/exam", getExamRouter());
/* =========================== */

// 1.5MB (1)
// 1.8MB (2)
// 1.7MB (3)
