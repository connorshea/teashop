import { createStore, Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { cloneDeep } from 'lodash';

// TODO: Figure out how to import this from a TypeScript file not in the
//       public directory.
const worker = new Worker('./worker.js');

type Purchasable = 'autobrewer';
type Upgradable = 'autobrewer';

// How often ticks happen, in milliseconds.
export const TICK_RATE = 200;
export const TICKS_PER_SECOND = 1000 / TICK_RATE;

export type State = {
  lastSaveAt: number | null;
  lastNotableTickAt: number | null;
  tick: number;
  cupsOfTea: number;
  teaPerTick: number;
  purchases: {
    [key in Purchasable]: {
      count: number;
      price: number;
      increaseRate: number;
    }
  };
  upgrades: {
    [key in Upgradable]: {
      level: number;
      currentOutputMultiplier: number;
      outputMultiplier: number;
      costMultiplier: number;
      nextUpgradeCost: number;
    }
  };
  debugMode: boolean;
};

const BASE_VALUES = {
  purchases: {
    autobrewer: {
      price: 10,
      increaseRate: 1.01
    }
  },
  upgrades: {
    autobrewer: {
      outputMultiplier: 2.0,
      costMultiplier: 5,
      nextUpgradeCost: 100
    }
  }
};

// The state of the game when the game starts or is manually reset.
const getDefaultGameState = () => {
  return {
    lastSaveAt: null,
    lastNotableTickAt: null,
    tick: 0,
    cupsOfTea: 0,
    teaPerTick: 0,
    purchases: {
      autobrewer: {
        count: 0,
        price: BASE_VALUES.purchases.autobrewer.price,
        increaseRate: BASE_VALUES.purchases.autobrewer.increaseRate
      }
    },
    upgrades: {
      autobrewer: {
        level: 0,
        currentOutputMultiplier: 1.0,
        outputMultiplier: BASE_VALUES.upgrades.autobrewer.outputMultiplier,
        costMultiplier: BASE_VALUES.upgrades.autobrewer.costMultiplier,
        nextUpgradeCost: BASE_VALUES.upgrades.autobrewer.nextUpgradeCost
      }
    },
    debugMode: false
  };
};

export const store: Store<State> = createStore({
  // TODO: Enable strict mode
  // strict: process.env.NODE_ENV !== 'production',
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
    return getDefaultGameState();
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
      state.purchases.autobrewer.count += amount;
    },
    increasePrice(state, payload: { purchasable: Purchasable, amount: number | null }) {
      if (payload.amount === null) {
        payload.amount = 1;
      }
      state.purchases[payload.purchasable].price *= Math.pow(state.purchases[payload.purchasable].increaseRate, payload.amount);
    },
    setLastNotableTickAt(state, payload: { datetime: number }) {
      state.lastNotableTickAt = payload.datetime;
    },
    upgradeUpgradable(state, payload: { upgradable: Upgradable }) {
      state.upgrades[payload.upgradable].level += 1;
      state.upgrades[payload.upgradable].currentOutputMultiplier *= state.upgrades[payload.upgradable].outputMultiplier;
      state.upgrades[payload.upgradable].nextUpgradeCost *= state.upgrades[payload.upgradable].costMultiplier;
    },
    // This mutation automatically triggers the persisted state plugin to activate.
    triggerSave(state) {
      state.lastSaveAt = Date.now();
    },
    hardReset(_state) {
      if (localStorage.getItem('teaShopSave') !== null) {
        localStorage.removeItem('teaShopSave');
      }
      store.replaceState(getDefaultGameState());
    },
    toggleDebugMode(state) {
      state.debugMode = !state.debugMode;
    },
    recalculateTeaPerTick(state) {
      state.teaPerTick = (state.purchases.autobrewer.count * state.upgrades.autobrewer.currentOutputMultiplier) / TICKS_PER_SECOND;
    }
  },
  actions: {
    async tick(context) {
      worker.postMessage({ name: 'tick', state: cloneDeep(context.state) });
    },
    brewTea(context) {
      context.commit('brewTea');
    },
    upgradeUpgradable(context, { upgradable }: { upgradable: Upgradable }) {
      context.commit('consumeTea', context.state.upgrades[upgradable].nextUpgradeCost);
      context.commit('upgradeUpgradable', { upgradable: upgradable });
      context.commit('recalculateTeaPerTick');
    },
    buyAutobrewer(context, { amount }) {
      let increaseRate = context.state.purchases.autobrewer.increaseRate;
      let price = context.state.purchases.autobrewer.price * (1 - Math.pow(increaseRate, amount)) / (1 - increaseRate);
      context.commit('consumeTea', price);
      context.commit('increasePrice', { purchasable: 'autobrewer', amount: amount });
      context.commit('buyAutobrewer', amount);
      context.commit('recalculateTeaPerTick');
    },
    // Brew based on the number of autobrewers we have, divided by the number of ticks that occur per second.
    autobrew(context) {
      context.commit('brewTea', context.state.teaPerTick);
    }
  }
});

// Handle incoming messages from the worker as mutations and actions.
worker.onmessage = (e) => {
  if (e.data.type === 'mutation') {
    e.data.payload === null ? store.commit(e.data.method) : store.commit(e.data.method, e.data.payload);
  } else if (e.data.type === 'action') {
    e.data.payload === null ? store.dispatch(e.data.method) : store.dispatch(e.data.method, e.data.payload);
  }
};
