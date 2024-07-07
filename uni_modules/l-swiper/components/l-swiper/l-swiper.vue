<template>
  <view class="l-swiper">
    <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" class="swiper-box" :style="{'--height':height + 'rpx'}"
      :circular="circular" :previous-margin="type == 'card' ? '60rpx' : '0'" :next-margin="type == 'card' ? '60rpx' : '0'" @change="change">
      <swiper-item v-for="(item, index) in banner" :key="index" class="swiper-item">
        <image :src="item" class="swiper-image"
          :class="[value != index ? 'swiper-scsle' : '']" mode="scaleToFill" lazy-load @tap="clickItem(index)"></image>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
  export default {
    options: {
      styleIsolation: 'shared'
    },
    name: 'lSwiper',
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      // 图片数组
      banner: {
        type: Array,
        default: []
      },
      // 轮播图高度
      height:{
        type: Number,
        default: 240
      },
      // 当前轮播图
      value: {
        type: Number,
        default: 0
      },
      // 类型 卡片card 默认normal
      type: {
        type: String,
        default: 'normal'
      },
      // 展示指示器
      indicatorDots: {
        type: Boolean,
        default: true
      },
      // 是否自动切换
      autoplay: {
        type: Boolean,
        default: true
      },
      // 自动切换时间间隔
      interval: {
        type: Number,
        default: 3000
      },
      // 切换滑动动画时长
      duration: {
        type: Number,
        default: 300
      },
      // 是否采用衔接滑动，即播放到末尾后重新回到开头	
      circular: {
        type: Boolean,
        default: true
      },
    },
    methods: {
      change(e) {
        this.$emit('input', e.detail.current)
      },
      clickItem(){
        this.$emit('clickItem', index)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .l-swiper {
    width: 100%;
    padding: 20rpx 0;
    box-sizing: border-box;
    background: #fff;
    
    .swiper-box {
      width: 100%;
      height: var(--height);
      
      .swiper-item {
        padding: 0 16rpx;
        box-sizing: border-box;
      }
      
      .swiper-image {
        width: 100%;
        height: var(--height);
        display: block;
        border-radius: 12rpx;
      }
      
      .swiper-scsle {
        transform: scaleY(0.9);
        transform-origin: center center;
      }
      /* #ifdef MP-WEIXIN */
      /deep/ .wx-swiper-dot {
        width: 8rpx;
        height: 8rpx;
        display: inline-flex;
        background: none;
        justify-content: space-between;
      }
      
      /deep/ .wx-swiper-dot::before {
        content: '';
        flex-grow: 1;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16rpx;
        overflow: hidden;
      }
      
      /deep/.wx-swiper-dot-active::before {
        background: #fff;
      }
      
      /deep/ .wx-swiper-dot.wx-swiper-dot-active {
        width: 16rpx;
      }
      
      /* #endif
      
      /* #ifndef MP-WEIXIN */
      ::v-deep .uni-swiper-dot {
        width: 8rpx;
        height: 8rpx;
        display: inline-flex;
        background: none;
        justify-content: space-between;
      }
      
      ::v-deep .uni-swiper-dot::before {
        content: '';
        flex-grow: 1;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16rpx;
        overflow: hidden;
      }
      
      ::v-deep .uni-swiper-dot-active::before {
        background: #fff;
      }
      
      ::v-deep .uni-swiper-dot.uni-swiper-dot-active {
        width: 16rpx;
      }
      
      /* #endif */
      
    }
  }

  

  

  

 
</style>
