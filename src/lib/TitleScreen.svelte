<script>
  export let startGame;
</script>

<div class="min-h-screen bg-gradient-to-b from-green-100 to-red-100 flex flex-col items-center justify-center p-4">
  <div class="flex items-center space-x-3">
    <div class="text-center font-fancy">
      <h1 class="text-6xl font-bold text-green-600 mb-2 italic">
        That's Amore
      </h1>
      <p class="text-2xl text-red-500 mb-8 font-serif">Your Italian Romance Adventure</p>
    </div>
  </div>
  
  <div class="relative w-64 h-64 mb-8">
    <div class="absolute inset-0 bg-white rounded-full shadow-lg"></div>
    <div class="absolute inset-2 bg-green-500 rounded-full"></div>
    <div class="absolute inset-4 bg-white rounded-full"></div>
    <div class="absolute inset-6 bg-red-500 rounded-full flex items-center justify-center">
      <span class="text-white text-9xl animate-pulse">❤️</span>
    </div>
  </div>

  <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl mb-4 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg" on:click={startGame}>
    <span class="font-italic">Iniziamo!</span>
  </button>
</div>

<style>
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-pulse {
    animation: pulse 1.6s infinite ease-in-out;
  }
</style>