<script>
  import { onMount } from 'svelte';
  export let character;
  export let backToSelection;

  let messages = [];
  let newMessage = '';
  let chatContainer;

  onMount(() => {
    // Add some initial messages for demonstration
    messages = [
      { sender: 'character', text: `Ciao! I'm ${character.name}. How are you?`, timestamp: new Date() },
      { sender: 'user', text: "Hi! I'm good, thanks. How about you?', timestamp: new Date(Date.now() - 60000)"},
    ];
    scrollToBottom();
  });

  function sendMessage() {
    if (newMessage.trim()) {
      messages = [...messages, { sender: 'user', text: newMessage, timestamp: new Date() }];
      newMessage = '';
      scrollToBottom();
      // Simulate character response after a short delay
      setTimeout(() => {
        messages = [...messages, { sender: 'character', text: `That's great! I love talking about Italian food. What's your favorite pasta?`, timestamp: new Date() }];
        scrollToBottom();
      }, 1000);
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }
</script>

<div class="flex flex-col h-screen bg-gray-100">
  <!-- Header -->
  <div class="bg-green-500 text-white p-4 flex items-center">
    <button on:click={backToSelection} class="mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <img src={character.image} alt={character.name} class="w-10 h-10 rounded-full mr-3">
    <h1 class="text-xl font-bold">{character.name}</h1>
  </div>

  <!-- Chat messages -->
  <div bind:this={chatContainer} class="flex-1 overflow-y-auto p-4 space-y-4">
    {#each messages as message}
      <div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg {message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-white'}">
          <p>{message.text}</p>
          <p class="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    {/each}
  </div>

  <!-- Message input -->
  <div class="bg-white border-t border-gray-200 px-4 py-2 flex">
    <input
      type="text"
      bind:value={newMessage}
      placeholder="Type a message..."
      class="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
      on:keypress={(e) => e.key === 'Enter' && sendMessage()}
    >
    <button on:click={sendMessage} class="ml-2 bg-green-500 text-white rounded-full p-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </button>
  </div>
</div>