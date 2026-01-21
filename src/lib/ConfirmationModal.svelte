<script>
  export let showModal = false;
  export let onConfirm;
  export let message;

  function closeModal() {
    showModal = false;
  }
</script>

{#if showModal}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal">
      <div class="p-6">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-stone-800 text-center mb-2">Start Over?</h2>
        <p class="text-stone-500 text-center text-sm">{message}</p>
      </div>
      <div class="flex border-t border-stone-100">
        <button
          on:click={closeModal}
          class="flex-1 py-4 text-stone-600 font-medium hover:bg-stone-50 transition-colors border-r border-stone-100"
        >
          Cancel
        </button>
        <button
          on:click={onConfirm}
          class="flex-1 py-4 text-red-500 font-semibold hover:bg-red-50 transition-colors"
        >
          Restart
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-modal {
    animation: modalIn 0.2s ease-out;
  }
</style>
