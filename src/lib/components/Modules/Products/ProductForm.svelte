<script lang="ts">
	import { onMount } from 'svelte';
	import { Input } from '$lib/components';
	import type { Product } from '$lib/schemas/product';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { goto } from '$app/navigation';
	import { APP_URL } from '$lib/utils/constants';

	export let props = {
		dataForm: {},
		isEditing: false,
		isCreated: false,
		dataFormRemove: {}
	} as {
		dataForm: SuperValidated<Product>;
		dataFormRemove?: SuperValidated<{
			id: string;
		}>;
		isEditing: boolean;
		isCreated: boolean;
	};

	let edit = false;
	let readonly = true;
	let formBackup = {};
	let imageUrl: string | ArrayBuffer | null =
		'https://res.cloudinary.com/dcew4hgxp/image/upload/v1714012419/dummy-image.svg';

	const { form, errors, enhance, delayed } = superForm(props.dataForm, {
		dataType: 'json',
		taintedMessage: null,
		id: 'productForm',

		onUpdated({ form }) {
			if (form.valid) {
				if (props.isEditing) {
					makeBackup();
					edit = false;
					readonly = true;
				}
			}
		}
	});

	const {
		form: formRemove,
		enhance: enhanceRemove,
		delayed: delayedRemove
	} = superForm(
		props.dataFormRemove
			? props?.dataFormRemove
			: {
					id: ''
				},
		{
			dataType: 'json',
			taintedMessage: null,
			id: 'productFormRemove'
		}
	);

	async function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const formData = new FormData();
			formData.append('file', input.files[0]);

			try {
				const { statusCode, data } = await fetch(`${APP_URL}/api/storage`, {
					method: 'POST',
					body: formData
				}).then((res) => res.json());

				if (statusCode !== 201) {
					throw new Error('Error al subir imagen');
				}

				imageUrl = data.url;
				$form.image = data.url;
			} catch (error) {
				console.error('Error al subir imagen:', error);
			}
		}
	}

	function toggleEdit() {
		edit = !edit;
		readonly = false;
		makeBackup();
	}

	function makeBackup() {
		formBackup = JSON.parse(JSON.stringify($form));
	}

	function restoreBackup() {
		$form = formBackup as Product;
		edit = false;
	}

	onMount(() => {
		if (props.dataForm.data.image === '' || props.dataForm.data.image === null) {
			imageUrl = 'https://res.cloudinary.com/dcew4hgxp/image/upload/v1714012419/dummy-image.svg';
		} else {
			imageUrl = props.dataForm.data.image;
		}

		if (props.isCreated) {
			props.isEditing = false;
			readonly = false;
		}
	});
</script>

