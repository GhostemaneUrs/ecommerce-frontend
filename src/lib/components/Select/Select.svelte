<script lang="ts">
	import Select from 'svelte-select';
	export let items: { label: any; value: any }[] | undefined | any;
	export let label: null | string = null;
	export let value: { label?: string; value?: string } | number | string | null | any = null;
	export let placeholder = 'Placeholder';
	export let readonly = false;
	export let disabled = false;
	export let errorText: any[] | undefined | null | any = undefined;
	export let size = 'default';
	export let id = '';
	export let showChevron = false;
	export let searchable = true;
	export let multiple = false;
	let listOpen = false;

	export let clearable: boolean | undefined = undefined;
</script>

<div
	class:error={errorText}
	class:disabled
	class:readonly
	class="form-control relative w-full select-theme flex flex-col gap-2"
>
	{#if label}
		<label class="pl-0 text-xl text-[#5d5d5d] font-semibold" for="selectLabel">
			{label}
		</label>
	{/if}
	<Select
		class="w-full cursorPointer {readonly ? 'pointer-events-none' : ''}"
		bind:value
		bind:listOpen
		listOffset={8}
		showChevron
		{clearable}
		containerStyles={size === 'small' ? 'height:36px; min-height:36px' : ''}
		{items}
		{id}
		{placeholder}
		{disabled}
		inputAttributes={readonly ? { readonly: true } : {}}
		{searchable}
		{multiple}
		on:clear
		on:change
		floatingConfig={{
			strategy: 'fixed'
		}}
	>
		<div slot="chevron-icon">
			{#if !readonly}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m6 9l6 6l6-6"
					/></svg
				>
			{/if}
		</div>
		<div class="empty">
			<p>No se encontraron resultados</p>
		</div>
		<div slot="item" class="item cursor-pointer flex items-center justify-between" let:item>
			{item.label}
			{#if showChevron}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m9 6l6 6l-6 6"
					/></svg
				>
			{/if}
		</div>
	</Select>
</div>

<style>
	.select-theme {
		--padding: 0 4px 0 16px;
		--height: 44px;
		--background: #fff;
		--border-focused: 2px solid #d2d2cd;
		--border-hover: 2px solid #d2d2cd;
		--item-hover-bg: theme('colors.gray.100');
		--item-is-active-bg: theme('colors.gray.100');
		--item-hover-color: theme('colors.gray.900');
		--border: 2px solid #d2d2cd;
		--border-radius: 8px;
		--placeholder-color: #d2d2cd !important;
		--list-border-radius: 0px;
		--item-is-active-color: theme('colors.gray.900');
	}
	.error {
		--border: 0.5px solid theme('colors.error.700');
		--border-hover: 0.5px solid theme('colors.error.700');
	}
	.disabled {
		--disabled-background: #d2d2cd;
		--disabled-color: #d2d2cd;
	}
	.readonly {
		--background: transparent;
		--border: 1px solid #d1d2d3;
	}
</style>
