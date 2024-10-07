<template>
    <div class="wrapper">
        <div v-if="!userStore.isAuthenticated">
            <p>Пожалуйста, войдите в систему, чтобы увидеть сообщения.</p>
        </div>
        <div v-else>
            <div v-if="!isLoading">
                <p class="message" v-for="message in messageStore.messages" :key="message.id">
                    <span class="message-id">{{ message.id }}</span>
                    <strong class="message-user">{{ message.user.name }}</strong>
                    <span class="message-text">{{ message.message }}</span>
                    <span class="message-date">{{ formatDate(message.created_at) }}</span>
                </p>
            </div>
            <p v-else>Загрузка...</p> <!-- Индикатор загрузки -->
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useMessageStore } from '../stores/messageStore';
import { useUserStore } from '../stores/userStore'; // Импортируем userStore
import { useRouter } from 'vue-router'; // Импортируем useRouter
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default {
    setup() {
        const messageStore = useMessageStore();
        const userStore = useUserStore(); // Получаем доступ к userStore
        const router = useRouter(); // Получаем доступ к роутеру
        const isLoading = ref(true); // Переменная для отслеживания состояния загрузки

        // Подключаемся к Pusher
        window.Pusher = Pusher;
        const echo = new Echo({
            broadcaster: "pusher",
            key: "5a0c13e00857a82a2bb6",
            cluster: "eu",
            forceTLS: true,
        });

        echo.connector.pusher.connection.bind('connected', () => {
            console.log('Подключение к Pusher успешно!');
        });

        echo.connector.pusher.connection.bind('disconnected', () => {
            console.log('Подключение к Pusher разорвано.');
        });

        echo.connector.pusher.connection.bind('error', (error) => {
            console.error('Ошибка подключения к Pusher:', error);
        });

        echo.channel("Chat")
            .listen(".chat.message", e => {
                console.log(e);
                messageStore.addMessage(e);
            }).listen(".chat.delete", e => {
                messageStore.deleteMessage(e);
                console.log('Сообщение удалено:', e);
            });

        // Загружаем сообщения при монтировании
        onMounted(async () => {
            if (!userStore.isAuthenticated) { // Проверяем, авторизован ли пользователь
                console.log('не авторизован');
                router.push('/login'); // Редирект на страницу логина
            } else {
                await messageStore.loadMessages(); // Загружаем сообщения при монтировании компонента
            }
            isLoading.value = false; // Устанавливаем состояние загрузки в false после загрузки
        });

        // Функция для форматирования даты
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        return {
            formatDate,
            messageStore,
            userStore, // Возвращаем userStore, чтобы использовать его в шаблоне
            isLoading, // Возвращаем переменную состояния загрузки
        };
    },
};
</script>

<style scoped>
.wrapper {
    max-width: 600px;
    /* Ширина контейнера */
    margin: 0 auto;
    /* Центрирование контейнера */
    padding: 20px;
    background-color: #f9f9f9;
    /* Светлый фон */
    border-radius: 8px;
    /* Закругленные углы */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    /* Легкая тень */
}

.message {
    display: flex;
    /* Используем flexbox для выравнивания */
    align-items: center;
    /* Центрируем по вертикали */
    margin: 10px 0;
    /* Отступы между сообщениями */
    padding: 10px;
    /* Отступ внутри сообщения */
    background-color: #fff;
    /* Белый фон для сообщений */
    border-radius: 5px;
    /* Закругленные углы для сообщений */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    /* Легкая тень */
    transition: background-color 0.2s;
    /* Плавный переход фона */
}

.message:hover {
    background-color: #f1f1f1;
    /* Светлый фон при наведении */
}

.message-id {
    color: #888;
    /* Цвет для ID сообщения */
    margin-right: 10px;
    /* Отступ для ID */
}

.message-user {
    font-weight: bold;
    /* Жирный шрифт для имени пользователя */
    color: #333;
    /* Цвет для имени пользователя */
    margin-right: 5px;
    /* Отступ после имени */
}

.message-text {
    color: #555;
    /* Цвет для текста сообщения */
    flex-grow: 1;
    /* Позволяет тексту занимать доступное пространство */
}

.message-date {
    font-size: 0.8em;
    /* Меньший шрифт для даты */
    color: #aaa;
    /* Цвет для даты */
    margin-left: 10px;
    /* Отступ перед датой */
}
</style>
