import { createApp } from 'vue';
import { store } from './store'
import { pluralize } from './pluralize'
import App from './App.vue';

const app = createApp(App);
app.use(store);

// Apply pluralize as a global filter.
app.config.globalProperties.$filters = {};
app.config.globalProperties.$filters.pluralize = pluralize;

app.mount('#app');
