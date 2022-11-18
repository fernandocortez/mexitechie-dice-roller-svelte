<script lang="ts">
  import { produce } from 'immer';
  import { Die } from './lib/Die';
  import { getDiceResults, getDieRoll } from './lib/generators';
  
  const polyhedrals: ReadonlyArray<number> = [4, 6, 8, 10, 12, 20, 100];
  let dice: Die[] = [];
  $: results = dice.map(die => die.result);

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
</script>

<article class="results">
  Total: {results.reduce((result, acc) => result + acc, 0)}
  &nbsp;|&nbsp;
  Max:&nbsp;
  {#if results.length === 0}
  0
  {:else}
  {Math.max(...results)}
  {/if}
  &nbsp;|&nbsp;
  Min:&nbsp;
  {#if results.length === 0}
  0
  {:else}
  {Math.min(...results)}
  {/if}
</article>

<article class="dice">
  {#each dice as die, i}
  <section class="die">
    <button on:click={() => rollDie(i)}>
      {die.result} (d{die.sides})
    </button>
    <button class="remove" on:click={() => removeDie(i)}>&times;</button>
  </section>
  {/each}
</article>

<article class="add-dice">
  {#each polyhedrals as sides}
  <button on:click={() => addDie(sides)}>
    +d{sides}
  </button>
  {/each}
</article>

<article class="controls">
  <button on:click={rollAllDice}>Roll All</button>
  <button on:click={clearDice}>Clear</button>
</article>

<style>
  button {
    min-width: 44pt;
    min-height: 44pt;
  }
  .die .remove {
    min-width: auto;
  }

  .results {
    text-align: center;
  }

  .dice {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4pt;
  }

  .add-dice {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4pt;
  }

  .controls {
    display: flex;
    flex-direction: row-reverse;
    gap: 4pt;
  }
</style>