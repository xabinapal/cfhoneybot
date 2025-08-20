<script lang="ts">
	import { page } from "$app/state";
</script>

<svelte:head>
	<title>CFHoneyBot</title>
</svelte:head>

<div class="main-layout">
	<img src="/favicon.svg" alt="CFHoneyBot Logo" class="main-logo" />
	<h1 class="main-title">CFHoneyBot</h1>
	<h2 class="main-subtitle">{page.status} {page.error?.message ?? "Unknown error"}</h2>
</div>
