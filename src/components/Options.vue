<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { State } from '../store';

export default defineComponent({
  name: 'Options',
  setup(_props, _context) {
    const store = useStore<State>();

    const hardResetGame = () => {
      if (confirm('This will permanently erase ALL your progress, nothing will be persisted. Are you absolutely sure you want to reset your game?')) {
        store.commit('hardReset');
      }
    };

    const debugMode = computed(() => store.state.debugMode);
    const toggleDebugMode = () => store.commit('toggleDebugMode');
    const saveGame = () => store.commit('triggerSave');

    return {
      hardResetGame,
      debugMode,
      toggleDebugMode,
      saveGame
    };
  },
});
</script>

<template>
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
