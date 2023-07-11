<script lang="ts">
  import { produce } from 'immer';
  import { Die } from './lib/Die';
  import { getDiceResults, getDieRoll } from './lib/generators';
  
  const polyhedrals: ReadonlyArray<number> = [4, 6, 8, 10, 12, 20, 100];
  let dice: Die[] = [];
  $: results = dice.map(die => die.result);
  
  let viewOptions: boolean = false;
  let options: Options = {
    alignAddDiceButtons: 'right',
    reverseAddDiceButtons: false,
    alignDiceControls: 'right',
    reverseDiceControls: true,
  };
  type Options = {
    alignAddDiceButtons: 'left' | 'right',
    reverseAddDiceButtons: boolean,
    alignDiceControls: 'left' | 'right',
    reverseDiceControls: boolean,
  };

  function addDie(sides: number) {
    const result = getDieRoll(sides);
    dice = dice.concat(new Die(sides, result));
  }

  function removeDie(index: number) {
    dice = produce(dice, draft => {
      draft.splice(index, 1);
    });
  }

  function rollDie(index: number) {
    const sides = dice[index].sides;
    const result = getDieRoll(sides);
    dice = produce(dice, draft => {
      draft[index].result = result;
    });
  }

  function rollAllDice() {
    const diceSides = dice.map(die => die.sides);
    const newDiceResults = getDiceResults(diceSides);
    dice = produce(dice, draft => {
      newDiceResults.forEach((result, index) => {
        draft[index].result = result;
      });
    });
  }

  function clearDice() {
    dice = [];
  }

  function toggleViewOptions() {
    viewOptions = !viewOptions;
  }
</script>

{#if viewOptions}
<form class="options">
  <p>
    Align dice buttons:
    <label><input type="radio" bind:group={options.alignAddDiceButtons} name="align-dice-buttons" value="left" />&nbsp;left</label>
    <label><input type="radio" bind:group={options.alignAddDiceButtons} name="align-dice-buttons" value="right" />&nbsp;right</label>
  </p>
  <label>Reverse dice buttons: <input type=checkbox bind:checked={options.reverseAddDiceButtons} /></label>

  <p>
    Align control buttons:
    <label><input type="radio" bind:group={options.alignDiceControls} name="align-dice-controls" value="left" />&nbsp;left</label>
    <label><input type="radio" bind:group={options.alignDiceControls} name="align-dice-controls" value="right" />&nbsp;right</label>
  </p>
  <label>Reverse dice buttons: <input type=checkbox bind:checked={options.reverseDiceControls} /></label>

  <button on:click={toggleViewOptions}>Save</button>
</form>
{:else}
<article class="app">
  <section class="results">
    <div>
    Total: {results.reduce((result, acc) => result + acc, 0)}
    </div>
    <div>|</div>
    <div>Max:&nbsp;
    {#if results.length === 0}
    0
    {:else}
    {Math.max(...results)}
    {/if}
    </div>
    <div>|</div>
    <div>Min:&nbsp;
    {#if results.length === 0}
    0
    {:else}
    {Math.min(...results)}
    {/if}
    </div>
  </section>

  <section class="dice">
    {#each dice as die, i}
    <div class="die">
      <button on:click={() => rollDie(i)}>
        {die.result} (d{die.sides})
      </button>
      <button class="remove" on:click={() => removeDie(i)}>&times;</button>
    </div>
    {/each}
  </section>

  <section
    class="add-dice"
    class:flex-align-right={!options.reverseAddDiceButtons && options.alignAddDiceButtons === 'right' || options.reverseAddDiceButtons && options.alignAddDiceButtons === 'left'}
    class:flex-reverse={options.reverseAddDiceButtons}
  >
    {#each polyhedrals as sides}
    <button on:click={() => addDie(sides)}>
      +d{sides}
    </button>
    {/each}
  </section>

  <section
    class="controls"
    class:flex-align-right={!options.reverseDiceControls && options.alignDiceControls === 'right' || options.reverseDiceControls && options.alignDiceControls === 'left'}
    class:flex-reverse={options.reverseDiceControls}
  >
    <button on:click={rollAllDice}>Roll All</button>
    <button on:click={clearDice}>Clear</button>
    <button on:click={toggleViewOptions} class="options">&#x2699;</button>
  </section>
</article>
{/if}

<style>
  form.options {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    row-gap: 12pt;
  }

  .app {
    height: 100vh;
    min-height: 100vh;
    padding: 0.5rem;
    display: grid;
    grid-template-rows: auto 1fr auto auto;
    row-gap: 1rem;
  }

  button {
    min-width: 44pt;
    min-height: 44pt;
  }
  .die .remove {
    min-width: auto;
  }

  .results {
    display: flex;
    column-gap: 0.5em;
    justify-content: center;
  }

  .dice {
    display: flex;
    flex-wrap: wrap;
    gap: 4pt;
  }

  .flex-align-right {
    justify-content: flex-end;
  }
  .flex-reverse {
    flex-direction: row-reverse;
  }

  .add-dice {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: flex-end; */
    gap: 4pt;
  }

  .controls {
    display: flex;
    /* flex-direction: row-reverse; */
    gap: 4pt;
  }

  .controls .options {
    font-size: 28pt;
  }
</style>