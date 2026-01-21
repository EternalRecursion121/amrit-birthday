<script>
  import { onDestroy } from 'svelte';
  import confetti from 'canvas-confetti';

  export let showModal = false;
  export let onContinue;
  export let onBackToSelection;

  let confettiInterval;

  $: if (showModal) {
    launchConfetti();
  }

  function launchConfetti() {
    if (confettiInterval) {
      clearInterval(confettiInterval);
    }

    const duration = 5 * 1000;
    const end = Date.now() + duration;

    confettiInterval = setInterval(function () {
      if (Date.now() > end) {
        clearInterval(confettiInterval);
        return;
      }

      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        colors: ['#f43f5e', '#ef4444', '#22c55e', '#ffffff', '#fbbf24'],
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        }
      });
    }, 500);
  }

  onDestroy(() => {
    if (confettiInterval) {
      clearInterval(confettiInterval);
    }
  });
</script>

{#if showModal}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal">
      <!-- Header with heart -->
      <div class="bg-gradient-to-br from-rose-500 to-red-500 py-8 px-6 text-center">
        <div class="text-6xl mb-3 animate-bounce-slow">💖</div>
        <h2 class="text-3xl font-bold text-white mb-1">That's Amore!</h2>
        <p class="text-rose-100 text-sm">You've won their heart!</p>
      </div>

      <!-- Content -->
      <div class="p-6 text-center">
        <p class="text-stone-600 mb-6">
          Congratulations! You've reached the highest level of love. Your Italian charm was irresistible!
        </p>

        <div class="space-y-3">
          <button
            class="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-red-500 hover:shadow-lg hover:shadow-rose-300/40 transition-all duration-200 hover:scale-[1.02] active:scale-100"
            on:click={onContinue}
          >
            Continue Chatting
          </button>
          <button
            class="w-full py-3.5 rounded-xl font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            on:click={onBackToSelection}
          >
            Find Another Match
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-modal {
    animation: modalIn 0.3s ease-out;
  }

  .animate-bounce-slow {
    animation: bounce-slow 1s infinite ease-in-out;
  }
</style>
