import { MongoClient } from "mongodb";
import { colors, resetStyle, styles } from "../assets/logStyles";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);

export const DB_NAME = "road-rules";
export const USER_COLLECTION_DB_NAME = "user-info";

export const userCollection = client
	.db(DB_NAME)
	.collection<UserLoginDBModel>(USER_COLLECTION_DB_NAME);

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
