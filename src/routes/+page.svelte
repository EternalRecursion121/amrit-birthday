<script>
    import TitleScreen from '$lib/TitleScreen.svelte';
    import CharacterSelection from '$lib/CharacterSelection.svelte';
    import Chat from '$lib/Chat.svelte';
    import { writable } from 'svelte/store';

    const view = writable('title');
    const selectedCharacter = writable(null);

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

{#if $view === 'title'}
    <TitleScreen {startGame} />
{:else if $view === 'selection'}
    <CharacterSelection {selectCharacter} />
{:else if $view === 'chat'}
    <Chat character={$selectedCharacter} {backToSelection} />
{/if}
