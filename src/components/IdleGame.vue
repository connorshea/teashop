<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { State } from '../store';

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: true
    },
  },
  setup(_props, _context) {
    const store = useStore<State>();
    const currency = computed(() => store.state.currency);
    const increment = () => store.dispatch('increment');

    return {
      currency,
      increment
    };
  },
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>{{ currency }} {{ $filters.pluralize(currency, 'Foo') }}</p>

  <button type="button" @click="increment">Create Foo</button>
</template>

<style scoped>
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
</style>
