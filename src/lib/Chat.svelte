<script>
  import { onMount } from 'svelte';
  import ConfirmationModal from './ConfirmationModal.svelte';
  import ThatsAmoreModal from './ThatsAmoreModal.svelte';

  export let character;
  export let backToSelection;

  let showThatsAmoreModal = false;
  let messages = [];
  let newMessage = '';
  let chatContainer;
  let isLoading = false;
  let showConfirmationModal = false;
  let loveLevel = 0;
  let isBlocked = false;
  let hasReachedMaxLove = false;

  onMount(async () => {
    await fetchInitialMessages();
    scrollToBottom();
  });

  // For debugging purposes
  $: console.log(messages);

  // Reactive statement to check love level
  $: if (loveLevel >= 100 && !hasReachedMaxLove) {
    showThatsAmoreModal = true;
    hasReachedMaxLove = true;
    saveMessages(messages, loveLevel, isBlocked, hasReachedMaxLove);
  }

  // Fetch initial messages from localStorage or API
  async function fetchInitialMessages() {
    const storedData = localStorage.getItem(`chat_${character.name}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      messages = parsedData.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      loveLevel = parsedData.loveLevel || 0;
      isBlocked = parsedData.isBlocked || false;
      hasReachedMaxLove = parsedData.hasReachedMaxLove || false;
    } else {
      try {
        const response = await fetch(`/api/chat/${character.name.toLowerCase()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [],
            loveLevel: loveLevel
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch initial messages');
        }

        const responseData = await response.json();
        const assistantMessage = { role: 'assistant', content: responseData.reply, timestamp: new Date() };
        messages = [assistantMessage];
        loveLevel = responseData.loveLevel;
        if (loveLevel <= -100) {
          isBlocked = true;
        }
        saveMessages(messages, loveLevel, isBlocked, hasReachedMaxLove);
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
    }
  }

  // Send a new message
  async function sendMessage() {
    if (newMessage.trim() && !isBlocked) {
      const userMessage = { role: 'user', content: newMessage, timestamp: new Date() };
      const updatedMessages = [...messages, userMessage];
      messages = updatedMessages;
      saveMessages(updatedMessages, loveLevel, isBlocked, hasReachedMaxLove);
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
            loveLevel: loveLevel
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const responseData = await response.json();
        const assistantMessage = { role: 'assistant', content: responseData.reply, timestamp: new Date() };
        messages = [...updatedMessages, assistantMessage];
        loveLevel = responseData.loveLevel;
        if (loveLevel <= -100) {
          isBlocked = true;
        }
        saveMessages(messages, loveLevel, isBlocked, hasReachedMaxLove);
      } catch (error) {
        console.error('Error fetching response:', error);
        // Optionally, handle the error (e.g., show an error message to the user)
      } finally {
        isLoading = false;
        scrollToBottom();
      }
    }
  }

  // Save messages and related data to localStorage
  function saveMessages(messagesToSave, loveLevelToSave, isBlockedToSave, hasReachedMaxLoveToSave) {
    const dataToSave = {
      messages: messagesToSave,
      loveLevel: loveLevelToSave,
      isBlocked: isBlockedToSave,
      hasReachedMaxLove: hasReachedMaxLoveToSave
    };
    localStorage.setItem(`chat_${character.name}`, JSON.stringify(dataToSave));
  }

  // Scroll chat to the bottom
  function scrollToBottom() {
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  // Show confirmation modal for restarting chat
  function confirmRestart() {
    showConfirmationModal = true;
  }

  // Restart the chat by resetting all relevant variables
  async function restartChat() {
    messages = [];
    loveLevel = 0; // Reset loveLevel
    isBlocked = false; // Reset isBlocked
    hasReachedMaxLove = false; // Reset hasReachedMaxLove
    saveMessages(messages, loveLevel, isBlocked, hasReachedMaxLove);
    showConfirmationModal = false;
    await fetchInitialMessages();
    scrollToBottom();
  }

  // Continue chatting after modal is shown
  function continueChat() {
    showThatsAmoreModal = false;
    // Optionally, add any other logic here for continuing the chat
  }

  // Go back to character selection
  function backToCharacterSelection() {
    showThatsAmoreModal = false;
    backToSelection();
  }

  // Compute the love percentage for the progress bar
  $: cappedLoveLevel = Math.max(-100, Math.min(100, loveLevel));
  $: lovePercentage = Math.abs(cappedLoveLevel);
</script>

{#if showThatsAmoreModal}
  <ThatsAmoreModal
    bind:showModal={showThatsAmoreModal}
    onContinue={continueChat}
    onBackToSelection={backToCharacterSelection}
  />
{/if}

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

  <!-- Love Progress Bar -->
  <div class="p-4 bg-white flex items-center justify-center">
    <div class="flex items-center">
      <span class="text-2xl mr-2">
        {#if loveLevel >= 100}
          💖
        {:else if loveLevel >= 50}
          😍
        {:else if loveLevel >= 0}
          🙂
        {:else if loveLevel > -50}
          😐
        {:else if loveLevel > -100}
          😠
        {:else}
          🤬
        {/if}
      </span>
      <div class="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full"
          style="width: {lovePercentage}%; background-color: {loveLevel >= 0 ? '#EF4444' : '#3B82F6'}"
        ></div>
      </div>
    </div>
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
      placeholder="{isBlocked ? 'You have been blocked.' : 'Type a message...'}"
      class="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
      on:keypress={(e) => e.key === 'Enter' && !isLoading && !isBlocked && sendMessage()}
      disabled={isLoading || isBlocked}
    >
    <button on:click={sendMessage} class="ml-2 bg-green-500 text-white rounded-full p-2" disabled={isLoading || isBlocked}>
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
