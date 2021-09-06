// Based partially off this blog post: https://logaretm.com/blog/2019-12-21-vuex-off-mainthread

const TICK_RATE = 200;
const TICKS_PER_SECOND = 1000 / TICK_RATE;

self.onmessage = (e) => {
  const state = e.data.state;
  if (e.data.name === 'tick') {
    self.postMessage({ type: 'mutation', method: 'tick', payload: undefined });
    self.postMessage({ type: 'action', method: 'autobrew', payload: undefined });
    if (state.tick % TICKS_PER_SECOND === 0) {
      let now = Date.now();
      if (state.debugMode && state.lastNotableTickAt !== null) {
        console.log(`${now - state.lastNotableTickAt}ms since last notable tick.`);
        console.log(`${state.cupsOfTea} cups of tea`);
      }
      self.postMessage({ type: 'mutation', method: 'setLastNotableTickAt', payload: { datetime: now } });
    }

    // Autosave every 30 seconds.
    if (e.data.state.tick % (TICKS_PER_SECOND * 30) === 0) {
      self.postMessage({ type: 'mutation', method: 'triggerSave', payload: undefined });
    }
  }
};
