<template>
  <view class="zoo">
    <view
      class="item-container"
      @click="goBookClass(item)"
      v-for="(item, index) in classifys"
      :key="index"
    >
      <view class="pic">
        <image :src="svg[index]" class="svg"></image>
      </view>
      <view class="title">{{ item.title }}</view>
    </view>
  </view>
</template>

<script>
import classify from "@/api/getNetwork/classify.json";
export default {
  name: "BookClassify",
  data() {
    return {
      classifys: [],
      svg: [
        "/static/images/books/n-ph.svg",
        "/static/images/books/n-fl.svg",
        "/static/images/books/n-wj.svg",
        "/static/images/books/n-lz.svg",
        "/static/images/books/v-ph.svg",
        "/static/images/books/v-fl.svg",
        "/static/images/books/v-wj.svg",
        "/static/images/books/v-lz.svg",
      ],
    };
  },
  mounted() {
    this.classifys = classify;
  },
  methods: {
    goBookClass(item) {
      // encodeURIComponent 对字符串中的某些特殊字符进行转义，以便可以安全地包含在 URL 中 这样可以传递大对象
      // 使用decodeURIComponent转码
      const e = encodeURIComponent(JSON.stringify(item));
      uni.navigateTo({
        url: `/pages/bookClass/bookClass?book=${e}`,
      });
    },
  },
};
</script>

<style>
.zoo {
  margin: 8px;
  padding: 8px 16px;
  background-color: #fff;
  border-radius: 8px;
  display: grid;
  /* 使用 grid 布局来创建宫格 */
  grid-template-columns: repeat(4, 1fr);
  /* 使用 repeat 函数来创建动态列数，最大宽度自适应剩余空间 */
  grid-gap: 8px;
  /* 设置宫格之间的间隙 */
}

.item-container {
  padding: 8px;
  /* 内边距 */
  box-sizing: border-box;
  /* 防止内边距增加实际大小 */
  height: 64px;
  overflow: hidden;
}

.pic {
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg {
  width: 32px;
  height: 32px;
}

.title {
  font-size: 14px;
  text-align: center;
  margin-top: 4px;
}
</style>
