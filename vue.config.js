const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '127.0.0.1', // Указываем хост
    port: 8000, // Укажите порт, на котором работает ваш сервер\
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Порт вашего Laravel приложения
        changeOrigin: true,
      },
    },
  },
})
