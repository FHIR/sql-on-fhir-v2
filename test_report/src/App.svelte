<script>
 import Tailwindcss from './Tailwindcss.svelte';
 import { onMount } from "svelte";

 export let name;


 export let menu = [];
 export let current = {};

 async function load(file){
     const response = await fetch(file);
     return await response.json();
 }

 onMount(async function () {
     menu = [await load('tests/v1/basic.json')];
     console.log(menu);
     current = menu[0];
 });

 export function columns(data){
     let cols = {};
     data.forEach((x)=>{
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

</script>

<Tailwindcss />

<main>
    <div class="min-h-screen flex">
        <nav class="w-100 bg-gray-100 py-4 px-2 border-r" id="menu" style="width:15em;">
            {#each menu as item}
                <a class="p-2 block cursor-pointer bg-fuchsia-600 text-gray-500 hover:text-blue-500 hover:bg-gray-150"
                   on:click={()=> current = item} >
                    {item.title}
                </a>
            {/each}
        </nav>
        <main id="content" class="flex-1 min-w-0 overflow-auto px-8 py-4">
            <h1 class="text-3xl">{current?.title}</h1>
            <p>{current?.description || ''}</p>
            <b>Tests</b>
            {#each current?.tests || [] as test}
                <div class="my-4">
                    <h2 class="text-2xl my-3 border-b">{test.title}</h2>
                    <p>{test.description || ''}</p>
                    <pre class="my-2 text-sm p-2 border rounded bg-gray-100">{JSON.stringify(test.view,null,2) }</pre>
                    <h3 class="text-lg">Expected:</h3>
                    <table>
                        <thead>
                            <tr>
                                {#each columns(test.expected) || [] as col}
                                    <th class="px-2 py-1 bg-gray-100 border">{col}</th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each test.expected || [] as row}
                                <tr>
                                    {#each columns(test.expected) || [] as col}
                                        <td class="px-2 py-1 border">{pp(row[col])}</td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>

                </div>
            {/each}
        </main>
    </div>
</main>
