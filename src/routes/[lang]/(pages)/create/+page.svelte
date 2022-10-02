<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Language } from "common";
  import { siteTitle } from "$lib/config.js";
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  let maxPlayers = 4;
  let timeLimit = 30;
  let winningCards = 10;
  let spectator = false;
  let userName = "";
  const language = $page.url.pathname.split("/")[1] || Language.English;

  async function createGame(e) {
    e.preventDefault();
    localStorage.setItem("name", userName);
    const response = await fetch(serverUrl + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ maxPlayers, timeLimit, winningCards, language })
    });
    const gameID = await response.text();
    await goto("/" + language + "/game/" + gameID);
    //
  }

  onMount(() => {
    userName = localStorage.getItem("name");
  });

</script>
<svelte:head>
  <title>{"Create game - " + siteTitle}</title>
</svelte:head>

<h2 class="text-2xl font-semibold">Create a game</h2>
<form class="w-56 form-control" on:submit={createGame}>
  <!--    <label for="players">{$_('pages.player_limit')}</label>-->
  <label for="max-players" class="label label-text">{$_('pages.player_limit')}</label>
  <input class="input input-bordered input-sm" required min={2} max={8} bind:value={maxPlayers} type="number"
         id="max-players">
  <label for="winning-cards" class="label label-text">Cards to win</label>
  <input class="input input-bordered input-sm" required min={2} max={20} bind:value={winningCards} type="number"
         id="winning-cards">
  <label for="time-limit" class="label label-text">Time limit per player</label>
  <div class="input-group">
    <input class="input input-bordered input-sm grow" required min={10} max={120} bind:value={timeLimit}
           type="number" id="time-limit">
    <span>sec</span>
  </div>
  <div class="label cursor-pointer mt-2">
    <label for="spectator" class="label-text">Join as spectator</label>
    <input id="spectator" type="checkbox" bind:checked={spectator} class="checkbox" />
  </div>
  <!--    <div class="mb-2">-->
  <!--        <input bind:checked={spectator} type="checkbox" id="spectator" name="spectator">-->
  <!--        <label for="spectator">Join as spectator</label>-->
  <!--    </div>-->
  <label for="name" class="label label-text">Your name</label>
  <input disabled={spectator} required={!spectator} class="input input-bordered input-sm invalid:input-error "
         maxlength={16} bind:value={userName} type="text" id="name">

  <button class="btn btn-primary mt-4">Submit</button>

</form>
<div class="divider ">OR</div>
<a href={"/"+ $page.url.pathname.split('/')[1] + "/join" }
   class="btn btn-secondary w-56">Join an existing game</a>