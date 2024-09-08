<template>
  <view class="container">
    <view class="tab">
      <u-tabs
        :current="index"
        :list="list"
        lineWidth="30"
        lineColor="#f56c6c"
        :activeStyle="{
          color: '#303133',
          fontWeight: 'bold',
          transform: 'scale(1.05)'
        }"
        :inactiveStyle="{
          color: '#606266',
          transform: 'scale(1)'
        }"
        itemStyle="padding: 10px; height: 40px;width: 20%; "
        @click="goclick"
      >
      </u-tabs>
    </view>
    <view class="cont">
      <view v-for="(item, i) in bookLists[index]" :key="i" class="bookList">
        <view class="listleft" @click="goBookHome(item)">
          <BookList
            :imgurl="item.imgurl"
            :title="i + 1 + '.' + item.bookname"
            :info="'作者: ' + item.author"
            :info1="'更新: ' + item.createdAt"
            :tags="item.tags"
          >
          </BookList>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      bookConfigs: ['更新榜', '收藏榜', '推荐榜', '排行榜', '字数榜'],
      //u-tabs导航栏内容
      list: [
        {
          name: '更新榜'
        },
        {
          name: '收藏榜'
        },
        {
          name: '推荐榜'
        },
        {
          name: '排行榜'
        },
        {
          name: '字数榜'
        }
      ]
    }
  },
  computed: {
    bookLists() {
      return this.$store.state.bookLists
    }
  },
  onLoad(e) {
    this.index = parseInt(e.index)
  },
  methods: {
    goclick(e) {
      this.index = e.index
    },
    changeIndex(index) {
      this.index = index
    },
    //打开书籍主页
    goBookHome(book) {
      // // 同时传递书籍五个参数
      // uni.navigateTo({
      // 	url: `/pages/bookHomepage/bookHomepage?author=${book.author}&bookname=${book.bookname}
      // 	&bookurl=${book.bookurl}&imgurl=${book.imgurl}&origin=${book.origin}`
      // })
      // encodeURIComponent 对字符串中的某些特殊字符进行转义，以便可以安全地包含在 URL 中 这样可以传递大对象
      // 使用decodeURIComponent转码
      const e = encodeURIComponent(JSON.stringify(book))
      uni.navigateTo({
        url: `/pages/bookHomepage/bookHomepage?book=${e}`
      })
    }
  }
}
</script>

<style lang="scss">
// .container {
// 	display: flex;
// }
.tab {
  position: fixed;
  height: 48px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: #fff;
}

.cont {
  margin-top: 48px;
}

// .left {
// 	position: fixed;
// 	top: 0;
// 	left: 0;
// 	width: 64px;
// 	height: 240px;
// 	background-color: #f0f0f0;
// }

// .item {
// 	height: 48px;
// 	cursor: pointer;
// 	font-size: 14px;
// 	color: #555;
// }

// .active {
// 	font-weight: bold;
// 	background-color: #fff;
// 	color: #E5363D;
// }

// .text {
// 	padding-top: 14px;
// 	padding-left: 8px;
// }

// .right {
// 	padding-left: 72px;
// 	flex: 1;
// 	background-color: #fff;
// }

// .listleft {
// 	height: 120px;
// }
</style>
