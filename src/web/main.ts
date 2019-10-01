import Vue from 'vue';
import VueRouter from 'vue-router';
import { App } from './app/App';
import { routes } from './routes';

Vue.use(VueRouter);

// tslint:disable-next-line: no-unused-expression
new Vue({
    el: '#app',
    template: '<app></app>',
    components: {
        App
    },
    router: new VueRouter({
        routes
    })
});
