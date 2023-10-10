<script>
 import { onMount } from "svelte";

 async function load(file){
     const response = await fetch(file);
     return await response.json();
 }
 export let impls = [];
 onMount(async function () {
     impls = await load('implementations.json');
     console.log(impls);
     impls.forEach((x)=> {
         if (x.testResultsUrl){
             let res = load(x.testResultsUrl);
             console.log(res)
         }
     })
 });

</script>

<div class="px-10 py-10">
    <center>
        <table class="flex-1">
            <!-- <thead>
                 <tr>
                 {#each columns(test.expect) || [] as col}
                 <th class="px-2 py-1 bg-gray-100 border">{col}</th>
                 {/each}
                 </tr>
                 </thead> -->
            <tbody>
                {#each impls as impl}
                    <tr>
                        <td class="px-4 py-1 border font-bold text-blue-600">
                            <a href={impl.url}>{impl.name}</a>
                        </td>
                        <td class="px-4 py-1 border">
                            {impl.description || '~'}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </center>
</div>
