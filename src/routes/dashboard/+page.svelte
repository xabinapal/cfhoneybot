<script>
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { deserialize } from "$app/forms";

	import Pagination from "./Pagination.svelte";
	import Requests from "./Requests.svelte";
	import Search from "./Search.svelte";

	let { data } = $props();

	let showBox = $state(false);
	let successMessage = $state("");
	let errorMessage = $state("");

	const token = page.url.searchParams.get("token");

	async function updateUrl(params = {}) {
		const url = new URL(page.url);

		// Always preserve token
		url.searchParams.set("token", token);

		// Update provided parameters
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.set(key, String(value));
		});

		goto(url.toString());
	}

	async function handleSearch(searchData) {
		await updateUrl({
			search: searchData.search || "",
			analyzed: searchData.analyzed,
			page: 1,
		});
	}

	async function handlePagination(pageNumber) {
		await updateUrl({ page: pageNumber });
	}

	async function handleFormAction(action, formData) {
		const response = await fetch(`?/${action}&token=${encodeURIComponent(token)}`, {
			method: "POST",
			body: formData,
		});

		const result = deserialize(await response.text());
		if (result.type === "success") {
			successMessage = result.data.message;
			errorMessage = "";
			showBox = true;

			setTimeout(() => {
				showBox = false;
				// Refresh the page data
				window.location.reload();
			}, 1000);
		} else {
			successMessage = "";
			errorMessage = result.data.error;
			showBox = true;

			setTimeout(() => {
				showBox = false;
			}, 3000);
		}
	}

	function handleUpdate(requestId, requestData) {
		const formData = new FormData();
		formData.append("id", requestId);
		formData.append("description", requestData.description || "");
		if (requestData.analyzed) {
			formData.append("analyzed", "on");
		}

		handleFormAction("update", formData);
	}

	function handleDelete(requestId) {
		if (!confirm("Are you sure you want to delete this request? This action cannot be undone.")) {
			return;
		}

		const formData = new FormData();
		formData.append("id", requestId);

		handleFormAction("delete", formData);
	}
</script>

<svelte:head>
	<title>CFHoneyBot Dashboard</title>
</svelte:head>

<!-- Messages -->
<div class="alert-container {successMessage ? 'alert-success' : 'alert-error'} {showBox ? 'alert-visible' : ''}">
	{successMessage || errorMessage}
</div>

<div class="container-card">
	<div class="scrollable-container">
		<div class="sticky-header">
			<header class="header-section">
				<img src="/favicon.svg" alt="CFHoneyBot Logo" class="header-logo" />
				<div>
					<h1 class="header-title">CFHoneyBot Dashboard</h1>
					<p class="header-subtitle">
						{data.pagination.totalRequests} requests logged
						{#if data.filters.search || data.filters.analyzed !== "all"}
							• Filtered view
						{/if}
					</p>
				</div>
			</header>

			<Search search={data.filters.search || ""} analyzed={data.filters.analyzed || "all"} onSearch={handleSearch} />

			<Pagination pagination={data.pagination} onPagination={handlePagination} />
		</div>

		<Requests requests={data.requests} onUpdate={handleUpdate} onDelete={handleDelete} />
	</div>
</div>
