import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/chats-history',
      name: 'chats-history',
      component: require('@/components/LandingPage').default,
    },
    {
      path: '/',
      name: 'dashboard',
      component: require('@/components/DashboardPage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
