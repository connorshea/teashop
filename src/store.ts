import { createStore, Store } from 'vuex';

type Purchasable = 'autobrewer';

export type State = {
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
  state() {
    return {
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
    }
  },
  actions: {
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
