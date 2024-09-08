<template>
  <view>
    <view v-for="(item, i) in books.list" :key="item.bookurl" @click="goBookHome(item)">
      <BookList
        :imgurl="item.imgurl"
        :title="item.bookname"
        :info="getInfo(item)"
        :info1="getInfo1(item)"
        :tags="item.tags"
      >
      </BookList>
    </view>
    <!-- 触底加载 -->
    <u-loading-icon :show="ubottom"></u-loading-icon>
    <!-- 全部加载完以后 -->
    <view v-if="visEnd">
      <!-- 通过status设置组件的状态，加载前值为loadmore，加载中为loading，没有数据为nomore -->
      <u-loadmore status="nomore" nomore-text="找不到更多啦" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ubottom: false,
      visEnd: false,
      page: 2
    }
  },
  onLoad(e) {
    this.books = JSON.parse(e.book)
    // 动态设置标题
    uni.setNavigationBarTitle({
      title: e.title
    })
  },
  onReachBottom() {
    // console.log('触底刷新')
    this.ubottom = true
    if (!this.visEnd) {
      this.getBooks()
    } else {
      this.ubottom = false
    }
  },
  methods: {
    getInfo(item) {
      return '作者：' + item.author
    },
    getInfo1(item) {
      if (item.intro) {
        return item.intro
      }
      return '更新：' + item.createdAt
    },
    getBooks() {
      const url = this.books.url.replace('{{page}}', this.page)
      this.page = this.page + 1
      uni.request({
        url: url,
        method: 'GET',
        success: res => {
          const origin = 'http://download.maoyankanshu.la'
          const search = res.data.data
          // 搜索结束 以后不再加载
          if (search.length < 1) {
            this.visEnd = true
          }
          let book = []
          for (let i = 0; i < search.length; i++) {
            const regex = /<b\s*style="color:red">|<\/b>/g
            let imgurl = search[i].cover
            // 加上书源 否则id可能和其它书源的url重复
            let bookurl = origin + search[i].novelId
            let bookname = search[i].novelName.replace(regex, '').replace(/\s/g, '')
            let author = search[i].authorName.replace(regex, '').replace(/\s/g, '')
            let intro = search[i].summary || ''
            let createdAt = search[i].createdAt
            let tags = []
            if (search[i].categoryNames[0].className) {
              tags.push(search[i].categoryNames[0].className)
            }
            if (search[i].wordNum) {
              tags.push(search[i].wordNum)
            }
            if (search[i].rankInfo) {
              tags.push(search[i].rankInfo)
            }
            if (search[i].averageScore > 0) {
              tags.push(search[i].averageScore + '分')
            }

            book.push({
              imgurl: imgurl,
              bookurl: bookurl,
              bookname: bookname,
              author: author,
              origin: origin,
              intro: intro,
              createdAt: createdAt,
              tags: tags
            })
          }
          // 加载动画结束
          this.ubottom = false
          this.books.list.push(...book)
        }
      })
    },
    goBookHome(book) {
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

<style></style>
