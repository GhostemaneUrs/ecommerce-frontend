<script>
	import '../app.css';
	import SideMenu from '$lib/components/Menu/SideMenu.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	let isMenuOpen = false;

	function toggleMenu() {
		if (window?.innerWidth < 1024) {
			isMenuOpen = !isMenuOpen;
		}
	}

	const flash = getFlash(page);
	flash.subscribe(($flash) => {
		if (!$flash) return;

		toast($flash.message, {
			position: 'bottom-right',
			className:
				$flash.type == 'success'
					? '!bg-success-50 !text-success-700 !py-2 !px-4 !rounded-lg !text-sm !whitespace-nowrap'
					: '!bg-warning-50 !text-warning-0 !py-2 !px-4 !rounded-lg !text-sm !whitespace-nowrap',
			duration: 4000
		});

		flash.set(undefined);
	});
</script>

<main>
	<Toaster />
	<div class="flex flex-col lg:flex-row overflow-hidden">
		<button class="lg:hidden absolute top-4 right-4 z-30" on:click={toggleMenu}>
			{#if !isMenuOpen}
				<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"
					><path fill="currentColor" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" /></svg
				>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"
					><path
						fill="currentColor"
						d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
					/></svg
				>
			{/if}
		</button>

		<div
			class={`bg-gray-50 w-16 xl:w-64 2xl:w-[350px] fixed z-20 h-full overflow-auto transition-transform duration-300 ${isMenuOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-16 lg:translate-x-0'}`}
		>
			<SideMenu {toggleMenu} />
		</div>

		<div
			class={`flex-1 transition-all duration-300 ${isMenuOpen ? 'pl-16 xl:pl-[350px]' : 'pl-0 lg:pl-16 xl:pl-[350px]'}`}
		>
			<slot></slot>
		</div>
	</div>
</main>
