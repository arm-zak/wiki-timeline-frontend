<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { io } from "socket.io-client";
  import type { Game } from "wiki-timeline-common";
  import { GlobalStatus } from "wiki-timeline-common";
  import { GameStatus } from "wiki-timeline-common";
  import GameBoard from "$lib/game/GameBoard.svelte";
  import GameLobby from "$lib/game/GameLobby.svelte";
  import "../../../../../tailwind.css";
  import { siteTitle } from "$lib/config";
  import { goto } from "$app/navigation";
  import { _, locale } from "svelte-i18n";
  import { game, shownPlayerId, socket, yourPlayerId } from "$lib/stores";
  import GameHighScore from "$lib/game/GameHighScore.svelte";


  let status = GlobalStatus.Loading;
  const lang = $page.url.pathname.split("/")[1];
  const serverUrl = import.meta.env.VITE_SERVER_URL;


  function joinGame() {
    const userName = localStorage.getItem("name");
    $socket.emit("join-game", userName, (response) => {
      if (response.status === GlobalStatus.Ok) {
        status = GlobalStatus.Ok;
        yourPlayerId.set(response.userID);
        shownPlayerId.set(response.userID)
      } else {
        $socket.close();
        status = GlobalStatus.Error;
        alert("Something went wrong.")
        goto("/" + lang + "/");
      }
    });

  }

  function initSocket() {
    const token = localStorage.getItem("token");
    const gameID = $page.params.slug;
    return io(serverUrl, { auth: { token }, query: { gameID } });
  }

  function initListeners() {
    $socket.on("game-update", (updatedGame: Game) => {
      if ($game && $game.activePlayer !== updatedGame) {
        shownPlayerId.set(updatedGame.activePlayer)
      }
      game.set(updatedGame);
      locale.set($game.language);
      console.log($game);
    });
    $socket.on("timer-update", (time: number) => {
      const updatedGame = $game
      updatedGame.timer = time
      game.set(updatedGame)
    });
    $socket.on("receive-token", (jwt) => {
      localStorage.setItem("token", jwt);
    });
  }

  function leaveGame() {
    $socket.disconnect();
    goto("/" + lang + "/");
  }

  onMount(() => {
      socket.set(initSocket());
      initListeners();
      joinGame();

    }
  );
</script>

<svelte:head>
  {#if status === GlobalStatus.Loading}
    <title>{"Loading game - " + siteTitle}</title>
  {/if}
  {#if status === GlobalStatus.Ok && $game}
    <title>{"Game " + $game.id + " - " + siteTitle}</title>
  {/if}
  {#if status === GlobalStatus.Error}
    <title>{"Error - " + siteTitle}</title>
  {/if}
</svelte:head>

{#if status === GlobalStatus.Loading}
  <header class="text-center">
    <h1 class="text-2xl">Loading</h1>
  </header>

{/if}

{#if status === GlobalStatus.Ok && $game}
  <header class="flex place-content-between items-center px-3 py-2">
    <button class="btn btn-error" on:click={leaveGame}>
      {$_('game.leave_game')}
    </button>
    <div><h1 class="text-2xl hidden lg:inline">Room code: </h1>
      <h1 class="inline text-2xl font-bold">{$game.id}</h1></div>
    <label for="player-list" class:opacity-0={$game.status !== GameStatus.Active}
           class="btn btn-circle btn-ghost lg:hidden">
      <img class="w-8" src="/users.svg" alt="users" />
    </label>

  </header>
  {#if $game.status === GameStatus.Lobby}
    <GameLobby />
  {/if}
  {#if $game.status === GameStatus.Active}
    <GameBoard />
  {/if}
  {#if $game.status === GameStatus.Over}
    <GameHighScore />
  {/if}

{/if}

{#if status === GlobalStatus.Error}

  <header class="text-center">
    <h1 class="inline text-2xl">Game not found</h1>
  </header>
{/if}
