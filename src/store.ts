import { createStore, Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

type Purchasable = 'autobrewer';

export type State = {
  lastSaveAt: number;
  tick: number;
  cupsOfTea: number;
  purchasables: {
    [key in Purchasable]: {
      count: number;
      price: number;
      increaseRate: number;
    }
  };
};

const BASE_PRICES = {
  autobrewer: 10
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
    return {
      lastSaveAt: Date.now(),
      tick: 0,
      cupsOfTea: 0,
      purchasables: {
        autobrewer: {
          count: 0,
          price: BASE_PRICES.autobrewer,
          increaseRate: 0.04
        }
      }
    }
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
    buyAutobrewer(state) {
      state.purchasables.autobrewer.count++;
    },
    increasePrice(state, purchasable: Purchasable) {
      state.purchasables[purchasable].price = Math.ceil(state.purchasables[purchasable].price * (1.0 + state.purchasables[purchasable].increaseRate));
    },
    triggerSave(state) {
      state.lastSaveAt = Date.now();
    }
  },
  actions: {
    tick(context) {
      context.commit('tick');
      // TODO: Make the tick rate less than a second and modify/call autobrew accordingly.
      context.dispatch('autobrew');

      // Save every 30 seconds.
      if (context.state.tick % 30 === 0) {
        context.commit('triggerSave');
      }
    },
    brewTea(context) {
      context.commit('brewTea');
    },
    buyAutobrewer(context) {
      context.commit('consumeTea', context.state.purchasables.autobrewer.price);
      context.commit('increasePrice', 'autobrewer');
      context.commit('buyAutobrewer');
    },
    autobrew(context) {
      context.commit('brewTea', context.state.purchasables.autobrewer.count);
    }
  }
});
