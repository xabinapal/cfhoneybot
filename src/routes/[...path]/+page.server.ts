import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const ssr = true;
export const csr = false;

export const load: PageServerLoad = async (event) => {
	if (event.locals.err) {
		return error(event.locals.err.status, { message: event.locals.err.message });
	}

	const headers: Record<string, string> = {};
	for (const [key, value] of event.request.headers.entries()) {
		headers[key.toLowerCase()] = value;
	}

	const host = headers["host"] || "";
	delete headers["host"];

	const user_agent = headers["user-agent"] || "";
	delete headers["user-agent"];

	if (event.locals.config.enabled) {
		try {
			await event.locals.db
				.insertInto("requests")
				.values({
					ip: event.getClientAddress(),
					ua: user_agent,
					http: String(event.request.cf?.httpProtocol ?? "unknown"),
					method: event.request.method,
					host: host,
					url: event.url.toString(),
					headers: JSON.stringify(headers),
					body: event.request.body ? await event.request.text() : "",
				})
				.execute();
		} catch (ex) {
			console.error(ex);
			return error(500, "Error logging request");
		}

		const maxRequests = parseInt(event.platform!.env.CFHONEYBOT_MAX_REQUESTS_DB) || 0;
		if (maxRequests > 0) {
			await event.locals.db
				.deleteFrom("requests")
				.where(
					"id",
					"not in",
					event.locals.db.selectFrom("requests").orderBy("ts", "desc").limit(maxRequests).select("id"),
				)
				.execute();
		}
	}

	return {};
};
