<script>
	let { pagination, onPagination } = $props();

	function handlePagination(pageNum) {
		onPagination(pageNum);
	}

	function getVisiblePages() {
		const { currentPage, totalPages } = pagination;
		const maxButtons = 7;

		const pages = [];

		// Always show first page
		pages.push(1);

		if (totalPages <= maxButtons) {
			// Show all pages if total is less than or equal to maxButtons
			for (let i = 2; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			let left, right;
			if (currentPage <= 4) {
				// If current page is near the start
				left = 2;
				right = 5;
			} else if (currentPage >= totalPages - 3) {
				// If current page is near the end
				left = totalPages - 4;
				right = totalPages - 1;
			} else {
				// If current page is in the middle
				left = currentPage - 1;
				right = currentPage + 1;
			}

			// Add left dots if needed
			if (left > 2) {
				pages.push("…");
			}

			// Add middle page numbers
			for (let i = left; i <= right; i++) {
				pages.push(i);
			}

			// Add right dots if needed
			if (right < totalPages - 1) {
				pages.push("…");
			}

			// Always show last page
			pages.push(totalPages);
		}

		return pages;
	}
</script>

<div class="pagination-container">
	<div class="pagination-info">
		Showing requests {(pagination.currentPage - 1) * pagination.limitRequests + 1} to
		{Math.min(pagination.currentPage * pagination.limitRequests, pagination.totalRequests)}
	</div>

	<nav class="pagination-nav">
		<button
			onclick={() => handlePagination(pagination.currentPage - 1)}
			disabled={pagination.currentPage <= 1}
			class="btn btn-secondary"
		>
			◀
		</button>

		{#each getVisiblePages() as page}
			<button
				disabled={page === "…" || page === pagination.currentPage}
				onclick={() => handlePagination(page)}
				class="btn {page === pagination.currentPage ? 'btn-primary btn-active' : 'btn-secondary'}"
				tabindex={page === "…" ? -1 : 0}
			>
				{page}
			</button>
		{/each}

		<button
			onclick={() => handlePagination(pagination.currentPage + 1)}
			disabled={pagination.currentPage >= pagination.totalPages}
			class="btn btn-secondary"
		>
			▶
		</button>
	</nav>
</div>
