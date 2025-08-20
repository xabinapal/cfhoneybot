<script>
	let { class: className, requests, onUpdate, onDelete } = $props();

	let requestStates = $state({});
	$effect(() => {
		requests.forEach((request) => {
			if (!requestStates[request.id]) {
				requestStates[request.id] = {
					description: request.description || "",
					analyzed: !!request.analyzed,
				};
			}
		});

		const currentRequestIds = new Set(requests.map((r) => r.id));
		Object.keys(requestStates).forEach((id) => {
			if (!currentRequestIds.has(parseInt(id))) {
				delete requestStates[id];
			}
		});
	});

	function handleUpdate(request) {
		const state = requestStates[request.id];
		if (state) {
			onUpdate(request.id, {
				description: state.description,
				analyzed: state.analyzed,
			});
		}
	}

	function handleDelete(request) {
		onDelete(request.id);
	}
</script>

<div class="request-grid {requests.length === 0 ? 'request-grid-empty' : ''}">
	{#if requests.length === 0}
		<div class="requests-empty">No requests found</div>
	{:else}
		{#each requests as request (request.id)}
			{@const state = requestStates[request.id]}
			{#if state}
				<div class="request-item {request.analyzed ? 'request-item-active' : ''}">
					<div>
						<strong>ID:</strong> <span class="request-field">{request.id}</span> |
						<strong>Time:</strong> <span class="request-field">{request.ts}</span> |
						<strong>IP:</strong> <span class="request-field">{request.ip}</span>
					</div>

					<div>
						<strong>HTTP:</strong> <span class="request-field">{request.http}</span> |
						<strong>Method:</strong> <span class="request-field">{request.method}</span> |
						<strong>Host:</strong> <span class="request-field">{request.host}</span>
					</div>

					<div>
						<strong>URL:</strong> <span class="request-field">{request.url}</span>
					</div>

					<div>
						<strong>User-Agent:</strong> <span class="request-field">{request.ua || "N/A"}</span>
					</div>

					<details class="grid gap-2">
						<summary class="request-summary">Headers ({Object.keys(request.headers).length} headers)</summary>
						<pre class="request-details">{JSON.stringify(request.headers, null, 2)}</pre>
					</details>

					<details class="grid gap-2">
						<summary class="request-summary">Body ({request.body?.length ?? 0} bytes)</summary>
						<pre class="request-details">{request.body}</pre>
					</details>

					<label class="grid gap-2">
						<span class="request-summary">Description</span>
						<textarea bind:value={state.description} placeholder="Add description/notes..." class="request-details h-20"
						></textarea>
					</label>

					<label class="request-checkbox-label">
						<input type="checkbox" bind:checked={state.analyzed} class="checkbox" />
						<span class="text-sm">Mark as analyzed</span>
					</label>

					<div class="request-actions">
						<button onclick={() => handleUpdate(request)} class="btn btn-primary"> Update </button>

						<button onclick={() => handleDelete(request)} class="btn btn-danger"> Delete </button>
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>
