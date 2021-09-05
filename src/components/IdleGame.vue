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
    const buyAutobrewer = () => store.dispatch('buyAutobrewer');

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

    // This probably won't scale later. YOLO.
    setInterval(updateGameState, TICK_RATE);

    return {
      cupsOfTea,
      roundedCupsOfTea,
      autobrewerCount,
      autobrewerCost,
      brewTea,
      buyAutobrewer,
      hardResetGame,
      debugMode,
      toggleDebugMode
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
    <button type="button" :disabled="cupsOfTea < autobrewerCost" @click="buyAutobrewer">
      Buy an autobrewer ({{ autobrewerCost }} {{ $filters.pluralize(autobrewerCost, 'cup') }})
    </button>
  </div>

  <br/>
  <br/>
  <br/>
  <div>
    <h4>Options</h4>
    <div class="buttons">
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
