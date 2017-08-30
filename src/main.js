// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Goods from './components/goods/goods'
import Seller from './components/seller/seller'
import Ratings from './components/ratings/ratings'
import './common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [{
  path: '/',
  component: Goods
}, {
  path: '/goods',
  component: Goods
}, {
  path: '/seller',
  component: Seller
}, {
  path: '/ratings',
  component: Ratings
}]

const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
  linkActiveClass: 'active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  ...App
})
