<script>
 import Tailwindcss from './Tailwindcss.svelte';
 import { Router, Link, Route } from "svelte-routing";
 import Playground  from './Playground.svelte';
 import Impls  from './Impls.svelte';
 import Tests  from './Tests.svelte';
 import { onMount } from "svelte";

 export let name;
 export let url = "";

 onMount(async function () {
     window.addEventListener('hashchange', function(){
         hash = window.location.hash.substring(1);
     })
 })

 let hash = window.location.hash.substring(1);

</script>

<Tailwindcss />

<div class="flex flex-col" style="height: 100%">
    <div class="flex space-x-4 px-4 py-1 border-b items-center" style="background-color: rgb(239 253 254);">
        <a href="" class="flex items-center px-4">
            <img src="logo.jpeg" class="w-10 h-10" style="" /> SQL on FHIR 2.0
        </a>
        <a href="#pg" class="px-2 hover:text-blue-500 hover:bg-gray-150">Playground</a>
        <a href="#" class="px-2 hover:text-blue-500 hover:bg-gray-150">Tests</a>
        <a href="#impls" class="px-2 hover:text-blue-500 hover:bg-gray-150">Implementations</a>
    </div>

    {#if hash == 'pg'}
        <Playground/>
    {:else if hash == 'impls'}
        <Impls/>
    {:else}
        <Tests/>
    {/if}
</div>

