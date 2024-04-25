<script>
  import { goto } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
  import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';

  export let data;
  const { products } = data;

  let currentSlide = 0;
  let bannerHeight = 0;
  /**
   * @type {{ offsetHeight: number; } | null}
   */
  let bannerElement = null;

  const slides = [
    'https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/4db72077225421.5c813be0e7d19.jpg',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/57d478160712559.63b93c1e45fa4.png',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/cc30e299184077.5eecde766b3a4.png',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/192a41160716395.63d6b339d7ab2.jpg',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/eee7fd42239631.5c267774c9e0e.jpg',
  ];

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
  }

  async function bannerObserver() {
    await tick();
    bannerHeight = bannerElement?.offsetHeight || 0;
  }

  onMount(() => {
    bannerObserver();
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  });
</script>

<section
  class="mt-14 lg:mt-7 mx-auto w-full xl:max-w-7xl px-4 flex flex-col gap-4 lg:gap-5 overflow-hidden"
>
  <div
    class="aspect-w-16 aspect-h-[9] lg:aspect-h-[5.6] w-full overflow-hidden relative rounded-3xl"
    bind:this={bannerElement}
  >
    {#each slides as slide, index}
      <img
        src={slide}
        class={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        alt={`Banner ${index}`}
        style={`visibility: ${index === currentSlide ? 'visible' : 'hidden'}`}
      />
    {/each}
  </div>

  <div class="flex flex-col gap-3">
    <div class="flex justify-between items-center">
      <h2 class="text-lg md:text-2xl font-semibold">Popular Products</h2>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-base"
        on:click={() => goto('/products/new')}
      >
        + New Products
      </button>
    </div>
    <div
      class="w-full grid items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 overflow-auto pb-4 pr-2 lg:pr-0"
      style="max-height: calc(100vh - {bannerHeight + 168}px);"
    >
      {#each products as product}
        <ProductCard {product} />
      {/each}
    </div>
  </div>
</section>
