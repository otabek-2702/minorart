/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Vue3Toastify, { ToastContainerOptions } from 'vue3-toastify'
import "vue3-toastify/dist/index.css";
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)

// Toastify
app.use(Vue3Toastify, {
    autoClose: 1200,
    theme: "auto",

} as ToastContainerOptions);
// Mount vue app
app.mount('#app')
