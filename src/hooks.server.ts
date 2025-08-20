import { type Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { type Database, createDatabase, initDatabase } from "$lib/database";

let db: Database;

export const handle: Handle = async ({ event, resolve }) => {
	if (!db && !building) {
		db = createDatabase(event.platform?.env?.DB);
		try {
			await initDatabase(db);
		} catch {
			event.locals.err = {
				status: 500,
				message: "Internal Error",
			};

			return await resolve(event);
		}
	}

	event.locals.db = db;

	if (event.url.pathname.startsWith("/dashboard")) {
		const token = event.url.searchParams.get("token");
		if (token !== event.platform?.env?.CFHONEYBOT_DASHBOARD_TOKEN) {
			event.locals.err = {
				status: 401,
				message: "Unauthorized",
			};

			return await resolve(event);
		}
	}

	return await resolve(event);
};
