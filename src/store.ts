import { createStore, Store } from 'vuex';

export type State = {
  currency: number;
};

export const store: Store<State> = createStore({
  state() {
    return {
      currency: 0
    }
  },
  mutations: {
    increment(state) {
      state.currency++;
    }
  },
  actions: {
    increment(context) {
      context.commit('increment');
    }
  }
});
