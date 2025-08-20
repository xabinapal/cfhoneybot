import type { ColumnType } from "kysely";
import { Kysely, sql } from "kysely";
import { D1Dialect } from "kysely-d1";

export type Database = Kysely<Schema>;

export interface Schema {
	requests: Requests;
}

export interface Requests {
	id: ColumnType<number, never, never>;
	ts: ColumnType<Date, never, never>;

	ip: ColumnType<string, string, never>;
	ua: ColumnType<string, string, never>;
	http: ColumnType<string, string, never>;
	method: ColumnType<string, string, never>;
	host: ColumnType<string, string, never>;
	url: ColumnType<string, string, never>;
	headers: ColumnType<string, string, never>;
	body: ColumnType<string, string, never>;

	description: ColumnType<string, never, string>;
	analyzed: ColumnType<number, never, number>;
}

export function createDatabase(db?: D1Database): Database {
	if (!db) {
		throw new Error("Database is not available");
	}

	return new Kysely<Schema>({
		dialect: new D1Dialect({ database: db }),
	});
}

export async function initDatabase(db: Database): Promise<void> {
	await db.schema
		.createTable("requests")
		.ifNotExists()
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("ts", "datetime", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("ip", "text", (col) => col.notNull())
		.addColumn("ua", "text", (col) => col.notNull())
		.addColumn("http", "text", (col) => col.notNull())
		.addColumn("method", "text", (col) => col.notNull())
		.addColumn("host", "text", (col) => col.notNull())
		.addColumn("url", "text", (col) => col.notNull())
		.addColumn("headers", "text", (col) => col.defaultTo(""))
		.addColumn("body", "text", (col) => col.defaultTo(""))
		.addColumn("description", "text", (col) => col.defaultTo(""))
		.addColumn("analyzed", "integer", (col) => col.defaultTo(0))
		.execute();
}
