<script>
  import { onMount } from 'svelte';
  import Character from './Character.svelte';
  export let selectCharacter;

  let characters = [
    { name: 'Mario', image: '/images/mario.webp', unlocked: true, tagline: 'The Adventurous Plumber' },
    { name: 'Giovanni', image: '/images/giovanni.webp', unlocked: true, tagline: 'The Charming Waiter' },
    { name: 'Marco', image: '/images/marco.webp', unlocked: false, tagline: "The Mama's Boy" },
    { name: 'Francesca', image: '/images/francesca.webp', unlocked: false, tagline: 'The Fashion Designer' },
    { name: 'Antonio', image: '/images/antonio.webp', unlocked: false, tagline: 'The Pizza Emperor' },
    { name: 'Sofia', image: '/images/sofia.webp', unlocked: false, tagline: 'The Marine Scientist' },
    { name: 'Lorenzo', image: '/images/lorenzo.webp', unlocked: false, tagline: 'The Master Chef' },
    { name: 'Elena', image: '/images/elena.webp', unlocked: false, tagline: 'The Investigative Journalist' },
    { name: 'Matteo', image: '/images/matteo.webp', unlocked: false, tagline: 'The Classical Violinist' },
  ];

  let currentIndex = 0;

  function nextCharacter() {
    if (currentIndex < characters.length - 1) {
      currentIndex++;
    }
  }

  function previousCharacter() {
    if (currentIndex > 0) {
      currentIndex--;
    }
  }

  function handleSelectCharacter(character) {
    if (character.unlocked) {
      selectCharacter(character);
    }
  }

  function countMaxLoveCharacters() {
    let count = 0;
    for (let character of characters) {
      const storedData = localStorage.getItem(`chat_${character.name}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.hasReachedMaxLove) {
          count++;
        }
      }
    }
    return count;
  }

  function unlockCharacters() {
    const maxLoveCount = countMaxLoveCharacters();
    for (let i = 0; i < Math.min(maxLoveCount + 2, characters.length); i++) {
      characters[i].unlocked = true;
    }
  }

  onMount(() => {
    unlockCharacters();
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex flex-col items-center overflow-hidden relative">
  <!-- Decorative background -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-32 -right-32 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
  </div>

  <!-- Italian flag accent -->
  <div class="absolute top-0 left-0 right-0 h-1.5 flex">
    <div class="flex-1 bg-green-500"></div>
    <div class="flex-1 bg-white"></div>
    <div class="flex-1 bg-red-500"></div>
  </div>

  <!-- Header -->
  <div class="relative z-10 text-center pt-12 pb-6 px-4">
    <h1 class="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Choose Your Match</h1>
    <p class="text-stone-500">Swipe to find your Italian romance</p>
  </div>

  <!-- Character Card Container -->
  <div class="relative z-10 w-full max-w-sm flex-1 px-4 pb-4">
    <div class="relative w-full h-full min-h-[480px]">
      {#key currentIndex}
        <Character
          character={characters[currentIndex]}
          {handleSelectCharacter}
          totalCount={characters.length}
          currentNum={currentIndex + 1}
        />
      {/key}
    </div>
  </div>

  <!-- Navigation -->
  <div class="relative z-10 pb-8 pt-4 flex items-center gap-6">
    <button
      on:click={previousCharacter}
      class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 {currentIndex === 0 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-white text-stone-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'}"
      disabled={currentIndex === 0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Dots indicator -->
    <div class="flex gap-1.5">
      {#each characters as _, i}
        <div
          class="w-2 h-2 rounded-full transition-all duration-200 {i === currentIndex ? 'bg-rose-500 w-4' : 'bg-stone-300'}"
        ></div>
      {/each}
    </div>

    <button
      on:click={nextCharacter}
      class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 {currentIndex === characters.length - 1 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-white text-stone-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'}"
      disabled={currentIndex === characters.length - 1}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>
