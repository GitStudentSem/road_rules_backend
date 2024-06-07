import { app } from "./app";
import { colors, resetStyle, styles } from "./assets/logStyles";
import { runDb } from "./repositories/db";
import swaggerDocs from "./assets/swagger";

const port = process.env.PORT || 3333;

const startApp = async () => {
	await runDb();

	app.listen(port, () => {
		swaggerDocs(app, +port);
		console.log(`${colors.green}${styles.bold}Server OK${resetStyle}`);

		console.log(
			`Адрес сервера: ${colors.whiteblue}http://localhost:${port}${resetStyle}`,
		);

		console.log(
			`Адрес документации: ${colors.whiteblue}http://localhost:${port}/docs${resetStyle}`,
		);
	});
};
startApp();
