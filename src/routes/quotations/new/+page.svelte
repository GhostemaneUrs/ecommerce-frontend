<script>
	import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
	import QuotationForm from '$lib/components/Modules/Quotations/QuotationsForm.svelte';

	export let data;
</script>

<section class="mt-14 lg:mt-7 mx-auto w-full xl:max-w-7xl px-4 flex flex-col overflow-hidden">
	<div class="flex flex-col items-start gap-2 mb-4">
		<h1 class="text-3xl text-black font-bold">New Quotation</h1>
		<Breadcrumb
			options={[
				{ href: '/', title: 'Home', active: false },
				{ href: '/quotations', title: 'Quotations', active: false },
				{ href: '/new', title: 'New Quotation', active: true }
			]}
		/>
	</div>

	<QuotationForm
		props={{
			isEditing: false,
			isCreated: true,
			users: data.users,
			dataForm: data.form,
			products: data.products
		}}
	/>
</section>
