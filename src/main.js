import { createApp } from 'vue';
import App from './App.vue';
import './style.less';
import { MotionPlugin } from '@vueuse/motion';
import router from './router';

const app = createApp(App);

app.use(MotionPlugin);
app.use(router);
app.mount('#app');