<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { PRICES, State } from '../store';

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: true
    },
  },
  setup(_props, _context) {
    const store = useStore<State>();
    const cupsOfTea = computed(() => store.state.cupsOfTea);
    const autobrewerCount = computed(() => store.state.purchases.autobrewers);
    const increment = () => store.dispatch('increment');

    const autobrewerCost = PRICES.autobrewer;
    const buyAutobrewer = () => store.dispatch('buyAutobrewer');

    return {
      cupsOfTea,
      autobrewerCount,
      autobrewerCost,
      increment,
      buyAutobrewer
    };
  },
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>{{ cupsOfTea }} {{ $filters.pluralize(cupsOfTea, 'Cup') }} of Tea</p>
  <p v-if="autobrewerCount > 0">{{ autobrewerCount }} {{ $filters.pluralize(autobrewerCount, 'Autobrewer') }}</p>

  <div class="buttons">
    <button type="button" @click="increment">Brew a cup of tea</button>
    <button type="button" :disabled="cupsOfTea < autobrewerCost" @click="buyAutobrewer">Buy an autobrewer</button>
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
  width: 200px;

  button {
    margin: auto;
    margin-top: 5px;
    display: block;
    width: 175px;
  }
}
</style>
