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

  $: console.log(messages);

  $: if (loveLevel >= 100 && !hasReachedMaxLove) {
    showThatsAmoreModal = true;
    hasReachedMaxLove = true;
    saveMessages(messages, loveLevel, isBlocked, hasReachedMaxLove);
  }

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
      } finally {
        isLoading = false;
        scrollToBottom();
      }
    }
  }

  function saveMessages(messagesToSave, loveLevelToSave, isBlockedToSave, hasReachedMaxLoveToSave) {
    const dataToSave = {
      messages: messagesToSave,
      loveLevel: loveLevelToSave,
      isBlocked: isBlockedToSave,
      hasReachedMaxLove: hasReachedMaxLoveToSave
    };
    localStorage.setItem(`chat_${character.name}`, JSON.stringify(dataToSave));
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  function confirmRestart() {
    showConfirmationModal = true;
  }

  async function restartChat() {
    messages = [];
    loveLevel = 0;
    isBlocked = false;
    hasReachedMaxLove = false;
    saveMessages(messages, loveLevel, isBlocked, hasReachedMaxLove);
    showConfirmationModal = false;
    await fetchInitialMessages();
    scrollToBottom();
  }

  function continueChat() {
    showThatsAmoreModal = false;
  }

  function backToCharacterSelection() {
    showThatsAmoreModal = false;
    backToSelection();
  }

  $: cappedLoveLevel = Math.max(-100, Math.min(100, loveLevel));
  $: lovePercentage = Math.abs(cappedLoveLevel);
  $: isPositive = cappedLoveLevel >= 0;
</script>

{#if showThatsAmoreModal}
  <ThatsAmoreModal
    bind:showModal={showThatsAmoreModal}
    onContinue={continueChat}
    onBackToSelection={backToCharacterSelection}
  />
{/if}

<div class="flex flex-col h-screen bg-gradient-to-br from-stone-100 to-stone-50">
  <!-- Header -->
  <div class="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 shadow-sm">
    <button
      on:click={backToSelection}
      class="w-10 h-10 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div class="relative">
      <img src={character.image} alt={character.name} class="w-11 h-11 rounded-full object-cover ring-2 ring-rose-200">
      <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
    </div>

    <div class="flex-1">
      <h1 class="font-semibold text-stone-800">{character.name}</h1>
      <p class="text-xs text-green-600">Online</p>
    </div>

    <button
      on:click={confirmRestart}
      class="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      title="Restart Chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>

  <!-- Love Progress Bar -->
  <div class="bg-white border-b border-stone-100 px-4 py-3">
    <div class="flex items-center gap-3">
      <span class="text-xl">
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
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-stone-500">Love Level</span>
          <span class="text-xs font-semibold {isPositive ? 'text-rose-500' : 'text-blue-500'}">{cappedLoveLevel}</span>
        </div>
        <div class="h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500 ease-out {isPositive ? 'bg-gradient-to-r from-rose-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'}"
            style="width: {lovePercentage}%"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Chat messages -->
  <div bind:this={chatContainer} class="flex-1 overflow-y-auto p-4 space-y-3">
    {#each messages as message}
      <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
        {#if message.role !== 'user'}
          <img src={character.image} alt={character.name} class="w-8 h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0">
        {/if}
        <div class="max-w-[75%]">
          <div class="px-4 py-2.5 rounded-2xl {message.role === 'user'
            ? 'bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-br-md'
            : 'bg-white text-stone-800 shadow-sm rounded-bl-md'}">
            <p class="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p class="text-[10px] text-stone-400 mt-1 {message.role === 'user' ? 'text-right' : 'text-left'} px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="flex justify-start">
        <img src={character.image} alt={character.name} class="w-8 h-8 rounded-full object-cover mr-2 mt-1">
        <div class="bg-white shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Message input -->
  <div class="bg-white border-t border-stone-200 px-4 py-3">
    <div class="flex items-center gap-2">
      <input
        type="text"
        bind:value={newMessage}
        placeholder={isBlocked ? 'You have been blocked' : 'Type a message...'}
        class="flex-1 bg-stone-100 text-stone-800 placeholder-stone-400 rounded-full px-5 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-rose-300 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        on:keypress={(e) => e.key === 'Enter' && !isLoading && !isBlocked && sendMessage()}
        disabled={isLoading || isBlocked}
      >
      <button
        on:click={sendMessage}
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 {isLoading || isBlocked || !newMessage.trim()
          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
          : 'bg-gradient-to-br from-rose-500 to-red-500 text-white hover:shadow-lg hover:shadow-rose-300/40 active:scale-95'}"
        disabled={isLoading || isBlocked || !newMessage.trim()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
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
    gap: 4px;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #f43f5e, #ef4444);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
