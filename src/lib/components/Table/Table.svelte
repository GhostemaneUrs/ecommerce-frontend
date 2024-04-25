<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	type Header = {
		name: string;
		display?: string;
		dataIndex: string;
	};

	export let headers: Header[] = [];
	export let items: any[] = [];
	export let hasDetail = true;

	let module = $page.url.pathname;
	let loading = false;
</script>

<div class="pb-4 border-[0.5px] border-[#adb5bd80] rounded-2xl w-full">
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr class="text-center font-medium text-gray-600">
					{#each headers as header}
						<th class="px-4 py-2">{header.display}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if loading}
					<tr>
						<td class="animate-pulse" colspan={headers.length}>
							<div class="w-full bg-blue-50 h-6 rounded-full"></div>
						</td>
					</tr>
				{:else}
					{#each items as item, i}
						<tr
							class="text-center text-gray-800 cursor-pointer hover:bg-blue-50"
							on:click={() => hasDetail && goto(`${module}/${item.id}`)}
						>
							{#each headers as header}
								<td class="px-4 py-2 capitalize">{item[header.dataIndex] || '-'}</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<style>
	th {
		padding: 16px;
		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
		color: #606369;
		border-bottom: 0.5px solid rgba(173, 181, 189, 0.5);
	}
	td {
		padding: 16px;
		font-size: 14px;
		font-weight: 400;
		line-height: 16px;
		color: #0f1218;
		border: none;
		text-align: center;
		white-space: nowrap;
	}
	tbody tr {
		border: none;
	}
</style>
