<template>
  <div id="app">
    <MessageList />
  </div>
</template>

<script>
// Импорт компонента Chat
import MessageList from './components/messageList.vue';

export default {
  name: 'ChatList',
  components: {
    MessageList, // Регистрируем компонент Chat
  },
};
</script>