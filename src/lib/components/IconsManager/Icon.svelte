<script lang="ts">
	import * as icons from './icons/index';

	export let name: string = 'Home';
	export let fill: string = '#000';

	let IconComponent:
		| (typeof import('./icons/index'))[keyof typeof import('./icons/index')]
		| undefined;

	$: if (name in icons) {
		IconComponent = icons[name as keyof typeof icons] as unknown as typeof IconComponent;
	}
</script>

{#if IconComponent}
	<svelte:component this={IconComponent} {fill} />
{:else}
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
		><path
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M3 7v4a1 1 0 0 0 1 1h3m0-5v10m3-9v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1m7-1v4a1 1 0 0 0 1 1h3m0-5v10"
		/></svg
	>
{/if}
