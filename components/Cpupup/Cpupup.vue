<template>
  <view class="container">
    <view class="upper-section">
      <view class="left-section">
        <BookList
          :imgurl="spopupbook.imgurl"
          :title="spopupbook.bookname"
          :isClick="true"
          :info="getInfo(spopupbook)"
          :info1="getInfo1(spopupbook)"
          :bookSourceName="spopupbook.bookSourceName"
          :tags="spopupbook.tags"
        >
        </BookList>
      </view>
      <view class="right-section-wrapper">
        <u-button
          text="详情"
          type="error"
          shape="circle"
          size="normal"
          plain
          @click="goBookHome()"
        ></u-button>
      </view>
    </view>
    <view class="lower-section">
      <view class="button-wrapper" @click="handleDelete">
        <u-icon name="trash" size="36px"></u-icon>
        <u--text text="删除本书" color="#303030" size="10"></u--text>
      </view>
      <view class="button-wrapper" @click="handleClearCache">
        <u-icon name="backspace" size="36px"></u-icon>
        <u--text text="清除缓存" color="#303030" size="10"></u--text>
      </view>
      <view class="button-wrapper" @click="handleDownload">
        <u-icon name="download" size="36px"></u-icon>
        <u--text text="下载本书" color="#303030" size="10"></u--text>
      </view>
      <view class="button-wrapper" @click="handleShare">
        <u-icon name="list" size="34px"></u-icon>
        <u--text text="打开目录" color="#303030" size="10"></u--text>
      </view>
    </view>
    <view class="lower-section">
      <view class="button-wrapper" @click="handleTxt">
        <u-icon name="file-text" size="36px"></u-icon>
        <u--text text="导出本书" color="#303030" size="10"></u--text>
      </view>
      <view class="button-wrapper">
        <!-- 	<u-icon name="file-text" size="36px"></u-icon>
				<u--text text="导出本书" color="#303030" size="10"></u--text> -->
      </view>
      <view class="button-wrapper">
        <!-- 	<u-icon name="file-text" size="36px"></u-icon>
				<u--text text="导出本书" color="#303030" size="10"></u--text> -->
      </view>
      <view class="button-wrapper">
        <!-- 	<u-icon name="file-text" size="36px"></u-icon>
				<u--text text="导出本书" color="#303030" size="10"></u--text> -->
      </view>
    </view>
  </view>
</template>

<script>
import store from "@/store/index.js";

export default {
  name: "Cpupup",
  props: ["spopupbook"],
  data() {
    return {};
  },
  methods: {
    getInfo(item) {
      const readIndex = item.readIndex + 1;
      const readAll = item.readAll;
      const readPercent = (readIndex * 100) / readAll;

      return `作者：${item.author}`;
    },
    getInfo1(item) {
      const readIndex = item.readIndex + 1;
      const readAll = item.readAll;
      const readPercent = (readIndex * 100) / readAll;

      return `读到 ${readIndex} 章 共 ${readAll} 章 ${readPercent.toFixed(2)}%`;
    },
    //点击详情跳转到主页
    goBookHome() {
      // // 同时传递书籍五个参数
      // uni.navigateTo({
      // 	url: `/pages/bookHomepage/bookHomepage?author=${this.spopupbook.author}&bookname=${this.spopupbook.bookname}
      // 	&bookurl=${this.spopupbook.bookurl}&imgurl=${this.spopupbook.imgurl}&origin=${this.spopupbook.origin}`
      // })
      // encodeURIComponent 对字符串中的某些特殊字符进行转义，以便可以安全地包含在 URL 中 这样可以传递大对象
      // 使用decodeURIComponent转码
      const e = encodeURIComponent(JSON.stringify(this.spopupbook));
      uni.navigateTo({
        url: `/pages/bookHomepage/bookHomepage?book=${e}`,
      });
    },
    handleDelete() {
      this.$emit("delete");
      // 触发删除事件
    },
    handleClearCache() {
      this.$emit("clearCache");
      // 触发清除缓存事件
    },
    handleDownload() {
      this.$emit("download");
      // 触发下载事件
    },
    handleShare() {
      this.$emit("share");
      // 触发打开目录
    },
    handleTxt() {
      this.$emit("txt");
      // 触发导出本书
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(250rpx + 150px);
  display: flex;
  flex-direction: column;
}

.upper-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lower-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  /* 调整上下部分的间距 */
  padding-left: 50rpx;
  // padding-right: 50rpx;
}

.left-section {
  flex: 8;
  /* 左侧占 80% */
}

.right-section-wrapper {
  flex: 2;
  /* 右侧占 20% */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
}

.button-wrapper {
  flex: 1;
  margin: 0 10rpx;
  /* 调整按钮之间的间距 */
}
</style>
