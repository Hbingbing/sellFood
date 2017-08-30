<template>
  <div id="app">
    <v-header :seller="seller"></v-header>

    <div class="tab border">
      <router-link to="/goods" class="tab-item">商品</router-link>
      <router-link to="/ratings" class="tab-item">评论</router-link>
      <router-link to="/seller" class="tab-item">商家</router-link>
    </div>

    <router-view :seller="seller"></router-view>

  </div>
</template>

<script>
import header from './components/header/header.vue'
const ERR_OK = 0
export default {
  data () {
    return {
      seller: {}
    }
  },
  created () {
    this.$http.get('/api/seller').then(response => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.seller = response.data
      }
    }, response => {
      alert('error')
    })
  },
  name: 'app',
  components: {
    'v-header': header
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/mixin.styl"
.tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
