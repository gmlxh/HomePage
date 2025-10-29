import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../components/Home.vue';

const routes = [
    {path: '/', name: 'Home', component: Home},
    {
        path: '/rname', name: 'Rname',
        beforeEnter: (to, from, next) => {
            window.location.href = '/rname.html';
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;