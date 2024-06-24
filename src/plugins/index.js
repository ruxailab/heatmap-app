/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'
import { createPinia } from 'pinia'
import i18n from './i18n'

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(router)
    .use(i18n)
    .use(createPinia())
}
