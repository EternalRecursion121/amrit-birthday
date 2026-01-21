<script>
  import { fly, scale } from 'svelte/transition';
  import { cubicOut, backOut } from 'svelte/easing';
  export let character;
  export let handleSelectCharacter;
  export let totalCount = 1;
  export let currentNum = 1;

  $: ({ name, image, unlocked, tagline } = character);
</script>

<div
  class="absolute inset-0 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden"
  in:fly={{ x: 200, duration: 400, easing: backOut, opacity: 0.5 }}
  out:fly={{ x: -200, duration: 300, easing: cubicOut, opacity: 0 }}
>
  <!-- Image Container -->
  <div class="relative flex-1 overflow-hidden">
    <img
      src={image}
      alt={name}
      class="w-full h-full object-cover {unlocked ? '' : 'blur-sm scale-105'}"
    />

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

    <!-- Lock overlay -->
    {#if !unlocked}
      <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
        <div class="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p class="text-white/90 text-sm font-medium">Win hearts to unlock</p>
      </div>
    {/if}

    <!-- Character info overlay -->
    <div class="absolute bottom-0 left-0 right-0 p-5">
      <h2 class="text-3xl font-bold text-white mb-1">{name}</h2>
      {#if tagline}
        <p class="text-white/80 text-sm">{tagline}</p>
      {/if}
    </div>

    <!-- Counter badge -->
    <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
      <span class="text-white text-sm font-medium">{currentNum}/{totalCount}</span>
    </div>
  </div>

  <!-- Action Button -->
  <div class="p-4 bg-white">
    <button
      on:click={() => handleSelectCharacter(character)}
      class="w-full py-3.5 rounded-xl font-semibold text-lg transition-all duration-200 {unlocked
        ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:shadow-lg hover:shadow-rose-300/40 hover:scale-[1.02] active:scale-100'
        : 'bg-stone-100 text-stone-400 cursor-not-allowed'}"
      disabled={!unlocked}
    >
      {#if unlocked}
        <span class="flex items-center justify-center gap-2">
          Start Chatting
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </span>
      {:else}
        Locked
      {/if}
    </button>
  </div>
</div>
