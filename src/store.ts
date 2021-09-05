import { createStore, Store } from 'vuex';

export type State = {
  cupsOfTea: number;
  purchases: {
    autobrewers: number
  };
};

export const PRICES = {
  autobrewer: 20
};

export const store: Store<State> = createStore({
  state() {
    return {
      cupsOfTea: 0,
      purchases: {
        autobrewers: 0
      }
    }
  },
  mutations: {
    increment(state, amount = 1) {
      state.cupsOfTea += amount;
    },
    decrement(state, amount = 1) {
      state.cupsOfTea -= amount;
    },
    buyAutobrewer(state) {
      state.purchases.autobrewers++;
    }
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
    buyAutobrewer(context) {
      context.commit('decrement', PRICES.autobrewer);
      context.commit('buyAutobrewer');
    }
  }
});
