// Based partially off this blog post: https://logaretm.com/blog/2019-12-21-vuex-off-mainthread

self.onmessage = (e) => {
  if (e.data.name === 'tick') {
    const state = e.data.state;

    self.postMessage({ type: 'mutation', method: 'tick', payload: undefined });
    self.postMessage({ type: 'action', method: 'autobrew', payload: undefined });
    if (state.tick % e.data.ticks_per_second === 0) {
      let now = Date.now();
      if (state.debugMode && state.lastNotableTickAt !== null) {
        console.log(`${now - state.lastNotableTickAt}ms since last notable tick.`);
        console.log(`${state.cupsOfTea} cups of tea`);
      }
      self.postMessage({ type: 'mutation', method: 'setLastNotableTickAt', payload: { datetime: now } });
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
