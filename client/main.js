import Vue from 'vue';
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index';
import store from './store/index';
import App from './app.vue';
import './style.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

Vue.use(Element, { size: 'small' })

window.app = new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => {
        return h(App)
    }
});