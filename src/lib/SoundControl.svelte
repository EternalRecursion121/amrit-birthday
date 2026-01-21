<script>
  import { VolumeX, Volume2, SkipForward, SkipBack } from "lucide-svelte";
  import { onMount, onDestroy } from 'svelte';
  import { isMusicOn } from './stores.js';

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
    audioElement = new Audio();
    audioElement.src = playlist[currentSongIndex];
    audioElement.volume = 0.5;
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
      audioElement.currentTime = 0;
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
  <div class="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-lg">
    <button
      on:click={playPreviousSong}
      class="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
    >
      <SkipBack size={18} />
    </button>

    <button
      on:click={toggleMusic}
      class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 {$isMusicOn
        ? 'bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-md'
        : 'text-stone-500 hover:text-rose-500 hover:bg-rose-50'}"
    >
      {#if $isMusicOn}
        <Volume2 size={20} />
      {:else}
        <VolumeX size={20} />
      {/if}
    </button>

    <button
      on:click={playNextSong}
      class="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
    >
      <SkipForward size={18} />
    </button>
  </div>
{/if}
