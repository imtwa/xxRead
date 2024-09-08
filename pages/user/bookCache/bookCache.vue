<template>
  <view>
    <view v-if="visnobook" class="nobook">
      <u-empty mode="data" text="暂无书籍"> </u-empty>
    </view>
    <view v-if="!visnobook" class="page">
      <view class="atop"> 共有 {{ bookShelf.length }} 本书，共占用内存 {{ currentSize }} MB </view>
      <view class="container" v-for="(book, i) in bookShelf" :key="book.imgurl">
        <view class="left-section" @click="handleClearCache(i)">
          <view class="top">{{ book.bookname }}</view>
          <view class="middle">
            <view class="left"> {{ book.count }}/{{ book.chapters.length }} </view>
            <view class="right">
              <view v-if="book.vis">
                <text>下载中</text>
              </view>
              <view v-if="!book.vis">
                <text>已暂停</text>
              </view>
            </view>
          </view>
          <view class="bottom">
            <u-line-progress
              :percentage="((book.count * 100) / book.chapters.length).toFixed(2)"
              activeColor="#00A8FF"
            >
            </u-line-progress>
          </view>
        </view>
        <view class="right-section">
          <view class="iconmin" @click="gomenu(i)">
            <view v-if="book.vis">
              <u-icon name="pause-circle" size="24" color="#00A8FF"></u-icon>
            </view>
            <view v-if="!book.vis">
              <u-icon name="play-circle" size="24" color="#00A8FF"></u-icon>
            </view>
          </view>
        </view>
      </view>
      <!-- 确认清除全部缓存弹窗 -->
      <u-modal
        :show="vismodalH"
        :title="title"
        showCancelButton
        closeOnClickOverlay
        :zoom="false"
        @cancel="cancelmodalH"
        @confirm="confirmmodalH"
        @close="closemodalH"
      ></u-modal>
    </view>
  </view>
</template>

