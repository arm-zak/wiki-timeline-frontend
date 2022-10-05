<script lang="ts">
  import { game, shownPlayerId, socket, yourPlayerId } from "$lib/stores.js";
  import type { Player } from "wiki-timeline-common";

  let yourPlayer: Player;
  $: yourPlayer = $game.players.find((player) => player.id === $yourPlayerId);
</script>

<main class="flex flex-col mt-4 items-center">
  <div class="h-16">
    {#if $game.timer > 0}
      <span class="text-xl">Get ready! Game is starting in </span>
      <span class="countdown text-xl">
                <span style="--value:{$game.timer};"></span>
            </span>
    {/if}
  </div>
  {#each $game.players as player}
    <div class:bg-green-50={player.ready}
      class="w-72 h-9 m-0.5 py-1 px-2 font-medium flex justify-between items-center justify-center rounded border border-gray-300">
      <div class="w-4">
        {#if $yourPlayerId === player.id}
          <img class="w-4" src="/user.svg" alt="user" />
        {/if}
      </div>
      <p>{player.name}</p>
      <div class="w-4">
        {#if player.ready}
          <svg class="w-4 fill-green-700 float-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z" />
          </svg>
        {/if}
      </div>
    </div>
  {/each}
  {#each Array($game.maxPlayers - $game.players.length) as _, i}
    <div class="w-72 h-9 m-0.5 p-1 text-center italic rounded border border-gray-300">
      {#if $game.timer === 0}<p>Waiting for player</p>{/if}
    </div>
  {/each}
  {#if yourPlayer && !yourPlayer.ready}
    <button class="btn btn-primary mt-4"
            on:click={() => $socket.emit("ready-player", true)}>Ready
    </button>
  {/if}

  {#if yourPlayer && yourPlayer.ready}
    <button class="btn btn-secondary mt-4"
            on:click={() => $socket.emit("ready-player", false)}>Not ready
    </button>
  {/if}
</main>