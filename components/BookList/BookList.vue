<template>
  <!-- 书籍列表组件 -->
  <view class="content">
    <view class="newbook">
      <view class="pic">
        <image :src="imgurl" @click="toShow"></image>
      </view>
      <view class="text">
        <view class="title">
          <view class="titleC">{{ title }}</view>
          <u-badge
            class="badge"
            :isDot="true"
            v-if="isUpdated"
            type="error"
          ></u-badge>
        </view>
        <text class="info" decode space="true">{{ info }}</text>
        <text class="info" decode space="true">{{ info1 }}</text>
        <view style="font-size: 24rpx; margin-top: 4rpx">
          <span v-if="bookSourceName" class="origin-color">{{
            bookSourceName
          }}</span>
          <span v-for="tag in tags" class="origin-color">{{ tag }}</span>
        </view>
      </view>
    </view>
    <view> </view>
  </view>
</template>

<script>
export default {
  name: "BookList",
  props: {
    // 使用对象形式组织props]
    imgurl: {
      type: String,
      required: true, // 如果这个prop是必须的，则添加required
      default: "", // 设置默认值
    },
    title: {
      type: String,
      default: "",
    },
    info: {
      type: String,
      default: "",
    },
    info1: {
      type: String,
      default: "",
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isClick: {
      type: Boolean,
      default: false,
    },
    bookSourceName: {
      type: String,
      default: "",
    },
    tags: {
      type: Array,
      default: function () {
        return []; // 或者 return {}; 对于对象类型
      },
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    // titleC() {
    // 	if (this.title && this.title.length > 25) {
    // 		return this.title.substring(0, 20) + "...";
    // 	}
    // 	return this.title;
    // },
    // originColor() {
    // 	// 根据bookSourceName的值动态生成颜色值
    // 	const index = origins.findIndex(item => item.bookSourceName === this.bookSourceName);
    // 	let color = "ffc107"+index*16;
    // 	this.originColorStyle.backgroundColor = `#${564655}`;
    // }
  },
  methods: {
    toShow() {
      if (this.isClick) {
        uni.navigateTo({
          url: `/pages/image/image?imgsrc=${this.imgurl}`,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  height: 250rpx;
  padding: 16rpx;
  border-bottom: 1px solid rgba(239, 239, 239, 0.8);
}

.newbook {
  display: flex;
  justify-content: center;
}

.pic {
  width: 150rpx;
  height: 200rpx;
  margin-right: 10px;
  // box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background-color: #efefef;

  image {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}

.text {
  width: 70%;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;

  .title {
    // padding-top: 16rpx;
    padding-bottom: 8rpx;
    display: flex;
    align-items: center;
  }

  .titleC {
    font-size: 36rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .info {
    padding-top: 4rpx;
    font-size: 24rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .origin-color {
    // visibility: hidden;
    /* 默认情况下，元素不可见 */
    // margin-top: 8rpx;
    padding: 4rpx 8rpx;
    margin-right: 8rpx;
    font-size: 20rpx;
    background-color: #ffc107;
    width: fit-content;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    color: #fff;
    border-radius: 8rpx;
  }
}

.badge {
  margin-left: 5px; // 调整红点和文字之间的间距
}

.txet-container {
  display: flex;
}

.text-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text-right {
}
</style>
