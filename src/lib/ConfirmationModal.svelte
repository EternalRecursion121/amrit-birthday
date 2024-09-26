<script>
  export let showModal = false;
  export let onConfirm;
  export let message;

  function closeModal() {
    showModal = false;
  }
</script>

{#if showModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
    <div class="bg-white p-5 rounded-lg shadow-xl">
      <h2 class="text-xl font-bold mb-4">Confirm Action</h2>
      <p class="mb-6">{message}</p>
      <div class="flex justify-end space-x-2">
        <button on:click={closeModal} class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
          Cancel
        </button>
        <button on:click={onConfirm} class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Confirm
        </button>
      </div>
    </div>
  </div>
{/if}