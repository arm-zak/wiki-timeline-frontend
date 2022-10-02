<script lang="ts">
    import {siteTitle} from '$lib//config.js';
    import {onMount} from "svelte";
    import {page} from "$app/stores";
    import {_} from "svelte-i18n";
    import {goto} from "$app/navigation";

    let gameID = ""
    let userName = ""

    function joinGame(e) {
        e.preventDefault()
        localStorage.setItem("name", userName)
        goto("/" + $page.url.pathname.split('/')[1] + "/game/" + gameID.toUpperCase());
    }

    onMount(() => {
        userName = localStorage.getItem("name") || ""
        //console.log($page.url.pathname)
    })

</script>

<svelte:head>
    <title>{"Join game - " + siteTitle}</title>
</svelte:head>

<h2 class="text-2xl font-semibold">Join a game</h2>
<form class="w-56 form-control" on:submit={joinGame}>

    <label class="label label-text" for="room-code">{$_('common.room_code')}</label>
    <input maxlength={4} bind:value={gameID} class="input input-sm uppercase" type="text" id="room-code">
    <label class="label label-text" for="name">{$_('pages.your_name')}</label>
    <input maxlength={16} bind:value={userName} class="input input-sm" type="text" id="name" >
    <button class="btn btn-primary mt-4">Submit</button>
</form>

<div class="divider">OR</div>
<a href={"/"+ $page.url.pathname.split('/')[1] + "/create" }
   class="btn btn-secondary w-56">Create a new game</a>

