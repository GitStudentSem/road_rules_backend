import { MongoClient, ServerApiVersion } from "mongodb";
import { colors, resetStyle, styles } from "../assets/logStyles";
import type { UserLoginDBModel } from "../models/auth/UserLoginDBModel";
import type { TicketsDBModel } from "../models/ticketEditor/TicketsDBModel";
require("dotenv").config();

const URL_LOCAL_DB = "mongodb://0.0.0.0:27017";
const mongoUri = process.env.URL_CLOUD_DB || URL_LOCAL_DB;

const client = new MongoClient(mongoUri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const DB_NAME = "road-rules";
const USER_COLLECTION_DB_NAME = "user-info";

export const userCollection = client
	.db(DB_NAME)
	.collection<UserLoginDBModel>(USER_COLLECTION_DB_NAME);

const TICKETS_COLLECTION_NAME = "tickets";
export const ticketCollection = client
	.db(DB_NAME)
	.collection<TicketsDBModel>(TICKETS_COLLECTION_NAME);

export const runDb = async () => {
	try {
		await client.connect();

		await client.db(DB_NAME).command({ ping: 1 });

		console.log(
			`${colors.green}${styles.bold}Conected successfully to mongo server${resetStyle}`,
		);
	} catch (error) {
		console.log(
			`${colors.red}${styles.bold}Can not connect to DB${resetStyle}`,
		);
		console.log(`${colors.red}${styles.bold} DB error: ${error}`);
		await client.close();
	}
};
