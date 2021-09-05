import { createStore, Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

type Purchasable = 'autobrewer';

// How often ticks happen, in milliseconds.
export const TICK_RATE = 100;
const TICKS_PER_SECOND = 1000 / TICK_RATE;

export type State = {
  lastSaveAt: number | null;
  tick: number;
  cupsOfTea: number;
  purchasables: {
    [key in Purchasable]: {
      count: number;
      price: number;
      increaseRate: number;
    }
  };
  debugMode: boolean;
};

const BASE_PRICES = {
  autobrewer: 10
};

// The state of the game when the game starts or is manually reset.
const DEFAULT_GAME_STATE = {
  lastSaveAt: null,
  tick: 0,
  cupsOfTea: 0,
  purchasables: {
    autobrewer: {
      count: 0,
      price: BASE_PRICES.autobrewer,
      increaseRate: 1.04
    }
  },
  debugMode: false
};

export const store: Store<State> = createStore({
  plugins: [
    createPersistedState({
      key: 'teaShopSave',
      // Only trigger saving when the triggerSave method is called.
      filter: (mutation) => {
        return mutation.type === 'triggerSave';
      }
    })
  ],
  state() {
    return DEFAULT_GAME_STATE;
  },
  mutations: {
    tick(state) {
      state.tick += 1;
    },
    brewTea(state, amount = 1) {
      state.cupsOfTea += amount;
    },
    consumeTea(state, amount = 1) {
      state.cupsOfTea -= amount;
    },
    buyAutobrewer(state, amount = 1) {
      state.purchasables.autobrewer.count += amount;
    },
    increasePrice(state, payload: { purchasable: Purchasable, amount: number | null }) {
      if (payload.amount === null) {
        payload.amount = 1;
      }
      state.purchasables[payload.purchasable].price *= Math.pow(state.purchasables[payload.purchasable].increaseRate, payload.amount);
    },
    triggerSave(state) {
      state.lastSaveAt = Date.now();
    },
    hardReset(state) {
      localStorage.removeItem('teaShopSave');
      Object.assign(state, DEFAULT_GAME_STATE);
    },
    toggleDebugMode(state) {
      state.debugMode = !state.debugMode;
    }
  },
  actions: {
    tick(context) {
      context.commit('tick');
      context.dispatch('autobrew');

      // Save every 30 seconds.
      if (context.state.tick % (TICKS_PER_SECOND * 30) === 0) {
        context.commit('triggerSave');
      }
    },
    brewTea(context) {
      context.commit('brewTea');
    },
    buyAutobrewer(context, { amount }) {
      let increaseRate = context.state.purchasables.autobrewer.increaseRate;
      let price = context.state.purchasables.autobrewer.price * (1 - Math.pow(increaseRate, amount)) / (1 - increaseRate);
      context.commit('consumeTea', price);
      context.commit('increasePrice', { purchasable: 'autobrewer', amount: amount });
      context.commit('buyAutobrewer', amount);
    },
    // Brew based on the number of autobrewers we have, divided by the number of ticks that occur per second.
    autobrew(context) {
      context.commit('brewTea', context.state.purchasables.autobrewer.count / TICKS_PER_SECOND);
    }
  }
});
