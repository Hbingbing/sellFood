<template>
<transition name="move">
	<div v-show="showFlag" class="food" ref="food">
   <div class="food-content">

     <!-- 详情顶部-图片 -->
     <div class="image-header">
       <img :src="food.image">
       <div class="back">
        <i class="icon-arrow_lift" @click="hide"></i>
       </div>
     </div>

     <!-- 详情-商品名称 -->
     <div class="content">
       <h1 class="title">{{food.name}}</h1>
       <div class="detail">
         <span class="sell-count">月售{{food.sellCount}}份</span>
         <span class="rating">好评率{{food.rating}}%</span>
       </div>
       <div class="price">
         <span class="now">¥{{food.price}}</span>
         <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
         <!-- 加减组件 -->
         <div class="cartcontrol-wrapper">
           <cartcontrol :food="food"></cartcontrol>
         </div>
       </div>
       <!-- 加入购物车 按钮 -->
       <transition name="fade">
        <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst($event)">加入购物车</div>
       </transition>
     </div>
     <split v-show="food.info"></split>

     <!-- 详情-商品介绍 -->
     <div class="info" v-show="food.info">
       <h1 class="title">商品信息</h1>
       <div class="text">{{food.info}}</div>
     </div>
     <split></split>

     <!-- 详情-商品评价 -->
     <div class="rating">
       <h1 class="title">商品评价</h1>
       <!-- 选择评价类型：全部、推荐、吐槽 -->
      <!--  <ratingselect :dec="dec" :select-type="selectType" :only-content="onlyContent" :ratings="food.ratings"></ratingselect> -->
      <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent"
                    :ratings="food.ratings" :dec="dec"></ratingselect>
       <!-- 商品评价详情内容 -->
       <div class="rating-wrapper">
         <ul v-show="food.ratings && food.ratings.length">
           <li v-for="rating in food.ratings" class="rating-item border-1px" v-show="needShow(rating.rateType, rating.text)">
             <div class="user">
               <span class="name">{{rating.username}}</span>
               <img :src="rating.avatar" class="avatar" width="12" height="12">
             </div>
             <div class="time">{{rating.rateTime | formatDate}}</div>
             <p class="text">
               <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}">{{rating.text}}</span>
             </p>
           </li>
         </ul>
         <!-- 暂无评价 -->
         <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
           暂无评价
         </div>
       </div>
     </div>

   </div> 
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import Vue from 'vue'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import {formatDate} from '../../common/js/date'
const ALL = 2
export default {
  data () {
    return {
      showFlag: false,
      dec: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      },
      selectType: ALL,
      onlyContent: false
    }
  },
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = false
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    // 返回 按钮
    hide () {
      this.showFlag = false
    },
    // 点击“加入购物车”
    addFirst (event) {
      if (!event._constructed) {
        return
      }
      this.$emit('car.add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    // 根据选择筛选相应的评价
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    // 父组件监听子组件，获取子组件的参数
    selectRating (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent () {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  // 注册组件
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  // 时间过滤器
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 30
  width: 100%
  background: #fff
  transform: translate3d(0, 0, 0)
  &.move-enter-active,&.move-leave-active
    transition: all 0.2s linear
  &.move-enter, &.move-leave-active
    transform: translate3d(100%, 0, 0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #fff
.food
  .content
    position: relative
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: rgb(7, 17, 27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      height: 10px
      font-size: 0
      .sell-count, .rating
        font-size: 10px
        color: rgb(147, 153, 159)
      .sell-count
        margin-right: 12px
    .price
      font-weight: 700
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 9px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      color: #fff
      background: rgb(0, 160, 220)
      opacity: 1
      &.fade-enter-active,&.fade-leave-active
        transition: all 0.2s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        z-index: -1
  .info
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7, 17, 27)
    .text
      line-height: 24px
      padding: 0 8px
      font-size: 12px
      color: rgb(77, 85, 93)
  .rating
    padding-top: 18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(7, 17, 27)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)

      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)
</style>