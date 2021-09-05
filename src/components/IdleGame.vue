<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { State } from '../store';

export default defineComponent({
  setup(_props, _context) {
    const store = useStore<State>();
    const cupsOfTea = computed(() => store.state.cupsOfTea);
    const autobrewerCount = computed(() => store.state.purchasables.autobrewer.count);
    const brewTea = () => store.dispatch('brewTea');

    const autobrewerCost = computed(() => store.state.purchasables.autobrewer.price);
    const buyAutobrewer = () => store.dispatch('buyAutobrewer');

    const updateGameState = () => {
      store.dispatch('tick');
    };

    // This probably won't scale later. YOLO.
    // TODO: Make this a shorter interval and modify logic in update game state to compensate.
    setInterval(updateGameState, 1000);

    return {
      cupsOfTea,
      autobrewerCount,
      autobrewerCost,
      brewTea,
      buyAutobrewer
    };
  },
});
</script>

<template>
  <h1>Tea Shop</h1>

  <p>{{ cupsOfTea }} {{ $filters.pluralize(cupsOfTea, 'Cup') }} of Tea</p>
  <p v-if="autobrewerCount > 0">{{ autobrewerCount }} {{ $filters.pluralize(autobrewerCount, 'Autobrewer') }}</p>

  <div class="buttons">
    <button type="button" @click="brewTea">
      Brew a cup of tea
    </button>
    <button type="button" :disabled="cupsOfTea < autobrewerCost" @click="buyAutobrewer">
      Buy an autobrewer ({{ autobrewerCost }} {{ $filters.pluralize(autobrewerCost, 'cup') }})
    </button>
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
