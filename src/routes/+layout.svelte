<script>
  import '../app.css';
  import SoundControl from '$lib/SoundControl.svelte';
  import { onMount } from 'svelte';

  let soundControlReady = false;

  onMount(() => {
    soundControlReady = true;
  });
</script>

<div class="relative min-h-screen">
  {#if soundControlReady}
    <div class="fixed top-4 right-4 z-50">
      <SoundControl />
    </div>
  {/if}

  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>
