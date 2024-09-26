<script>
  import { onMount } from 'svelte';
  import ConfirmationModal from './ConfirmationModal.svelte';
  export let character;
  export let backToSelection;

  let messages = [];
  let newMessage = '';
  let chatContainer;
  let isLoading = false;
  let showConfirmationModal = false;

  onMount(async () => {
    await fetchInitialMessages();
    scrollToBottom();
  });

  $: console.log(messages);

  async function fetchInitialMessages() {
    const storedMessages = localStorage.getItem(`chat_${character.name}`);
    if (storedMessages) {
      messages = JSON.parse(storedMessages).map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } 

    if (!storedMessages || messages.length === 0) {
      try {
        const response = await fetch(`/api/chat/${character.name.toLowerCase()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: []
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch initial messages');
        }

        const responseContent = await response.json();
        messages = responseContent.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        saveMessages(messages);
      } catch (error) {
        console.error('Error fetching initial messages:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  }

  async function sendMessage() {
    if (newMessage.trim()) {
      const userMessage = { role: 'user', content: newMessage, timestamp: new Date() };
      const updatedMessages = [...messages, userMessage];
      messages = updatedMessages;
      saveMessages(updatedMessages);
      newMessage = '';
      scrollToBottom();

      isLoading = true;
      try {
        const response = await fetch(`/api/chat/${character.name.toLowerCase()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const responseContent = await response.json();
        const assistantMessage = { role: 'assistant', content: responseContent[0].text, timestamp: new Date() };
        messages = [...updatedMessages, assistantMessage];
        saveMessages(messages);
      } catch (error) {
        console.error('Error fetching response:', error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        isLoading = false;
        scrollToBottom();
      }
    }
  }

  function saveMessages(messagesToSave) {
    localStorage.setItem(`chat_${character.name}`, JSON.stringify(messagesToSave));
  }

  function scrollToBottom() {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }

  function confirmRestart() {
    showConfirmationModal = true;
  }

  async function restartChat() {
    messages = [];
    saveMessages(messages);
    showConfirmationModal = false;
    await fetchInitialMessages();
    scrollToBottom();
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
      <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg {message.role === 'user' ? 'bg-green-500 text-white' : 'bg-white'}">
          <p>{message.content}</p>
          <p class="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    {/each}
    {#if isLoading}
      <div class="flex justify-start">
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white">
          <p class="typing-indicator"><span>.</span><span>.</span><span>.</span></p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Message input -->
  <div class="bg-white border-t border-gray-200 px-4 py-2 flex">
    <button on:click={confirmRestart} class="mr-2 bg-red-500 text-white rounded-full p-2" title="Restart Chat">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
    <input
      type="text"
      bind:value={newMessage}
      placeholder="Type a message..."
      class="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
      on:keypress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
      disabled={isLoading}
    >
    <button on:click={sendMessage} class="ml-2 bg-green-500 text-white rounded-full p-2" disabled={isLoading}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </button>
  </div>
</div>

<ConfirmationModal
  bind:showModal={showConfirmationModal}
  onConfirm={restartChat}
  message="Are you sure you want to restart the chat? This will delete all current messages."
/>

<style>
  .typing-indicator {
    display: flex;
    align-items: center;
  }

  .typing-indicator span {
    animation: blink 1.4s infinite both;
    height: 5px;
    width: 5px;
    background: #3B82F6;
    border-radius: 50%;
    display: inline-block;
    margin: 0 1px;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0% {
      opacity: 0.1;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.1;
    }
  }
</style>