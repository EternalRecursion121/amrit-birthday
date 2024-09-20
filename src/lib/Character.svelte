<script>
  import { fly } from 'svelte/transition';
  export let character;
  export let handleSelectCharacter;

  const { name, image, unlocked } = character;
</script>

<div 
  class="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4"
  in:fly={{ x: 300, duration: 300 }}
  out:fly={{ x: -300, duration: 300 }}
>
  <img 
    src={image} 
    alt={name} 
    class="w-full h-3/4 object-cover rounded-lg mb-4 {unlocked ? '' : 'opacity-50'}"
  />
  {#if !unlocked}
    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <span class="text-white text-4xl">🔒 Locked</span>
    </div>
  {/if}
  <h2 class="text-2xl font-bold mb-2">{name}</h2>
  <button 
    on:click={() => handleSelectCharacter(character)} 
    class="bg-green-500 text-white py-2 px-4 rounded-full {unlocked ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'}"
  >
    {unlocked ? 'Chat Now' : 'Locked'}
  </button>
</div>