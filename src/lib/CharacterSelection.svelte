<script>
  import Character from './Character.svelte';
  export let selectCharacter;

  let characters = [
    { name: 'Mario', image: '/images/mario.webp', unlocked: true },
    { name: 'Giovanni', image: '/images/giovanni.webp', unlocked: true },
    { name: 'Marco', image: '/images/marco.webp', unlocked: false },
    { name: 'Francesca', image: '/images/francesca.webp', unlocked: false },
    { name: 'Antonio', image: '/images/antonio.webp', unlocked: false },
    { name: 'Sofia', image: '/images/sofia.webp', unlocked: false },
    { name: 'Lorenzo', image: '/images/lorenzo.webp', unlocked: false },
    { name: 'Elena', image: '/images/elena.webp', unlocked: false },
    { name: 'Matteo', image: '/images/matteo.webp', unlocked: false },
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
    } else {
      alert('This character is locked!');
    }
  }

  // New function to count characters with max love level
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

  // New function to unlock characters based on max love count
  function unlockCharacters() {
    const maxLoveCount = countMaxLoveCharacters();
    for (let i = 0; i < Math.min(maxLoveCount + 2, characters.length); i++) {
      characters[i].unlocked = true;
    }
  }

  // Call unlockCharacters when the component is mounted
  import { onMount } from 'svelte';
  onMount(() => {
    unlockCharacters();
  });
</script>

<div class="min-h-screen bg-gradient-to-b from-green-100 to-red-100 p-4 flex flex-col items-center">
  <h1 class="text-4xl text-center text-green-600 mb-8 mt-10">Choose Your Italian Date</h1>
  
  <div class="relative w-full max-w-sm h-[70vh] overflow-hidden">
    {#key currentIndex}
      <Character 
        character={characters[currentIndex]} 
        {handleSelectCharacter} 
      />
    {/key}
  </div>

  <div class="mt-8 flex justify-center space-x-4">
    <button 
      on:click={previousCharacter} 
      class="bg-red-500 text-white py-2 px-4 rounded-full {currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}"
      disabled={currentIndex === 0}
    >
      ❮ Previous
    </button>
    <button 
      on:click={nextCharacter} 
      class="bg-green-500 text-white py-2 px-4 rounded-full {currentIndex === characters.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}"
      disabled={currentIndex === characters.length - 1}
    >
      Next ❯
    </button>
  </div>
</div>