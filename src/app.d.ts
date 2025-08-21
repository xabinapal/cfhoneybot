import type { D1Database } from "@cloudflare/workers-types";
import type { Database } from "$lib/database";

declare global {
	namespace App {
		interface Locals {
			err: {
				status: number;
				message: string;
			};
			config: {
				enabled: boolean;
			};
			db: Database;
		}
		interface Platform {
			env: {
				DB: D1Database;
				CFHONEYBOT_MAX_REQUESTS_DB: string;
				CFHONEYBOT_DASHBOARD_TOKEN: string;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage;
		}
	}
}

declare module "@sveltejs/kit" {
	interface RequestEvent<Params = Partial<Record<string, string>>, RouteId extends string | null = string | null> {
		platform: App.Platform;
	}
}

export {};
