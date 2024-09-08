<template>
  <view>
    <view v-if="visnobook" class="nobook">
      <u-empty mode="data" text="暂无书籍"> </u-empty>
    </view>
    <view v-if="!visnobook" class="page">
      <view class="boby">
        <view class="ta1">共有 {{ bookTxts.length }} 条导出记录</view>
        <u-swipe-action>
          <u-swipe-action-item
            v-for="(item, index) in bookTxts"
            :key="item.toLocalURL"
            :options="options"
            @click="handleDelete(index)"
          >
            <view class="upper-section">
              <view class="left-section">
                <BookList
                  :imgurl="item.imgurl"
                  :title="item.bookname"
                  :info="'作者：' + item.author"
                  :info1="item.info"
                >
                </BookList>
              </view>
              <view class="right-section-wrapper">
                <u-button
                  text="打开"
                  type="error"
                  shape="circle"
                  size="normal"
                  plain
                  @click="goReadTxt(item.toLocalURL)"
                ></u-button>
              </view>
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
        <!-- <uni-swipe-action-item v-for="(item, index) in bookTxts" :right-options="options" :key="item.toLocalURL"
					@change="swipeChange($event, index)" @click="swipeClick($event, index)">
					<view class="upper-section">
						<view class="left-section">
							<BookList :imgurl="item.imgurl" :title="item.bookname" :info="'作者：'+item.author"
								:info1="item.info">
							</BookList>
						</view>
						<view class="right-section-wrapper">
							<u-button text="打开" type="error" shape="circle" size="normal" plain
								@click="goReadTxt(item.toLocalURL)"></u-button>
						</view>
					</view>
				</uni-swipe-action-item> -->
      </view>
    </view>
    <!-- 确认删除弹窗 -->
    <u-modal
      :show="vismodalD"
      title="确定要删除这条记录吗？"
      showCancelButton
      closeOnClickOverlay
      :zoom="false"
      @cancel="cancelmodalD"
      @confirm="confirmmodalD"
      @close="closemodalD"
    ></u-modal>
  </view>
</template>

<script>
import store from '@/store/index.js'

export default {
  data() {
    return {
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: 'rgb(255,58,49)'
          }
        }
      ],
      // 删除确认弹窗
      vismodalD: false,
      spbook: {}
    }
  },
  onShow() {
    console.log(this.bookTxts)
  },
  //计算属性
  computed: {
    bookTxts() {
      // return this.$store.state.bookTxts.slice().reverse();
      const reversedBookTxts = this.$store.state.bookTxts.slice().reverse()
      for (const item of reversedBookTxts) {
        // item.info = `作者：${item.author}\n`;
        uni.getFileInfo({
          filePath: item.toLocalURL,
          success: res => {
            const fileSizeMb = (res.size / (1024 * 1024)).toFixed(2)
            item.info = `大小：${fileSizeMb} MB`
            // console.log("计算完成");
          }
        })
      }
      return reversedBookTxts
    },
    visnobook() {
      if (this.bookTxts.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getInfo(item) {},
    goReadTxt(toLocalURL) {
      plus.runtime.openFile(
        toLocalURL,
        {
          withSystemUI: true
        },
        e => {
          console.log('打开文件成功', e)
          if (-4 == e.code) {
            uni.showToast({
              title: '打开文件发生错误：' + e.message,
              icon: 'none'
            })
          }
        },
        err => {
          console.error('打开文件发生错误', err)
          uni.showToast({
            title: '打开文件发生错误：' + err,
            icon: 'none'
          })
        }
      )
    },
    handleDelete(index) {
      // 处理删除事件的逻辑
      // console.log("删除事件被触发");
      // 即将要删除的对象
      this.spbook = this.bookTxts[index]
      // 弹出确定弹窗
      this.vismodalD = true
    },
    //点击了确定删除
    confirmmodalD() {
      //找到这本书的索引并删除
      this.$store
        .dispatch('deleteBookTxts', this.spbook.toLocalURL)
        .then(index => {
          if (0 === index) {
            //消息提示
            uni.showToast({
              title: '删除成功',
              icon: 'none'
            })
            // 存入缓存中
            this.$store.commit('setBookShelfFromStorage')
            //刷新书架
            // this.bookShow()
          } else {
            uni.showToast({
              title: '删除失败,记录内没有这本书',
              icon: 'none'
            })
          }
        })
        .catch(error => {
          // 异常情况的处理
          //消息提示
          uni.showToast({
            title: '删除失败' + JSON.stringify(error),
            icon: 'none'
          })
        })
      //隐藏弹窗
      this.vismodalD = false
    },
    cancelmodalD() {
      //点击了取消
      //隐藏弹窗
      this.vismodalD = false
    },
    closemodalD() {
      //遮罩层关闭
      this.vismodalD = false
    }
  }
}
</script>

<style lang="scss" scoped>
.nobook {
  padding-top: 150rpx;
  margin-top: 200rpx;
  height: 500rpx;
  display: flex;
  // 水平居中
  justify-content: center;
  // 垂直居中
  align-items: center;
}

.page {
  // background-color: rgb(239, 239, 239);
  // height: 100%;
  padding-bottom: 10px;
}

.boby {
}

.ta1 {
  margin-left: 10px;
}

.upper-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  // // padding: 10px;
  // margin-left: 10px;
  // margin-right: 10px;
  // margin-top: 8px;
  // margin-bottom: 5px;

  // border-radius: 10px;
  // box-shadow: 2px 2px 2px rgba(62, 62, 62, 0.2);
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
