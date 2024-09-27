<script>
    import { onMount, onDestroy } from 'svelte';
    import confetti from 'canvas-confetti';
  
    export let showModal = false;
    export let onContinue;
    export let onBackToSelection;
  
    let confettiInterval;
  
    $: if (showModal) {
      launchConfetti();
    }
  
    function launchConfetti() {
      // Clear any existing confetti intervals
      if (confettiInterval) {
        clearInterval(confettiInterval);
      }
  
      // Launch confetti every 500ms for 5 seconds
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
          origin: {
            x: Math.random(),
            // since they fall down, start a bit higher than random
            y: Math.random() - 0.2
          }
        });
      }, 500);
    }
  
    // Clean up the interval when the component is destroyed
    onDestroy(() => {
      if (confettiInterval) {
        clearInterval(confettiInterval);
      }
    });
  </script>
  
  {#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg text-center relative overflow-hidden">
        <h2 class="text-2xl font-bold mb-4">That's Amore! 💖</h2>
        <p class="mb-6">Congratulations! You've reached the highest level of love!</p>
        <div class="flex justify-center space-x-4">
          <button
            class="bg-green-500 text-white px-4 py-2 rounded"
            on:click={onContinue}
          >
            Continue Chatting
          </button>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded"
            on:click={onBackToSelection}
          >
            Back to Character Select
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    /* Optional: Add any custom styles here */
  </style>
  