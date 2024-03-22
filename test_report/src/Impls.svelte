<script>
 import { onMount } from "svelte";
 import implementations from '../../implementations.json';
 import tests from '../public/tests.json';

 async function load(file){
     try {
         const response = await fetch(file);
         return await response.json();
     } catch (e) {
         console.error("Failed to load file", file, e);
         return null
     }
 }

 export let impls = [];

 onMount(async function () {
     for (const impl of implementations) {
         if (impl.testResultsUrl){
             let res = await load(impl.testResultsUrl);
             impl.results = res;
         }
     }

     impls = implementations;

 });

</script>

<div class="px-10 py-10">
    <center>
        <table class="flex-1">
            <thead>
                <tr>
                    <th class="px-4 py-1 border bg-gray-100">Test</th>
                    {#each impls as impl}
                        <th class="px-4 py-1 border bg-gray-100">
                            <a class="text-blue-800 display-block" href={impl.url}>{impl.name}</a>
                        </th>
                    {/each}
                </tr>
            </thead>

            <tbody>
                {#each tests as test}
                    <tr>
                        <td class="px-4 py-1 border font-bold ">
                            <a href={"#tests/" + test.file}> {test.title} </a>
                        </td>
                    </tr>
                    {#each test?.tests || [] as t, i}
                        <tr>
                            <td class="px-6 py-1 border ">
                                <a href={"#tests/" + test.file}> {t.title} </a>
                            </td>
                            {#each impls as impl}
                                {@const res = ((((impl.results || {})[test.file] || {}).tests || [])[i]?.result?.passed)}
                                <td class="px-4 py-1 border">
                                    {#if res === true}
                                        <span class="font-bold text-green-500">✓</span>
                                    {:else if res === false }
                                        <span class="font-bold text-red-500">⚠</span>
                                    {:else}
                                        <span>-</span>
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                {/each}
            </tbody>
        </table>
    </center>
</div>
