<template>
  <view class="page">
    <view class="profile-wrapper" @click="goUserUp">
      <view class="profile-left">
        <image class="avatar" :src="userInfo.avatarUrl" @click.stop="toShow"></image>
      </view>
      <view class="profile-right">
        <view class="nickname">{{ userInfo.nickname }}</view>
        <view class="bio">{{ userInfo.bio }}</view>
      </view>
    </view>
    <view class="boby">
      <view class="list" @click="goBookHistory">
        <view class="img">
          <image src="../../static/images/user/ll.svg"></image>
        </view>
        <view class="text">浏览记录</view>
        <u-icon name="arrow-right" size="16px" class="arrow" color="#000"></u-icon>
      </view>
      <view class="list" @click="goBookCache">
        <view class="img">
          <image src="../../static/images/user/hc.svg"></image>
        </view>
        <view class="text">缓存管理</view>
        <u-icon name="arrow-right" size="16px" class="arrow" color="#000"></u-icon>
      </view>
      <view class="list" @click="goBookTxt">
        <view class="img">
          <image src="../../static/images/user/dc.svg"></image>
        </view>
        <view class="text">导出管理</view>
        <u-icon name="arrow-right" size="16px" class="arrow" color="#000"></u-icon>
      </view>
      <view class="list" @click="goBookOrigin">
        <view class="img">
          <image src="../../static/images/user/sy.svg"></image>
        </view>
        <view class="text">书源管理</view>
        <u-icon name="arrow-right" size="16px" class="arrow" color="#000"></u-icon>
      </view>

      <view class="list" @click="setClipboard">
        <view class="img">
          <image src="../../static/images/user/fx.svg"></image>
        </view>
        <view class="text">分享应用</view>
        <u-icon name="arrow-right" size="16px" class="arrow" color="#000"></u-icon>
      </view>
      <view class="list" @click="goAbout">
        <view class="img">
          <image src="../../static/images/user/gy.svg"></image>
        </view>
        <view class="text">
          <text>关于我们</text>
          <u-badge class="badge" :isDot="true" v-if="visUp" type="error"></u-badge>
        </view>
        <u-icon name="arrow-right" size="16px" class="arrow" color="#000"></u-icon>
      </view>
      <view class="list" @click="opinion">
        <view class="img">
          <image src="../../static/images/user/yj.svg"></image>
        </view>
        <view class="text">意见反馈</view>
        <u-icon name="arrow-right" size="16px" class="arrow" color="#000"></u-icon>
      </view>
    </view>
  </view>
</template>
<script>
//引入HTML 文本解析器
import HTMLParser from '@/uni_modules/html-parser/js_sdk/index.js'
// 在组件中引入辅助函数
import { mapState } from 'vuex'

export default {
  data() {
    return {
      // avatarUrl: "/static/images/user/userImage.png",
      // nickname: "tx1115",
      // bio: "这是一个简介~",
      visUp: false
    }
  },
  onShow() {
    this.getUp()
  },
  computed: {
    // 使用 mapState 辅助函数将 Vuex 中的状态映射为组件的计算属性
    ...mapState(['userInfo'])
  },
  methods: {
    toShow() {
      uni.navigateTo({
        url: `/pages/image/image?imgsrc=${this.userInfo.avatarUrl}`
      })
    },
    getUp() {
      const accountInfo = uni.getSystemInfoSync()
      const version = accountInfo.appWgtVersion
      uni.request({
        url: 'https://blog.dotcpp.com/a/98412',
        success: res => {
          const doc = new HTMLParser(res.data.toString().trim())
          // 获取更新信息
          const intro = new HTMLParser(doc.getElementsByClassName('ueditor_container')[0].innerHTML)
          const newversion = intro.getElementsByTagName('p')[0].innerHTML.replace('<br/>', '')
          const title = intro.getElementsByTagName('p')[1].innerHTML.replace('<br/>', '')
          // console.log(newversion);
          // console.log(title)
          if (version != newversion) {
            console.log('更新了')
            this.visUp = true
          }
        }
      })
    },
    goUserUp() {
      uni.navigateTo({
        url: '/pages/user/userUp/userUp'
      })
    },
    goBookHistory() {
      uni.navigateTo({
        url: '/pages/user/bookHistory/bookHistory'
      })
    },
    goBookCache() {
      uni.navigateTo({
        url: '/pages/user/bookCache/bookCache'
      })
    },
    goBookTxt() {
      uni.navigateTo({
        url: '/pages/user/bookTxt/bookTxt'
      })
    },
    goBookOrigin() {
      uni.navigateTo({
        url: '/pages/user/bookOrigin/bookOrigin'
      })
    },

    setClipboard() {
      const data =
        '百度网盘链接：https://pan.baidu.com/s/19SJYyOaue5YBnQtcRKpG9g?pwd=data 提取码：data'
      uni.setClipboardData({
        data: data,
        showToast: false,
        success: function () {
          console.log('剪切板设置success')
          uni.showToast({
            icon: 'none',
            duration: 3000,
            title: '分享链接已复制到剪切板~\n' + data
          })
        }
      })
    },
    goAbout() {
      uni.navigateTo({
        url: '/pages/user/userAbout/userAbout'
      })
    },
    opinion() {
      uni.showToast({
        icon: 'none',
        title: '请联系作者QQ\n2830671713'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #f5f5f5;

  .boby {
    // height: 288px;
    margin: 32px 16px;
    background-color: rgb(255, 255, 255);
    border-radius: 16px;
    // box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.2); /* 这里是阴影样式 */

    .list {
      height: 48px;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;

      .img {
        width: 48px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        image {
          width: 50%;
          height: 50%;
        }
      }

      .text {
        flex-grow: 1;
        color: #444;
        display: flex;

        .badge {
          margin-left: 4px; // 调整红点和文字之间的间距
          margin-top: 6px;
        }
      }

      .arrow {
        margin-left: auto;
        width: 32px;
        height: 100%;
      }
    }
  }

  .profile-wrapper {
    display: flex;
    align-items: center;
    margin-left: 2px;
    margin-right: 2px;
    height: 128px;
    background: linear-gradient(to top, #00a8ff 100%, #fff 100%);
    border-radius: 16px;

    .profile-left {
      padding-left: 24px;
      margin-bottom: 4px;

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
    }

    .profile-right {
      padding-left: 32px;
      margin-bottom: 8px;

      .nickname {
        font-size: 20px;
        color: #f4f4f4;
        font-weight: bold;
        // margin-bottom: 8px;
      }

      .bio {
        margin-top: 0;
        font-size: 14px;
        color: #efefef;
      }
    }
  }
}
</style>
