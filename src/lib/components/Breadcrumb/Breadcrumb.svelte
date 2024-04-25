<script lang="ts">
	export let options: { href: string; title: string; active: boolean }[] = [];
</script>

<div class="text-base flex">
	<ul class="flex flex-row items-center">
		{#each options as option, index}
			<div class="text-lg flex items-center">
				{#if index > 0}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
						><path
							fill="#2E2E2D"
							d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375q0 .2-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7z"
						/></svg
					>
				{/if}
				<span class={option.active ? ' mr-1' : 'text-[#2E2E2D] mr-1 font-semibold'}>
					{#if option.active}
						<p class=" text-[#2E2E2D] font-semibold">{option.title}</p>
					{:else}
						<a href={option.href}>
							{option.title}
						</a>
					{/if}
				</span>
			</div>
		{/each}
	</ul>
</div>

<style>
	a,
	a:visited,
	a:hover,
	a:active {
		color: inherit;
	}
</style>
