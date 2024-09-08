<template>
  <!-- 章节组件 -->
  <view class="content">
    {{ chapter.chaptername }}
  </view>
</template>

<script>
export default {
  name: 'Chapter',
  props: ['book', 'chapter'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 25rpx;
  display: flex;
  align-items: center;
  // justify-content: center;
}
</style>
