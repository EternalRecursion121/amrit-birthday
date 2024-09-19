<script>
  import { VolumeX, Volume2, SkipForward, SkipBack } from "lucide-svelte";
  import { onMount, onDestroy } from 'svelte';
  
  export let isMusicOn = false;
  
  let audioElement;
  let currentSongIndex = 0;
  let isReady = false;
  const playlist = [
    '/music/thats_amore.mp3',
    // '/music/bella_ciao.mp3',
    // '/music/volare_dean_martin.mp3',
    // '/music/mambo_italiano.mp3',
    // '/music/tu_vuo_fa_lamericano.mp3',
    // '/music/nel_blu_dipinto_di_blu.mp3',
    // '/music/funiculi_funicula.mp3',
    // '/music/o_sole_mio.mp3',
    // '/music/quando_quando_quando.mp3',
    // '/music/buonasera_signorina.mp3',
    // '/music/azzurro.mp3',
    // '/music/torna_a_surriento.mp3'
  ];

  onMount(() => {
    audioElement = new Audio();
    audioElement.src = playlist[currentSongIndex];
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
    isMusicOn = !isMusicOn;
    if (isMusicOn) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    audioElement.src = playlist[currentSongIndex];
    if (isMusicOn) audioElement.play();
  }

  function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    audioElement.src = playlist[currentSongIndex];
    if (isMusicOn) audioElement.play();
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
      {#if isMusicOn}
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