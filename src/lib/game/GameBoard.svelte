<script lang="ts">
  import { GameEventType } from "wiki-timeline-common";
  import { shownPlayerId, socket, yourPlayerId } from "../stores";
  import { game } from "$lib/stores.js";
  import type { Player } from "wiki-timeline-common";
  import PlayerList from "$lib/game/PlayerList.svelte";

  let shownPlayer: Player;
  let activePlayer: Player;
  let nextPlayer: Player;
  $: shownPlayer = $game.players.find((player) => player.id === $shownPlayerId);
  $: activePlayer = $game.players.find((player) => player.id === $game.activePlayer);
  $: nextPlayer = $game.players[$game.players.findIndex(player => player.id === $game.activePlayer) + 1] ?
    $game.players[$game.players.findIndex(player => player.id === $game.activePlayer) + 1] : $game.players[0];
  let selectedYearIndex = NaN;

  function confirmYear() {
    $socket.emit("answer-question", selectedYearIndex);
    selectedYearIndex = NaN;
  }

  function passTurn() {
    $socket.emit("pass-question");
    selectedYearIndex = NaN;
  }
</script>

<main class="w-full max-h-[64rem] drawer drawer-mobile grow">
  <input id="player-list" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center h-full p-1">
    <p class="flex-shrink-0 mb-2 h-6">
      {#if $game.timer === 0 && $game.activePlayer === $yourPlayerId}
        Round {$game.round}: It's your turn
      {:else if $game.timer === 0 && $game.activePlayer && $game.activePlayer !== $yourPlayerId}
        Round {$game.round}: It's {$game.players.find((player) => player.id === $game.activePlayer).name}'s turn
      {/if}
    </p>
    <div class="h-44 flex items-center justify-center text-center flex-shrink-0">
      {#if $game.timer === 0 && $game.activeEventQuestion}

        <p class="bg-primary-content p-3 rounded-xl shadow border max-h-full overflow-auto">
          {$game.activeEventQuestion.text}
        </p>
      {:else if $game.timer > 0 && $game.eventLog[$game.eventLog.length - 1].event === GameEventType.RightAnswer}
        <p>
          {activePlayer.name} guessed right. The year
          was {$game.eventLog[$game.eventLog.length - 1].year}.
          New question in <span class="countdown">
                <span style="--value:{$game.timer};"></span>
            </span>
        </p>

      {:else if $game.timer > 0 && $game.eventLog[$game.eventLog.length - 1].event === GameEventType.WrongAnswer}
        <p>
          {activePlayer.name} guessed wrong. The year
          was {$game.eventLog[$game.eventLog.length - 1].year}.
          <br>
          {nextPlayer.name}'s turn in <span class="countdown">
                <span style="--value:{$game.timer};"></span>
            </span>
        </p>

      {:else if $game.timer > 0 && $game.eventLog[$game.eventLog.length - 1].event === GameEventType.PassTurn}
        <p>
          {activePlayer.name} passed their turn. The year
          was {$game.eventLog[$game.eventLog.length - 1].year}.
          <br>
          {nextPlayer.name}'s turn in <span class="countdown">
                <span style="--value:{$game.timer};"></span>
            </span>
        </p>
      {/if}
    </div>

    <div class="max-w-xs flex grow justify-between py-1">
      <div class="w-32 flex flex-col items-center pt-5 pb-1 gap-5">
        <p class="text-lg font-semibold">
          {#if $shownPlayerId === $yourPlayerId}
            Your timelock:
          {:else}
            {shownPlayer.name}'s timelock:
          {/if}
        </p>

        <div class="h-24 text-center my-2">
          {#if $shownPlayerId === $yourPlayerId && !isNaN(selectedYearIndex)}
            {#if shownPlayer.eventQuestions[selectedYearIndex - 1] != null && shownPlayer.eventQuestions[selectedYearIndex] != null}
              <p>
                Between {shownPlayer.eventQuestions[
              selectedYearIndex - 1
                ].year}
                and
                {shownPlayer.eventQuestions[
                  selectedYearIndex
                  ].year}
              </p>
            {:else if shownPlayer.eventQuestions[selectedYearIndex - 1] != null}
              <p>
                After {shownPlayer.eventQuestions[
              selectedYearIndex - 1
                ].year}
              </p>
            {:else if shownPlayer.eventQuestions[selectedYearIndex] != null}
              <p>
                Before {shownPlayer.eventQuestions[
                selectedYearIndex
                ].year}
              </p>
            {/if}
            <button class="btn btn-primary btn-sm mt-1" on:click={confirmYear}>Confirm</button>
          {/if}
        </div>
        <div class="h-8 text-center flex-shrink-0 mt-2">
          {#if $shownPlayerId === $yourPlayerId && $game.timer === 0 && shownPlayer
            .eventQuestions.filter((question) => !question.locked).length >= 1}
            <button class="btn btn-secondary btn-sm" on:click={passTurn}>Pass</button>
          {/if}
        </div>
      </div>
      <div class="grow flex flex-col items-center  w-44 overflow-auto">
        <div class="h-0 w-0 mt-4">
          {#if $shownPlayerId === $yourPlayerId && $game.activePlayer === $yourPlayerId && $game.timer === 0}
            <button
              class="relative right-[1rem] bottom-[1rem] btn btn-circle btn-sm hover:bg-info shadow-md transition
                {selectedYearIndex === 0 ? 'bg-info' : 'bg-white'}"
              on:click={() => (selectedYearIndex = 0)}
            >
              <img alt="add" class="w-4 h-4 filter-green" src="/plus.svg" />
            </button>
          {/if}
        </div>


        {#each shownPlayer.eventQuestions as event, i}
          <div class="min-h-16 h-16 w-0.5 bg-black" />
          <div class="h-0 w-0">
            <div
              class="relative rounded-full w-3 h-3 bg-black border-2 border-neutral z-10 bottom-[2.4rem] right-1.5"
            />
            {#if event.locked}
              <div class="relative left-1 bottom-[2.8rem]  bg-black h-0.5 w-8 " />
              <p
                class="relative w-14 bottom-[3.8rem] left-6 font-semibold bg-white rounded py-0.5 px-2 text-center shadow border"
              >
                {event.year}
              </p>
            {/if}
            {#if !event.locked}
              <div class="relative right-9 bottom-[2.8rem]  bg-black h-0.5 w-8 " />
              <p
                class="relative w-14 bottom-[3.8rem] right-[4.9rem] font-semibold text-center bg-white rounded py-0.5 px-2 shadow border"
              >
                {event.year}
              </p>
            {/if}
            {#if $shownPlayerId === $yourPlayerId && $game.activePlayer === $yourPlayerId && $game.timer === 0}
              <button
                class="relative bottom-[3.8rem] right-[1rem] btn btn-circle btn-sm hover:bg-info shadow-md  transition
                {selectedYearIndex === i+1 ? 'bg-info' : 'bg-white'}"
                on:click={() => (selectedYearIndex = i+1)}
              >
                <img alt="add" class="w-4 h-4" src="/plus.svg" />
              </button>
            {/if}
          </div>

        {/each}
      </div>
    </div>
  </div>
  <div class="drawer-side">
    <PlayerList />
  </div>
</main>


<style>

</style>