<script>
import HTMLParser from '@/uni_modules/html-parser/js_sdk/index.js'
export default {
  data() {
    return {
      vismodalH: false,
      title: '确定要清除全部缓存吗？',
      spbook: {},
      currentSize: 0,
      // 获取内存监听器
      IntervalSize: null
    }
  },
  //组件被销毁
  onUnload() {
    // console.log("组件被销毁");
    // 移除监听器
    // clearInterval(this.IntervalSize)
  },
  onShow: function () {
    // console.log("组件显示");

    //延迟一秒后执行
    setTimeout(() => {
      this.getSize()
    }, 1000)

    // //每一秒获取一次内存
    // this.IntervalSize = setInterval(() => {
    // 	this.getSize()
    // }, 3000)
  },
  //计算属性
  computed: {
    bookShelf() {
      let books = this.$store.state.bookShelf.slice().reverse()
      for (let i = 0; i < books.length; i++) {
        books[i].vis = false
        // 计算有多少章没有下载
        let count = (count = 0)
        //查找具有visD属性且值为true的元素数量
        books[i].chapters
          .filter(chapter => chapter.visD === true)
          .forEach(chapter => {
            count++
          })
        books[i].count = count
      }
      return books
    },
    visnobook() {
      if (this.bookShelf.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getSize() {
      // 查看使用的内存
      uni.getStorageInfo({
        success: res => {
          // console.log(res.keys);
          // console.log(res.currentSize);
          // 在回调中使用该引用
          this.currentSize = (res.currentSize / 1024).toFixed(2)
        }
      })
    },
    handleClearCache(ind) {
      // 处理清除缓存事件的逻辑
      console.log('清除缓存事件被触发')
      this.spbook = this.bookShelf[ind]
      this.title = '确定要清除书籍\n' + this.spbook.bookname.trim() + '\n的全部缓存吗？'
      // 弹窗
      this.vismodalH = true
    },

    confirmmodalH() {
      // 确认按钮点击事件处理逻辑
      // 在这里进行清除缓存的操作
      const key = 'bookall' + this.spbook.bookurl
      // 同时清空缓存
      uni.removeStorage({
        key: key,
        success: res => {
          uni.showToast({
            title: '缓存清除成功',
            icon: 'none'
          })
          // 全取消
          this.spbook.chapters.forEach(chapter => {
            chapter.visD = false
          })
          // 更新
          this.$store.commit('modifyBook', this.spbook)
        },
        fail: res => {
          uni.showToast({
            title: '这本书已经没有缓存啦',
            icon: 'none'
          })
          // 全取消
          this.spbook.chapters.forEach(chapter => {
            chapter.visD = false
          })
          // 更新
          this.$store.commit('modifyBook', this.spbook)
        }
      })
      this.vismodalH = false
      //隐藏菜单
      this.vispopup = false
    },
    cancelmodalH() {
      // 取消按钮点击事件处理逻辑
      this.vismodalH = false
    },
    closemodalH() {
      // 弹窗关闭事件处理逻辑
      this.vismodalH = false
    },
    gomenu(ind) {
      if (true === this.bookShelf[ind].vis) {
        this.bookShelf[ind].vis = false
        uni.showToast({
          icon: 'none',
          title: '已暂停'
        })
      } else {
        if (this.bookShelf[ind].count === this.bookShelf[ind].chapters.length) {
          uni.showToast({
            icon: 'none',
            title: '章节已经全部下载完成'
          })
        } else {
          // console.log(this.bookShelf[ind].bookname);
          this.bookShelf[ind].vis = true
          this.confirmmodalX(ind)
        }
      }
    },
    async confirmmodalX(ind) {
      uni.showToast({
        icon: 'none',
        title: '开始下载ing'
      })
      let spbook = this.bookShelf[ind]
      const key = 'bookall' + spbook.bookurl
      let bookall = uni.getStorageSync(key)

      if (!bookall) {
        // console.log("缓存数据为空");
        // 走缓存中转一下，否则引用的是同一个对象
        uni.setStorageSync(key, spbook)
        // 使用同步读取！！
        bookall = uni.getStorageSync(key)
        // bookall = JSON.parse(JSON.stringify(spbook));
        bookall.progress = 0
      }

      const originF = bookall.origin

      for (let i = 0; i < bookall.chapters.length; i++) {
        if (false === this.bookShelf[ind].vis) {
          console.log('停止')
          // 缓存
          uni.setStorageSync(key, bookall)
          // 更新
          this.$store.commit('modifyBook', spbook)
          break
        }

        const chapter = bookall.chapters[i]

        if (!chapter.hasOwnProperty('text')) {
          try {
            const chapterId = chapter.chapterurl
            const text = await this.$getNetwork.read(originF, chapterId)
            if (-1 == text) {
              // console.log("网络请求错误");
            }
            // uni.showToast({
            // 	title: '正在下载第 ' + (i + 1) + ' 章',
            // 	icon: 'none'
            // });

            //添加数据
            bookall.chapters[i]['text'] = text
            //标记为已经下载
            spbook.chapters[i]['visD'] = true
            // 进度条增加
            this.bookShelf[ind].count++
            if ((i + 1) % 10 === 0) {
              // 每10次执行一次逻辑
              // 缓存
              uni.setStorageSync(key, bookall)
              // 更新
              this.$store.commit('modifyBook', spbook)
              console.log('十次一缓存')
            }
            if (bookall.chapters.length - 1 === i) {
              // 缓存
              uni.setStorageSync(key, bookall)
              // 更新
              this.$store.commit('modifyBook', spbook)
              uni.showToast({
                title: '全部下载完成',
                icon: 'none'
              })
              this.bookShelf[ind].vis = false
            }
            console.log(i)
          } catch (e) {
            console.log(e)
            uni.showToast({
              title: '错误' + e.message,
              icon: 'none'
            })
            // 缓存
            uni.setStorageSync(key, bookall)
            // 更新
            this.$store.commit('modifyBook', spbook)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.page {
  background-color: rgb(239, 239, 239);
  min-height: 100vh;
  padding-bottom: 10px;
}

.nobook {
  padding-top: 100px;
  margin-top: 100px;
  height: 250px;
  display: flex;
  // 水平居中
  justify-content: center;
  // 垂直居中
  align-items: center;
}

.atop {
  padding-left: 10px;
}

.container {
  display: flex;
  height: 90px;
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 8px;
  margin-bottom: 5px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 2px rgba(62, 62, 62, 0.2);
}

.left-section {
  flex: 85%;
  display: flex;
  flex-direction: column;
}

.right-section {
  flex: 15%;
  display: flex;
  justify-content: center;
  align-items: center;

  .iconmin {
    padding-top: 15px;
  }
}

.top {
  height: 33.33%;
}

.middle {
  height: 33.33%;
  display: flex;
  justify-content: space-between;
  color: #555;
  font-size: 14px;
}

.left {
  width: 20%;
}

.right {
  width: 20%;
}

.bottom {
  height: 33.33%;
  padding-top: 5px;
}
</style>
