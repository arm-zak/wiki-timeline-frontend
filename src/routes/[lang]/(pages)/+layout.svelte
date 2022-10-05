<script lang="ts">
  import "../../../tailwind.css";
  import { locale } from "svelte-i18n";
  import { page } from "$app/stores";
  import { Language } from "wiki-timeline-common";
  import { getDisplayNames } from "$lib//util/languageNames";
  import { siteTitle } from "$lib/config.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let lang = $page.url.pathname.split("/")[1];
  let displayNames = getDisplayNames(lang);
  function changeLanguage() {
    locale.set(lang);
    displayNames = getDisplayNames(lang);
    //location.href = $page.url.toString()

    goto("/" + lang + "/" + $page.url.pathname.split("/").slice(2).join("/"));
  }
  onMount( () => {
    console.log(Language.English)
  })
</script>

<header class="flex justify-between w-full p-2">
  <h1 class="ml-2 text-2xl font-bold">{siteTitle}</h1>
  <select class="select select-sm" bind:value={lang} on:change={changeLanguage}>
    {#each Object.values(Language) as language}
      <option value={language}>{displayNames.of(language)}</option>
    {/each}
  </select>


  <!--    <p class="mb-2">A game about history</p>-->

</header>
<main class="flex flex-col items-center">
  <slot>
  </slot>
</main>
