<script lang="ts">

  import { game, yourPlayerId } from "$lib/stores.js";
  import type { Player } from "common";

  let winner: Player;
  $: winner = $game.players.sort((a, b) => b.eventQuestions.length -
    a.eventQuestions.length)[0];
</script>

<main class="flex flex-col mt-4 items-center">
  <p>
    {#if $yourPlayerId === winner.id} You{:else }{winner.name}{/if} won!</p>
  <p> Final score:</p>
  <table class="table table-compact w-full">
    <thead>
    <tr>
      <th>Name</th>
      <th>Score</th>

    </tr>
    </thead>
    <tbody>
    {#each $game.players.sort((a, b) => b.eventQuestions.length -
      a.eventQuestions.length) as player}
      <tr>
        <td class="flex items-center gap-1">
          {#if $yourPlayerId === player.id}
            <img class="inline w-4" src="/user.svg" alt="user" />
          {/if}{player.name}</td>
        <td
        >
          {player.eventQuestions.length}</td>

      </tr>
    {/each}
    </tbody>
  </table>
</main>