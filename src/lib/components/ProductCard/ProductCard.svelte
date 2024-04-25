<script lang="ts">
	interface Product {
		id: string;
		image: string;
		name: string;
		price: number;
		description: string;
	}

	export let product: Product;
	$: isNew = Math.random() < 0.5;
</script>

<div class="w-full lg:max-w-sm bg-white rounded-lg shadow-md overflow-hidden relative mb-2">
	<a href={`/products/${product.id}`}>
		<img
			class="w-full h-72 lg:h-52 object-cover object-center"
			alt={product.name}
			src={product.image}
		/>

		<div class="px-6 pt-4 pb-2 w-full">
			<div class="flex justify-between items-center w-full mb-1">
				<span class="text-xl font-semibold text-gray-800">
					{product.name}
				</span>

				{#if isNew}
					<span
						class="text-xs bg-blue-500 text-white font-semibold px-2 py-1 tracking-wider rounded-full"
						>NEW</span
					>
				{/if}
			</div>
			<div class="w-[90%] lg:w-full">
				<p class="text-gray-600 text-[15px] mb-4 md:line-clamp-2 lg:line-clamp-3 overflow-hidden">
					{product.description}
				</p>
			</div>
		</div>
	</a>
</div>
