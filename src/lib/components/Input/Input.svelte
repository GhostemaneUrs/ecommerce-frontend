<script lang="ts">
	export let label: string = '';
	export let placeholder: string = '12345...';
	export let value: any = '';
	export let error: string = '';
	export let readonly: boolean = false;
	export let type: 'email' | 'text' | 'password' | 'number' | 'textarea' = 'text';
	export let inputId: string = 'input-' + Math.random().toString(36).substr(2, 9);

	const handleInput = (e: any) => {
		value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
	};
</script>

<div class="w-full flex flex-col gap-2">
	<label class="pl-0 text-xl text-[#5d5d5d] font-semibold" for={inputId}>
		{label}
	</label>
	{#if type === 'textarea'}
		<div>
			<textarea
				id={inputId}
				bind:value
				{readonly}
				{placeholder}
				class={`outline-none w-full p-2 h-[190px] 2xl:h-[233px] border-2 rounded-md bg-white ${error ? 'border-red-300' : 'border-[#d2d2cd]'}`}
			/>
			{#if error}
				<span class="text-red-400 text-base">{error}</span>
			{/if}
		</div>
	{:else}
		<div>
			<input
				id={inputId}
				{type}
				{value}
				{placeholder}
				{readonly}
				on:input={handleInput}
				class={` outline-none w-full p-2 border-2 rounded-md bg-white ${error ? 'border-red-300' : 'border-[#d2d2cd]'}`}
			/>
			{#if error}
				<span class="text-red-400 text-base">{error}</span>
			{/if}
		</div>
	{/if}
</div>
