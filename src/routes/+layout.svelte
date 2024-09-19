<script>
  import '../app.css'; // Make sure to import your global styles
  import SoundControl from '$lib/SoundControl.svelte';
  import { onMount } from 'svelte';

  let isMusicOn = false; // Start with music off
  let soundControlReady = false;

  onMount(() => {
    soundControlReady = true;
  });
</script>

<div class="relative min-h-screen">
  {#if soundControlReady}
    <div class="absolute top-4 right-4 z-50">
      <SoundControl bind:isMusicOn />
    </div>
  {/if}

  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>