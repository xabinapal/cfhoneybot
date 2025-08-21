import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const ssr = false;
export const csr = true;

const PAGE_LIMIT = 10;

export const load: PageServerLoad = async (event) => {
	if (event.locals.err) {
		return error(event.locals.err.status, { message: event.locals.err.message });
	}

	try {
		// Get query parameters
		const search = event.url.searchParams.get("search") || "";
		const analyzed = event.url.searchParams.get("analyzed") || "all";
		const page = parseInt(event.url.searchParams.get("page") || "1");

		let query = event.locals.db.selectFrom("requests");

		// Apply filters
		if (search) {
			query = query.where((eb) =>
				eb.or([
					eb("ip", "like", `%${search}%`),
					eb("ua", "like", `%${search}%`),
					eb("url", "like", `%${search}%`),
					eb("description", "like", `%${search}%`),
				]),
			);
		}

		if (analyzed !== "all") {
			const analyzedValue = Number(analyzed === "true");
			query = query.where("analyzed", "=", analyzedValue);
		}

		// Get total count
		const total = await query
			.select("id")
			.execute()
			.then((rows) => rows.length);

		// Apply pagination and ordering
		const requests = await query
			.selectAll()
			.orderBy("id", "desc")
			.limit(PAGE_LIMIT)
			.offset((page - 1) * PAGE_LIMIT)
			.execute();

		// Parse headers JSON for each result
		const processedResults = requests?.map((row: any) => ({
			...row,
			headers: JSON.parse(row.headers || "{}"),
		}));

		const totalPages = Math.ceil(total / PAGE_LIMIT);

		return {
			config: event.locals.config,
			requests: processedResults,
			pagination: {
				currentPage: page,
				totalPages,
				limitRequests: PAGE_LIMIT,
				totalRequests: total,
			},
			filters: {
				search,
				analyzed,
			},
		};
	} catch {
		return error(500, "Error loading requests");
	}
};

export const actions: Actions = {
	enable: async (event) => {
		if (event.locals.err) {
			return fail(event.locals.err.status, event.locals.err.message);
		}

		try {
			const formData = await event.request.formData();
			const enabled = formData.get("enabled") === "on" ? 1 : 0;

			await event.locals.db
				.updateTable("config")
				.set({
					enabled: enabled as number,
				})
				.execute();

			return { success: true, message: "Config updated" };
		} catch {
			return fail(500, { error: "Error updating config" });
		}
	},
	update: async (event) => {
		if (event.locals.err) {
			return fail(event.locals.err.status, event.locals.err.message);
		}

		try {
			const formData = await event.request.formData();
			const id = formData.get("id");
			const description = formData.get("description");
			const analyzed = formData.get("analyzed") === "on" ? 1 : 0;

			if (!id) {
				return fail(400, { error: "Request ID is required" });
			}

			await event.locals.db
				.updateTable("requests")
				.set({
					description: description as string,
					analyzed: analyzed as number,
				})
				.where("id", "=", parseInt(id as string))
				.execute();

			return { success: true, message: "Request updated" };
		} catch {
			return fail(500, { error: "Error updating request" });
		}
	},

	delete: async (event) => {
		if (event.locals.err) {
			return fail(event.locals.err.status, event.locals.err.message);
		}

		try {
			const formData = await event.request.formData();
			const id = formData.get("id");

			if (!id) {
				return fail(400, { error: "Request ID is required" });
			}

			await event.locals.db
				.deleteFrom("requests")
				.where("id", "=", parseInt(id as string))
				.execute();

			return { success: true, message: "Request deleted" };
		} catch {
			return fail(500, { error: "Error deleting request" });
		}
	},
};
