<script lang="ts">
  import { game, shownPlayerId, yourPlayerId } from "$lib/stores.js";

  let highScore: number;
  $: highScore = $game.players.sort((a, b) => b.eventQuestions.filter((question) => question.locked).length -
    a.eventQuestions.filter((question) => question.locked).length)[0].eventQuestions.filter((question) => question.locked).length;
</script>

<label for="player-list" class="drawer-overlay" />
<div class="overflow-y-auto w-80 lg:w-96 lg:mr-6 bg-base-200 text-base-content">
  <div class="text-center mt-2">
    <h2 class="font-medium text-lg ml-3">Players</h2>
  </div>

  <table class="w-full table table-compact">
    <!-- head -->
    <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Score</th>

    </tr>
    </thead>
    <tbody>
    {#each $game.players as player, i}
      <tr
        on:click={() => ($shownPlayerId = player.id)}
        class:active={$shownPlayerId === player.id}
      >
        <td class="rounded-none">{i + 1}</td>
        <td class="flex items-center gap-1">
          {#if $yourPlayerId === player.id}
            <img class="inline w-4" src="/user.svg" alt="user" />
          {/if}{player.name}</td>
        <td class="rounded-none"
            class:font-bold={highScore === player.eventQuestions.filter((question) => question.locked).length}
        >
          {player.eventQuestions.filter((question) => question.locked).length}</td>

      </tr>
    {/each}
    </tbody>
  </table>
</div>