import Vue from 'vue';
import Router from 'vue-router';

import CreatePage from './pages/CreatePage.vue';
import MainPage from './pages/MainPage.vue';
import Marketplace from './pages/Marketplace';
import Collections from './pages/Collections.vue';
import NftPage from './pages/NftPage.vue';
import AlbumPage from './pages/AlbumPage';
import ProfilePage from './pages/ProfilePage';

Vue.use(Router);
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: MainPage,
        },
        {
            path: '/marketplace',
            component: Marketplace,
        },
        {
            path: '/mine/create',
            component: CreatePage,
        },
        {
            path: '/mine/collections',
            component: Collections,
        },
        {
            path: '/nft/:id',
            name: 'nft-detail',
            component: NftPage,
            props: true,
        },
        {
            path: '/album/:id',
            name: 'album-detail',
            component: AlbumPage,
            props: true,
        },
        {
            path: '/profile/:address',
            component: ProfilePage,
        },
    ],
});
