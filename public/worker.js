// Based partially off this blog post: https://logaretm.com/blog/2019-12-21-vuex-off-mainthread

self.onmessage = (e) => {
  if (e.data.name === 'tick') {
    const state = e.data.state;
    const isNotableTick = state.tick % e.data.ticks_per_second === 0;

    if (isNotableTick) {
      let now = Date.now();
      if (state.debugMode && state.lastNotableTickAt !== null) {
        console.log(`${now - state.lastNotableTickAt}ms since last notable tick.`);
        console.log(`${state.cupsOfTea} cups of tea`);
      }
      self.postMessage({ type: 'mutation', method: 'setLastNotableTickAt', payload: { datetime: now } });
    }

    self.postMessage({ type: 'mutation', method: 'tick', payload: undefined });
    self.postMessage({ type: 'action', method: 'autobrew', payload: undefined });

    if (isNotableTick) {
      let teaSoldThisTick = ((state.rawDemand / 100) * Math.pow((0.8 / state.teaPrice), 1.15));
      // Cap the amount sold to the amount of tea we have right now, to prevent selling more than we have.
      if (teaSoldThisTick > state.cupsOfTea) {
        if (state.debugMode) {
          console.log(`${teaSoldThisTick} demanded, more than available`);
        }
        teaSoldThisTick = state.cupsOfTea;
      }
      // Calculate tea sold this tick and then sell it
      self.postMessage({ type: 'action', method: 'sellTea', payload: { amount: teaSoldThisTick } });
    }

    // Autosave every 30 seconds.
    if (e.data.state.tick % (e.data.ticks_per_second * 30) === 0) {
      self.postMessage({ type: 'mutation', method: 'triggerSave', payload: undefined });
    }
  } else if (e.data.name === 'startup') {
    const postTickMessage = () => {
      self.postMessage({ type: 'action', method: 'tick', payload: undefined });
    }
    setInterval(postTickMessage, e.data.tick_rate);
  }
};
