<script>
 import { onMount } from "svelte";
 import implementations from '../public/implementations.json';
 import tests from '../public/tests.json';
 
 // Get all the unique tags in the test suite.
 const tags = new Set();
 tests.forEach(test => {
     test.tests.forEach(t => {
          t.tags.forEach(tag => tags.add(tag));
     });
 });
 console.log("tests", tests);
 console.log("tags", tags);
 // Construct a mapping of tag to display name, with the reserved tags first.
 const reservedTags = {
     shareable: "Profile: Shareable View Definition",
     tabular: "Profile: Tabular View Definition",
     experimental: "Experimental"
 }
 const otherTags = Array.from(tags)
     .filter(tag => !Object.keys(reservedTags).includes(tag))
     .reduce((acc, tag) => {
         acc[tag] = tag;
         return acc;
     }, {});
 const sections = { ...reservedTags, ...otherTags }
 console.log("sections", sections);

 async function load(file){
     try {
         const response = await fetch(file);
         return await response.json();
     } catch (e) {
         console.error("Failed to load file", file, e);
         return null
     }
 }

 export let impls = implementations;

 onMount(async function () {
     Promise.all(implementations.map(async (impl, idx) => {
         if (impl.testResultsUrl){
             let res = await load(impl.testResultsUrl);
             impls[idx].results = res;
         }
     }))
 });

</script>

<div class="px-10 py-10">
    <center>
        <table class="flex-1">
            <thead>
                <tr>
                    <th class="px-4 py-1 border bg-gray-100 text-left">Test</th>
                    {#each impls as impl}
                        <th class="px-4 py-1 border bg-gray-100">
                            <a class="text-blue-800 display-block" href={impl.url}>{impl.name}</a>
                        </th>
                    {/each}
                </tr>
            </thead>

            <tbody>
                {#each Object.keys(sections) as section}
                {#if tags.has(section)}
                  <tr>
                      <td class="px-4 py-1 border font-bold bg-gray-50" colspan="100%">
                          {sections[section]}
                      </td>
                    </tr>
                    {#each tests as test}
                    {#if (test?.tests || []).find(t => t.tags.includes(section))}  
                        <tr>
                            <td class="px-4 py-1 border font-bold " colspan="100%">
                                <a href={"#tests/" + test.file}> {test.title} </a>
                            </td>
                        </tr>
                        {#each test?.tests || [] as t, i}
                        {#if t.tags.includes(section)}
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
                        {/if}
                        {/each}
                    {/if}
                    {/each}
                {/if}
                {/each}
            </tbody>
        </table>
    </center>
</div>
