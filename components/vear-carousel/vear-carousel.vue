<template>
  <swiper
    class="image-container"
    previous-margin="45rpx"
    next-margin="45rpx"
    circular
    autoplay
    @change="swiperChange"
  >
    <swiper-item
      :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'"
      v-for="(item, index) in imgList"
      :key="item[urlKey]"
    >
      <image
        @click="clickImg(item)"
        :class="currentIndex == index ? 'item-img' : 'item-img-side'"
        :src="item[urlKey]"
        lazy-load
        :style="dontFirstAnimation ? 'animation: none;' : ''"
        mode="aspectFill"
      ></image>
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  props: {
    imgList: {
      type: Array,
      default() {
        return []
      }
    },
    urlKey: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
      dontFirstAnimation: true,
      isFirstImg: true
    }
  },
  methods: {
    swiperChange(e) {
      this.dontFirstAnimation = false
      this.currentIndex = e.detail.current
      this.isFirstImg = this.currentIndex === 0
    },
    clickImg(item) {
      this.$emit('selected', item, this.currentIndex)
      this.isFirstImg = this.currentIndex === 0
    }
  }
}
</script>

<style scoped>
.image-container {
  width: 750rpx;
  /* height: 350rpx; */
}

.item-img {
  width: 650rpx;
  height: 300rpx;
  border-radius: 20rpx;
  animation: to-big 0.3s;
}

.swiper-item {
  width: 650rpx;
  height: 300rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-img-side {
  width: 630rpx;
  height: 260rpx;
  border-radius: 20rpx;
  animation: to-mini 0.3s;
}

.swiper-item-side {
  width: 630rpx;
  height: 260rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes to-mini {
  from {
    height: 300rpx;
  }
  to {
    height: 260rpx;
  }
}

@keyframes to-big {
  from {
    height: 260rpx;
  }
  to {
    height: 300rpx;
  }
}
</style>
