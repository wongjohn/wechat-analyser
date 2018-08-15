import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/chats-history',
      name: 'chats-history',
      component: require('@/components/LandingPage').default,
      children: [
        {
          path: '/',
          component: require('@/components/ChatsPage').default,
        },
        {
          path: 'contacts',
          component: require('@/components/ContactsPage').default,
        },
        {
          path: 'bugs',
          component: require('@/components/BugsPage').default,
        },
      ],
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
