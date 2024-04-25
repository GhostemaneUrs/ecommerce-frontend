<script>
  import { goto } from '$app/navigation';
  import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
  import Table from '$lib/components/Table/Table.svelte';
  export let data;

  let tableHeaders = [
    { name: 'product', display: 'Product Name', dataIndex: 'product' },
    { name: 'user', display: 'User Name', dataIndex: 'user' },
    { name: 'quantity', display: 'Quantity', dataIndex: 'quantity' },
    { name: 'price', display: 'Price', dataIndex: 'price' },
  ];
</script>

<section
  class="mt-14 lg:mt-7 mx-auto w-full xl:max-w-7xl px-4 flex flex-col overflow-hidden"
>
  <div class="flex flex-col items-start gap-2 mb-4">
    <Breadcrumb
      options={[
        { href: '/', title: 'Home', active: false },
        { href: '/quotations', title: 'Quotations', active: true },
      ]}
    />
  </div>
  <div class="flex justify-end gap-3 mb-3">
    <div class="w-full max-w-max">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-base w-full text-end"
        on:click={() => goto('/quotations/new')}
      >
        + New Quotation
      </button>
    </div>
  </div>

  <Table headers={tableHeaders} items={data.quotations} hasDetail />
</section>
