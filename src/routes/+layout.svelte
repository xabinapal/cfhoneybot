<script>
	import "../app.css";

	const env = import.meta.env;
</script>

<svelte:head>
	<title>{env["HONEYBOT_META_TITLE"]}</title>

	<meta charset="utf-8" />
	<meta name="robots" content="index,follow" />
	<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />

	<!-- Primary Meta Tags -->
	<meta name="title" content={env["HONEYBOT_META_TITLE"]} />
	<meta name="description" content={env["HONEYBOT_META_DESCRIPTION"]} />
	<meta name="author" content={env["HONEYBOT_META_AUTHOR"]} />
	<meta name="keywords" content={env["HONEYBOT_META_KEYWORDS"]} />
	<meta name="theme-color" content={env["HONEYBOT_META_THEME_COLOR"]} />

	<!-- Canonical URL -->
	<link rel="canonical" href={env["HONEYBOT_BASE_URL"]} />

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="{env['HONEYBOT_BASE_URL']}/favicon.svg" sizes="any" />
	<link rel="icon" type="image/png" href="{env['HONEYBOT_BASE_URL']}/favicon-96.png" sizes="96x96" />
	<link rel="icon" href="{env['HONEYBOT_BASE_URL']}/favicon.ico" sizes="32x32" />
	<link rel="apple-touch-icon" href="{env['HONEYBOT_BASE_URL']}/icon-180.png" sizes="180x180" />

	<!-- Manifest -->
	<link rel="manifest" href="{env['HONEYBOT_BASE_URL']}/site.webmanifest" />
</svelte:head>

<main class="max-w-screen-lg mx-auto">
	<slot />
</main>

<style>
	:global(html) {
		background-color: #f5f5f5;
	}

	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	}
</style>
