// /src/stores/messageStore.js
import { defineStore } from 'pinia';

const API_URL = 'http://127.0.0.1:8000/api/messages';

export const useMessageStore = defineStore('messageStore', {
    state: () => ({
        messages: [],
    }),

    getters: {},

    actions: {
        async loadMessages() {
            try {
                const token = localStorage.getItem('token'); // Получаем токен из localStorage
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                        'Content-Type': 'application/json', // Добавляем заголовок Content-Type
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                this.messages = data.messages; // Используйте .messages, если ваш ответ содержит его
            } catch (error) {
                console.error(error);
            }
        },

        async addMessage(message) {
            try {
                const token = localStorage.getItem('token'); // Получаем токен из localStorage
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                        'Content-Type': 'application/json', // Добавляем заголовок Content-Type
                    },
                    body: JSON.stringify(message), // Преобразуем сообщение в JSON
                });
                if (!response.ok) throw new Error('Failed to add message');
                const data = await response.json();
                this.messages.push(data.message); // Предполагается, что ответ содержит добавленное сообщение
            } catch (error) {
                console.error(error);
            }
        },

        deleteMessage(message) {
            this.messages = this.messages.filter(msg => msg.id !== message.id);
        }
    }
});
