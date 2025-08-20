<script>
	let { search, analyzed, onSearch } = $props();

	let debounceTimer;
	function handleSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearch({ search, analyzed });
		}, 300);
	}

	function handleSearchSelect() {
		onSearch({ search, analyzed });
	}
</script>

<div class="search-container">
	<div class="search-form">
		<div class="w-full">
			<label for="search" class="search-label">Search</label>
			<input
				id="search"
				type="text"
				bind:value={search}
				oninput={handleSearchInput}
				placeholder="Search by IP, URL, User-Agent, or Description..."
				class="search-input"
			/>
		</div>

		<div class="w-50">
			<label for="analyzed" class="search-label">Status</label>
			<select id="analyzed" bind:value={analyzed} onchange={handleSearchSelect} class="search-input">
				<option value="all">All requests</option>
				<option value="false">Unanalyzed</option>
				<option value="true">Analyzed</option>
			</select>
		</div>
	</div>
</div>
