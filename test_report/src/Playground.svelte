<script>
  import { writable } from "svelte/store";
  import * as processor from "../lib/reference-implementation/index.js";

  // Create store
  const currentTestFile = writable({
    title: "join function",
    resources: [
      {
        resourceType: "Patient",
        id: "p1",
        name: [
          {
            use: "official",
            given: ["p1.g1", "p1.g2"],
          },
        ],
      },
    ],
    tests: [
      {
        title: "join with comma",
        view: {
          resource: "Patient",
          select: [
            {
              column: [
                { path: "id", alias: "id" },
                { path: "name.given.join(',')", alias: "given" },
              ],
            },
          ],
        },
        expect: [{ id: "p1", given: "p1.g1,p1.g2" }],
      },
      {
        title: "join with no value - default to no separator",
        view: {
          resource: "Patient",
          select: [
            {
              column: [
                { path: "id", alias: "id" },
                { path: "name.given.join()", alias: "given" },
              ],
            },
          ],
        },
        expect: [{ id: "p1", given: "p1.g1p1.g2" }],
      },
    ],
  });

  let selectedTestIndex = 0;
  let initializedFromStore = {
    resources: JSON.stringify($currentTestFile.resources, null, 2),
    expected: $currentTestFile.tests.map((t) => JSON.stringify(t.expect, null, 2)),
    views: $currentTestFile.tests.map((t) => JSON.stringify(t.view, null, 2)),
    resources: JSON.stringify($currentTestFile.resources, null, 2),
  };

  let observed = [];
  const generateObservations = async (resources, view) => {
    observed = [];
    for await (const r of processor.processResources(
      processor.fromArray(resources),
      view
    )) {
      observed = observed.concat(r);
    }
  };
  $: {
    try {
    generateObservations(
      JSON.parse(initializedFromStore.resources),
      JSON.parse(initializedFromStore.views[selectedTestIndex])
    );
    } catch(e){ }
  }
</script>

<div id="api-playground" class="flex-grow">
  <!-- ViewDefinition Panel -->
  <div class="panel left-panel">
    <select bind:value={selectedTestIndex}>
      {#each $currentTestFile.tests as test, i}
        <option value={i} selected={i == 0}>{test.title} {i}</option>
      {/each}
    </select>

    <textarea style={`height: ${initializedFromStore.views[selectedTestIndex].split("\n").length * 1.5}em`}
      id="view-definition"
      bind:value={initializedFromStore.views[selectedTestIndex]}
    />
  </div>

  <!-- Resources Array Panel -->
  <div class="panel right-panel">
    <h2>Resources Array</h2>
    <textarea style={`height: ${initializedFromStore.resources.split("\n").length * 1.5}em`}
      id="resources-array"
      bind:value={initializedFromStore.resources}
    />
  </div>

  <!-- Expected Results Panel -->
  <div class="panel">
    <h2>Expected Results</h2>
    <textarea style={`height: ${initializedFromStore.expected[selectedTestIndex].split("\n").length * 1.5}em`}
      id="expected-results"
      bind:value={initializedFromStore.expected[selectedTestIndex]}
    />
  </div>

  <!-- Observed Results Panel -->
  <div class="panel">
    <h2>Observed Results</h2>
    <pre id="observed-results">{JSON.stringify(observed, null, 2)}</pre>
  </div>
</div>

<style>
  #api-playground {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .panel {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }

  .left-panel {
    grid-column: 1 / 2;
    grid-row: 1 / 4;
  }

  .right-panel {
    grid-column: 2 / 3;
  }

  textarea {
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
