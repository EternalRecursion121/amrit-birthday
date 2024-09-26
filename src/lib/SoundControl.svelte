<script>
  import { VolumeX, Volume2, SkipForward, SkipBack } from "lucide-svelte";
  import { onMount, onDestroy } from 'svelte';
  import { isMusicOn } from './stores.js';  // Import the store

  let audioElement;
  let currentSongIndex = 0;
  let isReady = false;
  const playlist = [
    '/music/thats_amore.mp3',
    '/music/volare.mp3',
    '/music/mambo_italiano.mp3',
    '/music/bella_ciao.mp3',
    '/music/tu_vuo_fa_lamericano.mp3',
    '/music/azzurro.mp3',
    "/music/torna_a_surriento.mp3"
  ];

  onMount(() => {
    console.log('onMount', $isMusicOn);
    audioElement = new Audio();
    audioElement.src = playlist[currentSongIndex];
    audioElement.volume = 0.5; // Set volume to 50%
    audioElement.addEventListener('ended', playNextSong);
    audioElement.addEventListener('canplaythrough', () => {
      isReady = true;
    });
  });

  onDestroy(() => {
    if (audioElement) {
      audioElement.removeEventListener('ended', playNextSong);
      audioElement.removeEventListener('canplaythrough', () => {});
      audioElement.pause();
    }
  });

  function toggleMusic() {
    if (!isReady) return;
    $isMusicOn = !$isMusicOn;
    if ($isMusicOn) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }
  function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset the playback position
    }
    audioElement.src = playlist[currentSongIndex];
    audioElement.load();
    if ($isMusicOn) {
      audioElement.play().catch(error => console.error('Error playing audio:', error));
    }
  }

  function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    audioElement.pause();
    audioElement.src = playlist[currentSongIndex];
    audioElement.load();
    if ($isMusicOn) {
      audioElement.play().catch(error => console.error('Error playing audio:', error));
    }
  }
</script>

{#if isReady}
  <div class="flex items-center space-x-2">
    <button 
      on:click={playPreviousSong}
      class="text-green-700 hover:text-red-600 transition-all duration-200 transform hover:scale-105 p-2"
    >
      <SkipBack size={24} />
    </button>

    <button 
      on:click={toggleMusic}
      class="text-green-700 hover:text-red-600 transition-all duration-200 transform hover:scale-105 p-2"
    >
      {#if $isMusicOn}
        <Volume2 size={28} />
      {:else}
        <VolumeX size={28} />
      {/if}
    </button>

    <button 
      on:click={playNextSong}
      class="text-green-700 hover:text-red-600 transition-all duration-200 transform hover:scale-105 p-2"
    >
      <SkipForward size={24} />
    </button>
  </div>
{/if}