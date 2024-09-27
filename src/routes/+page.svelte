<script>
    import TitleScreen from '$lib/TitleScreen.svelte';
    import CharacterSelection from '$lib/CharacterSelection.svelte';
    import Chat from '$lib/Chat.svelte';
    import SoundControl from '$lib/SoundControl.svelte';
    import { writable } from 'svelte/store';

    const view = writable('title');
    const selectedCharacter = writable(null);
    const isMusicOn = writable(false);

    function startGame() {
        view.set('selection');
    }

    function selectCharacter(character) {
        selectedCharacter.set(character);
        view.set('chat');
    }

    function backToSelection() {
        view.set('selection');
        selectedCharacter.set(null);
    }
</script>

<div class="relative min-h-screen">
    <div class="absolute top-4 right-4 z-10">
        <SoundControl {isMusicOn} />
    </div>

    {#if $view === 'title'}
        <TitleScreen {startGame} />
    {:else if $view === 'selection'}
        <CharacterSelection {selectCharacter} />
    {:else if $view === 'chat'}
        <Chat character={$selectedCharacter} {backToSelection} />
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>