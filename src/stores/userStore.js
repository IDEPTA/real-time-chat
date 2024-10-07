import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null, // Состояние для хранения данных пользователя
        isAuthenticated: false, // Состояние для отслеживания аутентификации
        token: null, // Хранение токена Sanctum
    }),
    actions: {
        async login(credentials) {
            // Замените URL на ваш API для аутентификации
            const response = await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie');
            if (!response.ok) {
                throw new Error('Failed to get CSRF cookie');
            }

            const loginResponse = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include', // Включите куки
            });

            if (loginResponse.ok) {
                const data = await loginResponse.json();
                this.user = data.user; // Сохраните данные пользователя
                this.token = data.token; // Сохраните токен Sanctum
                this.isAuthenticated = true; // Установите флаг аутентификации
                localStorage.setItem('token', data.token); // Сохраните токен в localStorage
            } else {
                throw new Error('Login failed');
            }
        },
        logout() {
            // Выполните запрос на выход
            fetch('http://127.0.0.1:8000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`, // Используйте токен при выходе
                },
            });
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            localStorage.removeItem('token'); // Удалите токен при выходе
        },
        checkAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                this.isAuthenticated = true;
                this.token = token; // Установите токен из localStorage
            }
        }
    }
});
