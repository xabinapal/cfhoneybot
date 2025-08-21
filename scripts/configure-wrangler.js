#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const wranglerPath = join(process.cwd(), "wrangler.jsonc");

const dashboardToken = process.env.CFHONEYBOT_DASHBOARD_TOKEN;
if (!dashboardToken) {
	console.error("Error: CFHONEYBOT_DASHBOARD_TOKEN environment variable is not set");
	process.exit(1);
}

const databaseId = process.env.CFHONEYBOT_DATABASE_ID;
if (!databaseId) {
	console.error("Error: CFHONEYBOT_DATABASE_ID environment variable is not set");
	process.exit(1);
}

const content = readFileSync(wranglerPath, "utf8");

let configuredContent = content;
configuredContent = configuredContent.replace("your-secure-token-will-be-here", dashboardToken);
configuredContent = configuredContent.replace("your-database-id-will-be-here", databaseId);

// Write the updated content back to the file
writeFileSync(wranglerPath, configuredContent, "utf8");

console.log(`Successfully updated wrangler.jsonc"`);
