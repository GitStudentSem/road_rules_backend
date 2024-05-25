import { app } from "./app";
import { colors, resetStyle, styles } from "./assets/logStyles";
import { runDb } from "./repositories/db";

const port = process.env.PORT || 3333;

const startApp = async () => {
	await runDb();

	app.listen(port, () => {
		console.log(`${colors.green}${styles.bold}Server OK${resetStyle}`);

		console.log(
			`Адрес сервера: ${colors.whiteblue}http://localhost:${port}${resetStyle}`,
		);
	});
};
startApp();
