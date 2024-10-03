<script>
 import Tailwindcss from './Tailwindcss.svelte';

 let prefix = "/extra"

 let items  = [
     {title: "Overview", href: "/index.html"},
     {title: "View Definition", href: "/StructureDefinition-ViewDefinition.html"},
     {title: "Artifacts", href: "/artifacts.html"},
     {title: "Playground", href: prefix + "/playground.html"},
     {title: "Tests", href: prefix + "/tests.html"},
     {title: "Implementations", href: prefix + "/impls.html"},
     {title: "Contributing", href: "/contributing.html"}
 ]

</script>

<Tailwindcss />
<div class="flex space-x-4 px-4 py-1 border-b items-center text-white" style="background-color: #525ebb;">
    {#each items as item}
        <a href="{item.href}" class="px-2 hover:text-white hover:bg-gray-150">{item.title}</a>
    {/each}
</div>
