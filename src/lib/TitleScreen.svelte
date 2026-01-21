<script>
  export let startGame;
</script>

<div class="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
  <!-- Decorative background elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-20 -left-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-32 -right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
    <div class="absolute top-1/4 right-1/4 w-48 h-48 bg-green-200/20 rounded-full blur-2xl"></div>
  </div>

  <!-- Italian flag accent -->
  <div class="absolute top-0 left-0 right-0 h-1.5 flex">
    <div class="flex-1 bg-green-500"></div>
    <div class="flex-1 bg-white"></div>
    <div class="flex-1 bg-red-500"></div>
  </div>

  <div class="relative z-10 flex flex-col items-center">
    <!-- Logo/Heart -->
    <div class="relative w-48 h-48 mb-8">
      <div class="absolute inset-0 bg-gradient-to-br from-rose-400 to-red-500 rounded-full shadow-2xl shadow-rose-300/50 animate-pulse-slow"></div>
      <div class="absolute inset-3 bg-gradient-to-br from-rose-300 to-red-400 rounded-full"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-7xl drop-shadow-lg">❤️</span>
      </div>
    </div>

    <!-- Title -->
    <div class="text-center mb-10">
      <h1 class="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
        <span class="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">That's </span>
        <span class="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent italic">Amore</span>
      </h1>
      <p class="text-lg md:text-xl text-stone-500 font-light tracking-wide">Your Italian Romance Adventure</p>
    </div>

    <!-- Start Button -->
    <button
      class="group relative bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-300/40 active:scale-100"
      on:click={startGame}
    >
      <span class="relative z-10 flex items-center gap-2">
        Iniziamo!
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </button>

    <!-- Subtitle -->
    <p class="mt-8 text-sm text-stone-400">Learn Italian through flirty conversations</p>
  </div>
</div>

<style>
  @keyframes pulse-slow {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s infinite ease-in-out;
  }
</style>
