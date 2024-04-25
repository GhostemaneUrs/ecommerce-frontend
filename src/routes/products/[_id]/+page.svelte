<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
  import ProductForm from '$lib/components/Modules/Products/ProductForm.svelte';

  export let data;
</script>

<div
  class="mt-10 pb-4 mx-auto w-full xl:max-w-7xl px-4 flex flex-col gap-4 lg:gap-2 overflow-hidden"
>
  <div class="flex flex-col items-start gap-2 mb-2">
    <h1 class="text-3xl text-black font-bold">{data.form.data.name}</h1>
    <Breadcrumb
      options={[
        { href: '/', title: 'Home', active: false },
        { href: '/products', title: 'Products', active: false },
        { href: '/products', title: `${data.form.data.name}`, active: true },
      ]}
    />
  </div>

  <ProductForm
    props={{
      dataForm: data.form,
      isEditing: true,
      isCreated: false,
      dataFormRemove: data.formRemove,
    }}
  />
</div>
