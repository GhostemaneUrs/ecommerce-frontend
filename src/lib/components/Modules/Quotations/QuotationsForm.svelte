<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Input from '$lib/components/Input/Input.svelte';
  import Select from '$lib/components/Select/Select.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import type { SuperValidated } from 'sveltekit-superforms';
  import type { Quotation } from '$lib/schemas/quotation';

  export let props = {
    dataForm: {
      id: '',
      user_id: { label: '', value: '' },
      quantity: 0,
      product_id: { label: '', value: '' },
    } as unknown as SuperValidated<Quotation>,
    users: [],
    products: [],
    isEditing: false,
    isCreated: false,
    dataFormRemove: {} as SuperValidated<{ id: string }>,
  } as {
    users: { value: string; label: string }[];
    products: {
      value: string;
      label: string;
      price: number;
      image: string;
      stock: number;
    }[];
    dataForm: SuperValidated<Quotation>;
    dataFormRemove?: SuperValidated<{ id: string }> | undefined;
    isEditing: boolean;
    isCreated: boolean;
  };

  let edit = false;
  let readonly = true;
  let formBackup = {};
  let imageUrl: string | ArrayBuffer | null | any =
    'https://res.cloudinary.com/dcew4hgxp/image/upload/v1714012419/dummy-image.svg';

  const { form, errors, enhance, delayed } = superForm(props.dataForm, {
    dataType: 'json',
    taintedMessage: null,
    id: 'quotationForm',
    onUpdated({ form }) {
      if (form.valid) {
        if (props.isEditing) {
          makeBackup();
          edit = false;
          readonly = true;
        }
      }
    },
  });

  function makeBackup() {
    formBackup = JSON.parse(JSON.stringify($form));
  }

  $: totalPrice =
    $form.quantity && $form.product_id?.price
      ? ($form.quantity * parseFloat($form.product_id?.price)).toFixed(2)
      : '';

  $: if ($form.quantity > $form.product_id?.stock) {
    $form.quantity = $form.product_id?.stock;
  }

  onMount(() => {
    if (props.isCreated) {
      props.isEditing = false;
      readonly = false;
    }

    if (props.isEditing) {
      readonly = true;
      imageUrl = props.products.find(
        (product) => product.value === $form.product_id.value
      )?.image;
    }
  });
</script>

<section class="bg-white rounded-2xl mb-4">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-7">
    <div class="flex flex-col gap-3">
      <span
        class="pb-1 pl-0 text-xl text-[#4c4c4c] font-semibold block lg:hidden"
        >Product Preview
      </span>
      {#if imageUrl}
        <img
          src={String(imageUrl)}
          class="w-full h-[400px] object-cover object-center rounded-xl border-2 border-[#d2d2cd] block lg:hidden"
          alt="Image preview"
          aria-hidden="true"
        />
      {/if}
      {#if props.isEditing}
        <Input
          label="User name"
          type="text"
          placeholder="$450"
          bind:value={$form.user_id.label}
          {readonly}
        />
        <Input
          label="Product name"
          type="text"
          placeholder="$450"
          bind:value={$form.product_id.label}
          {readonly}
        />
      {:else}
        <Select
          items={props.users}
          label="User name"
          placeholder="Select a user"
          {readonly}
          clearable={false}
          on:change={(e) => {
            $form.user_id = e.detail;
          }}
        />
        <Select
          items={props.products}
          label="Product name"
          placeholder="Select a product"
          {readonly}
          clearable={false}
          on:change={(e) => {
            $form.product_id = e.detail;
            imageUrl = props.products.find(
              (product) => product.value === e.detail.value
            )?.image;
          }}
        />
      {/if}
      <Input
        label="Quantity"
        type="number"
        placeholder="$450"
        bind:value={$form.quantity}
        error={$errors?.quantity?.[0]}
        {readonly}
      />
      <Input
        label="Price"
        type="text"
        placeholder="$450"
        bind:value={totalPrice}
        error={$errors?.price?.[0]}
        readonly={true}
      />
    </div>
    <div class="w-full flex flex-col gap-3">
      <span
        class="pb-1 pl-0 text-xl text-[#4c4c4c] font-semibold hidden lg:block"
        >Product Preview
      </span>
      {#if imageUrl}
        <img
          src={String(imageUrl)}
          class="w-full h-[400px] object-cover object-center rounded-xl border-2 border-[#d2d2cd] hidden lg:block"
          alt="Image preview"
          aria-hidden="true"
        />
      {/if}

      <div
        class="flex flex-col lg:flex-row items-center justify-end w-full gap-4"
      >
        {#if props.isCreated}
          <form
            action="?/createQuotation"
            method="POST"
            use:enhance
            on:submit
            class="w-full"
          >
            <div
              class={`flex gap-2 w-full ${props.isEditing ? 'flex-row ' : 'flex-col'}`}
            >
              <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-full"
                disabled={$delayed}
              >
                Create
              </button>
            </div>
          </form>
          <button
            type="submit"
            class="bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded-xl w-full"
            disabled={$delayed}
            on:click={() => {
              goto('/quotations');
            }}
          >
            Cancel
          </button>
        {/if}
      </div>
    </div>
  </div>
</section>
