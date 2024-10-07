<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" required />
            </div>
            <button type="submit">Login</button>
            <p v-if="error">{{ error }}</p>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const email = ref('');
        const password = ref('');
        const error = ref('');
        const userStore = useUserStore();
        const router = useRouter();

        const handleLogin = async () => {
            try {
                await userStore.login({ email: email.value, password: password.value });
                router.push('/dashboard'); // Редирект на страницу после успешного входа
            } catch (err) {
                error.value = err.message; // Обработка ошибок
            }
        };

        return {
            email,
            password,
            error,
            handleLogin,
        };
    },
};
</script>
