<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { State, TICK_RATE } from '../store';

export default defineComponent({
  setup(_props, _context) {
    const store = useStore<State>();
    const cupsOfTea = computed(() => store.state.cupsOfTea);
    const roundedCupsOfTea = computed(() => Math.round(store.state.cupsOfTea));
    const autobrewerCount = computed(() => store.state.purchasables.autobrewer.count);

    const brewTea = () => store.dispatch('brewTea');

    const autobrewerCost = computed(() => store.state.purchasables.autobrewer.price);
    const buyAutobrewer = (amount: number) => store.dispatch('buyAutobrewer', { amount: amount });
    const multipleAutobrewerCost = computed(() => {
      return (amount: number) => Math.round(autobrewerCost.value * ((1 - Math.pow(store.state.purchasables.autobrewer.increaseRate, amount)) / (1 - store.state.purchasables.autobrewer.increaseRate)));
    });

    const updateGameState = () => {
      if (store.state.debugMode) {
        console.log(`${cupsOfTea.value} cups of tea, ${roundedCupsOfTea.value} rounded cups of tea`);
      }
      store.dispatch('tick');
    };

    const hardResetGame = () => {
      if (confirm('This will permanently erase ALL your progress, nothing will be persisted. Are you absolutely sure you want to reset your game?')) {
        store.commit('hardReset');
      }
    };

    const debugMode = computed(() => store.state.debugMode);
    const toggleDebugMode = () => store.commit('toggleDebugMode');
    const saveGame = () => store.commit('triggerSave');

    // This probably won't scale later. YOLO.
    setInterval(updateGameState, TICK_RATE);

    return {
      cupsOfTea,
      roundedCupsOfTea,
      autobrewerCount,
      autobrewerCost,
      multipleAutobrewerCost,
      brewTea,
      buyAutobrewer,
      hardResetGame,
      debugMode,
      toggleDebugMode,
      saveGame
    };
  },
});
</script>

<template>
  <h1>Tea Shop</h1>

  <p>{{ roundedCupsOfTea }} {{ $filters.pluralize(roundedCupsOfTea, 'Cup') }} of Tea</p>
  <p v-if="autobrewerCount > 0">{{ autobrewerCount }} {{ $filters.pluralize(autobrewerCount, 'Autobrewer') }}</p>

  <div class="buttons">
    <button type="button" @click="brewTea">
      Brew a cup of tea
    </button>
    <button type="button" :disabled="cupsOfTea < autobrewerCost" @click="buyAutobrewer(1)">
      Buy an autobrewer ({{ Math.round(autobrewerCost) }} {{ $filters.pluralize(autobrewerCost, 'cup') }})
    </button>
    <button type="button" :disabled="cupsOfTea < multipleAutobrewerCost(10)" @click="buyAutobrewer(10)">
      Buy 10 autobrewers ({{ multipleAutobrewerCost(10) }} {{ $filters.pluralize(multipleAutobrewerCost(10), 'cup') }})
    </button>
  </div>

  <br/>
  <br/>
  <br/>
  <div>
    <h4>Options</h4>
    <div class="buttons">
      <button type="button" @click="saveGame">
        Save Game
      </button>
      <button type="button" @click="hardResetGame">
        Hard Reset
      </button>
      <button type="button" @click="toggleDebugMode">
        {{ debugMode === true ? 'Disable Debug Mode' : 'Enable Debug Mode' }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.buttons {
  display: flex;
  flex-flow: row wrap;
  margin: auto;
  width: 250px;

  button {
    margin: auto;
    margin-top: 5px;
    display: block;
    width: 250px;
  }
}
</style>
