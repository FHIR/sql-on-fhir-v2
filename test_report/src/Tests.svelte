<script>
 import { onMount } from "svelte";

 export let name;

 export let menu = [];
 export let impls = [];
 export let current = {};

 async function load(file){
     const response = await fetch(file);
     return await response.json();
 }

 onMount(async function () {
     menu = await load('tests.json');
     impls = await load('implementations.json');
     let hash = window.location.hash.substring(1);
     current = menu[0];
     menu.forEach((x)=> {
         if(x.file == hash) {
             current = x
         };
     })
 });

 export function columns(data){
     let cols = {};
     data?.forEach((x)=>{
         for(var k in x){
             cols[k]=true;
         }
     });
     let colsa = [];
     for(var k in cols){
         colsa.push(k)
     }
     return colsa;
 }

 export function pp(x){
     if(typeof x == 'boolean'){
         return x.toString();
     } else if(typeof x == 'string'){
         return x.toString();
     } else if(typeof x == 'number'){
         return x.toString()
     } else {
         return JSON.stringify(x);
     }
 }
 export function select(item) {
     current = item;
     window.location.hash = `tests/${item.file}`
 }


</script>

<main>
    <div class="min-h-screen flex">
        <nav class="w-100 bg-gray-100 py-4 px-2 border-r" id="menu" style="width:15em;">
            {#each menu as item}
                <a class="p-2 block cursor-pointer bg-fuchsia-600 text-gray-500 hover:text-blue-500 hover:bg-gray-150"
                   on:click={select(item)} >
                    {item.title}
                </a>
            {/each}
        </nav>
        <main id="content" class="flex-1 min-w-0 overflow-auto px-8 py-4">
            <h1 class="text-3xl border-b mt-3 mb-1">{current?.title}</h1>
            <p class="my-2 text-gray-600">{current?.description || ''}</p>
            <h2 class="mt-4 mb-2 text-sm font-bold text-gray-500">Dataset</h2>
            <div class="border divide-y">
                {#each current?.resources || [] as resource}
                    <details>
                        <summary class="px-4 py-1 hover:bg-gray-100 cursor-pointer">
                            {resource.resourceType} / <b>{resource.id}</b>
                            <span class="text-xs text-gray-500"> {JSON.stringify(resource).substring(0,160)}... </span>
                        </summary>
                        <pre class="border-t text-xs bg-gray-100 p-4">{ JSON.stringify(resource,false, " ")}</pre>
                    </details>
                {/each}
            </div>
            <h2 class="mt-6 mb-2 text-sm font-bold text-gray-500">Tests</h2>
            {#each current?.tests || [] as test}
                <details class="my-4">
                    <summary class="px-4 py-1 hover:bg-gray-100 cursor-pointer border-b">
                        {test.title}
                    </summary>
                    <div class="flex space-x-4 items-start py-2">
                        <pre class="flex-1 text-xs p-2 border rounded bg-gray-100">{JSON.stringify(test.view,null,2) }</pre>
                        <table class="flex-1">
                            {#if test.expectError}
                                <div class="text-red-500 p-4"> Expected error</div>
                            {/if }
                            <thead>
                                <tr>
                                    {#each columns(test.expect) || [] as col}
                                        <th class="px-2 py-1 bg-gray-100 border">{col}</th>
                                    {/each}
                                </tr>
                            </thead>
                            <tbody>
                                {#each test.expect || [] as row}
                                    <tr>
                                        {#each columns(test.expect) || [] as col}
                                            <td class="px-2 py-1 border">{pp(row[col])}</td>
                                        {/each}
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </details>
            {/each}
        </main>
    </div>
</main>
