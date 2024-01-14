<style>
 #api-playground {
     display: grid;
     grid-template-columns: 1fr 2fr;
     gap: 0px;
 }

 .panel {
     /* border: 1px solid #ccc; */
     padding: 1rem;
     /* border-radius: 5px; */
 }

 .left-panel {
     /* grid-column: 1 / 1; */
     /* grid-row: 1 / 4; */
 }

 .right-panel {
     /* grid-column: 1/ 3; */
     /* grid-row: 1 / 4; */
 }
 .right-panel table {
     width: 100%;
 }

 .left-panel textarea {
     border: 1px solid #ccc;
     padding: 1em;
     width: 100%;
     height: calc(100% - 2em);
 }

 pre {
     background: #f5f5f5;
     padding: 10px;
     border-radius: 5px;
 }

 /* Media query for smaller screens */
 @media (max-width: 768px) {
     #api-playground {
         grid-template-columns: 1fr;
     }

     .left-panel,
     .right-panel {
         grid-column: 1 / 2;
         min-height: fit-content;
         grid-row:unset;
     }
 }
</style>
<script>
 import { evaluate } from "../lib/sof-js/src/index.js";
 import { data } from "./data.js";
 let observed = [];

 let viewdef = `{
  column: [
    {path: 'id'},
    {path: "name.first().family", name: 'last_name'},
    {path: "name.first().given.join(' ')", name: 'first_name'},
    {path: 'birthDate'},
]}`

 let v = {};
 let error = null;
 let result = {cols: [], rows: []};

 function tabelize(results) {
     let columns = [];
     let first_row = results[0] || {};
     for (var k in first_row){
         columns.push(k)
     }
     let rows = []
     for( var row of results) {
         rows.push(columns.map((k)=>{
             let v = row[k];
             if(v.toString().indexOf('[object') > -1){
                 v = JSON.stringify(v);
             }
             return v
         }))
     }
     return {rows: rows, cols: columns};
 }

 $: {
     try {
         error = null;
         eval('v=' + viewdef)
         result = tabelize(evaluate(v, data));
         /* tabelize(result) */
     } catch(e){
         error = e.toString();
     }
 }
</script>

<div id="api-playground" class="flex-grow">
    <!-- ViewDefinition Panel -->
    <div class="panel left-panel">
        <textarea id="view-definition" class="text-sm" bind:value={viewdef} />
    </div>

    <div class="panel right-panel">
        <!-- <h2>Observed Results</h2> -->
        {#if error}
            <div class="bg-red-100 text-red-600"> {error} </div>
        {:else}
            <div>
                <!-- <pre id="observed-results">{JSON.stringify(result, null, 2)}</pre> -->
                <table id="observed-results">
                    <thead>
                        <tr>
                            {#each result.cols as col}
                                <th class="text-sm px-2 py-1 border bg-gray-100"> {col} </th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each result.rows as row}
                            <tr>
                                {#each row as c}
                                    <td class="text-sm px-2 py-1 border text-gray-700"> {c} </td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>

