<script lang="ts">
  import { getLocaleFromPathname, init, isLoading, register } from "svelte-i18n";
  import { Language } from "wiki-timeline-common";

  register(Language.English, () => import("../locales/en.json"));
  register(Language.Swedish, () => import("../locales/sv.json"));
  init({
    fallbackLocale: Language.English,
    initialLocale: getLocaleFromPathname(/^\/(.*?)\//)
  });
</script>

<svelte:head>
  <meta name="description" content="Game about history" />
</svelte:head>

{#if !$isLoading}
  <slot />
{/if}