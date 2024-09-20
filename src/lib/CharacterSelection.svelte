<script>
  import Character from './Character.svelte';
  export let selectCharacter;

  let characters = [
    { name: 'Mario', image: '/images/mario.png', unlocked: true },
    { name: 'Luigi', image: '/images/luigi.png', unlocked: true },
    { name: 'Giovanni', image: '/images/giovanni.png', unlocked: false },
    { name: 'Francesca', image: '/images/francesca.png', unlocked: false },
    { name: 'Sofia', image: '/images/sofia.png', unlocked: false },
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
</script>

<div class="min-h-screen bg-gradient-to-b from-green-100 to-red-100 p-4 flex flex-col items-center">
  <h1 class="text-4xl text-center text-green-600 mb-8">Choose Your Italian Date</h1>
  
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