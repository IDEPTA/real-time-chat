import LoginForm from '@/components/loginForm.vue';
import MessageList from '@/components/messageList.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'manePage',
        component: MessageList,
    },
    {
        path: '/login',
        name: 'loginForm',
        component: LoginForm,
    },
];

// Создаем маршрутизатор
const router = createRouter({
    history: createWebHistory(),
    routes,
});



export default router;
