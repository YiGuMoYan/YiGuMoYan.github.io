import Vue from 'vue'
import App from './App.vue'

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import '@/assets/css/theme.css'

Vue.config.productionTip = false

VMdPreview.use(vuepressTheme, {
  Prism,
});

Vue.use(VMdPreview);

new Vue({
  render: h => h(App),
}).$mount('#app')
