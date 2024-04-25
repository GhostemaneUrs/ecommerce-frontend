<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/IconsManager/Icon.svelte';
	import Ecommerce from '$lib/components/IconsManager/icons/Ecommerce.svelte';

	export let toggleMenu: () => void;

	let options = {
		principal: [
			{
				name: 'Products',
				icon: 'Box',
				link: '/products'
			},
			{
				name: 'Quotations',
				icon: 'Clipboard',
				link: '/quotations'
			}
		],
		secondary: [
			{
				name: 'Settings',
				icon: 'Settings'
			},
			{
				name: 'Logout',
				icon: 'Logout'
			}
		]
	};
</script>

<aside
	class="bg-blue-500 text-gray-600 lg:text-gray-700 flex flex-col justify-between min-h-screen w-full"
>
	<div class="flex flex-col items-center w-full">
		<div class="flex justify-center pt-5 pb-5 w-full">
			<Ecommerce fill="#fff" />
		</div>
		<nav class="flex-1 w-[90%]">
			<ul class="w-full">
				{#each options.principal as option}
					<li
						class={`flex items-center my-2 p-1 xl:p-2 rounded-md transition-colors duration-150 ${
							$page.url.pathname.startsWith(option.link)
								? 'bg-blue-700 text-white font-medium'
								: 'text-white hover:bg-blue-700 font-medium'
						}`}
					>
						<a
							href={option.link}
							on:click={toggleMenu}
							class="flex justify-center items-center w-full h-8 lg:px-4 lg:justify-start"
						>
							<Icon name={option.icon} fill="#fff" />
							<span class="ml-4 hidden xl:block">{option.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<div class="flex flex-col items-center justify-end pb-4">
		<ul class="w-[90%]">
			{#each options.secondary as option}
				<li class="flex items-center my-2 p-1 xl:p-2 rounded-md transition-colors duration-150">
					<button
						on:click={toggleMenu}
						class="flex justify-center items-center w-full h-12 lg:px-4 lg:justify-start"
					>
						<Icon name={option.icon} fill="#fff" />
						<span class="ml-4 hidden xl:block text-white font-medium">{option.name}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</aside>

<style>
	aside {
		transition:
			background-color 0.3s,
			color 0.3s;
	}
</style>