<section class="bg-white rounded-2xl">
	{#if props.isEditing}
		<div class="flex justify-end mb-2">
			<button on:click={toggleEdit} aria-label="Toggle Edit" class="cursor-pointer">
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
					<path
						fill="#000"
						d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
					/>
				</svg>
			</button>
		</div>
	{/if}
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-7">
		{#if imageUrl}
			<img
				src={props.isEditing ? $form.image : String(imageUrl)}
				class="w-full h-[320px] 2xl:h-[360px] object-cover object-center mb-4 rounded-xl border-2 border-[#d2d2cd] block lg:hidden"
				alt="Image preview"
				aria-hidden="true"
			/>
		{/if}
		<div class="flex flex-col gap-3">
			<div class="flex gap-4">
				<Input
					label="Product name"
					type="text"
					placeholder="Type name here"
					bind:value={$form.name}
					error={$errors?.name?.[0]}
					{readonly}
				/>

				{#if props.isEditing}
					<Input
						label="Reference"
						type="text"
						placeholder="Type ID here"
						bind:value={$form.reference}
						{readonly}
					/>
				{/if}
			</div>
			<Input
				label="Description"
				type="textarea"
				placeholder="Type description here"
				bind:value={$form.description}
				error={$errors?.description?.[0]}
				{readonly}
			/>
			<Input
				label="Category"
				type="text"
				placeholder="Type category here"
				bind:value={$form.category}
				error={$errors?.category?.[0]}
				{readonly}
			/>

			<div class="flex gap-2">
				<Input
					label="Stock"
					type="number"
					placeholder="12"
					bind:value={$form.stock}
					error={$errors?.stock?.[0]}
					{readonly}
				/>
				<Input
					label="Price"
					type="number"
					placeholder="$450"
					bind:value={$form.price}
					error={$errors?.price?.[0]}
					{readonly}
				/>
			</div>
		</div>
		<div class="flex flex-col w-full gap-2">
			<div class="w-full flex flex-col gap-1 mb-4">
				{#if imageUrl}
					<img
						src={props.isEditing ? $form.image : String(imageUrl)}
						class="w-full h-[320px] 2xl:h-[360px] object-cover object-center mb-4 rounded-xl border-2 border-[#d2d2cd] hidden lg:block"
						alt="Image preview"
						aria-hidden="true"
					/>
				{/if}
				{#if edit || props.isCreated === true}
					<span class="pb-2 pl-0 text-xl text-[#4c4c4c] font-semibold"> Product Gallery </span>
					<div
						class="flex flex-col items-center justify-center h-[200px] p-6 border-2 border-dashed border-[#d2d2cd] rounded-md bg-white"
					>
						<input
							type="file"
							id="file"
							name="file"
							accept=".jpg, .jpeg, .png"
							on:change={handleFileChange}
							hidden
						/>

						<div class="flex flex-col justify-center items-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" viewBox="0 0 24 24"
								><path fill="#666666" d="M18 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0" /><path
									fill="#666666"
									fill-rule="evenodd"
									d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.088c0 1.909 0 3.471-.104 4.743c-.104 1.28-.317 2.347-.795 3.235c-.21.391-.47.742-.785 1.057c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.793-.793-1.203-1.78-1.42-3.006c-.215-1.203-.254-2.7-.262-4.558c-.002-.473-.002-.973-.002-1.501v-.058c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386c0 .529 0 1.026.002 1.495c.008 1.874.05 3.246.238 4.303c.184 1.035.498 1.7 1.005 2.207c.57.57 1.34.897 2.619 1.069c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.21-.21.381-.442.524-.707c.332-.616.523-1.44.621-2.645c.098-1.205.099-2.707.099-4.653c0-2.378-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176"
									clip-rule="evenodd"
								/><path
									fill="#666666"
									d="m20.607 19.146l-2.83-2.547a3 3 0 0 0-3.732-.225l-.299.21a2 2 0 0 1-2.564-.222l-4.29-4.29a2.3 2.3 0 0 0-3.14-.104l-1.002.876l.002.65c.008 1.875.05 3.247.238 4.304c.185 1.035.498 1.7 1.005 2.207c.57.57 1.34.897 2.619 1.069c1.3.174 3.008.176 5.386.176s4.087-.002 5.387-.176c1.278-.172 2.049-.5 2.618-1.069a2.995 2.995 0 0 0 .602-.859"
									opacity=".4"
								/></svg
							>

							<label
								for="file"
								class="cursor-pointer text-[#70706E] font-semibold px-4 rounded inline-flex text-center"
							>
								<span>Drop your image here, or browse</span>
							</label>
							<p class="text-xs text-gray-500 mt-2">Jpeg, png are allowed</p>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex flex-col lg:flex-row items-center justify-end w-full gap-2">
				{#if props.isCreated}
					<form action="?/createProduct" method="POST" use:enhance on:submit class="w-full">
						<div class={`flex gap-2 w-full ${props.isEditing ? 'flex-row ' : 'flex-col'}`}>
							<button
								type="submit"
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-full"
								disabled={$delayed}
							>
								{#if $delayed}
									<div class="flex items-center justify-center">
										<svg
											class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 010-16v4a4 4 0 100 8h4"
											></path>
										</svg>
										Loading...
									</div>
								{:else}
									Create
								{/if}
							</button>
						</div>
					</form>
					<button
						type="submit"
						class="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded-xl w-full"
						disabled={$delayed}
						on:click={() => {
							goto('/products');
						}}
					>
						{#if $delayed}
							<div class="flex items-center justify-center">
								<svg
									class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 010-16v4a4 4 0 100 8h4"
									></path>
								</svg>
								Loading...
							</div>
						{:else}
							Cancel
						{/if}
					</button>
				{/if}

				{#if edit}
					<form action="?/updateProduct" method="POST" use:enhance on:submit class="w-full">
						<div class={`flex gap-2 w-full ${props.isEditing ? 'flex-row ' : 'flex-col'}`}>
							<button
								type="submit"
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-full"
								disabled={$delayed}
								on:click={makeBackup}
							>
								{#if $delayed}
									<div class="flex items-center justify-center">
										<svg
											class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 010-16v4a4 4 0 100 8h4"
											></path>
										</svg>
										Loading...
									</div>
								{:else}
									Update
								{/if}
							</button>
						</div>
					</form>
					<form action="?/deleteProduct" method="POST" use:enhanceRemove on:submit class="w-full">
						<button
							type="submit"
							class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl w-full"
							disabled={$delayedRemove}
						>
							{#if $delayedRemove}
								<div class="flex items-center justify-center">
									<svg
										class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 010-16v4a4 4 0 100 8h4"
										></path>
									</svg>
									Loading...
								</div>
							{:else}
								Delete
							{/if}
						</button>
					</form>

					<button
						type="submit"
						class="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded-xl w-full"
						disabled={$delayed}
						on:click={restoreBackup}
					>
						{#if $delayed}
							<div class="flex items-center justify-center">
								<svg
									class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 010-16v4a4 4 0 100 8h4"
									></path>
								</svg>
								Loading...
							</div>
						{:else}
							Cancel
						{/if}
					</button>
				{/if}
			</div>
		</div>
	</div>
</section>
