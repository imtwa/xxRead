<template>
  <view>
    <view class="upgrade-popup">
      <image class="header-bg" src="@/static/images/user/uasrUpdate.png" mode="widthFix"></image>
      <view class="main">
        <view class="version">发现新版本v{{ item.title }}</view>
        <view class="content">
          <text class="title">更新内容</text>
          <view class="desc" v-html="item.description"></view>
        </view>
        <!--下载状态-进度条显示 -->
        <view class="footer" v-if="isStartDownload">
          <view class="progress-view" :class="{ active: !hasProgress }" @click="handleInstallApp">
            <!-- 进度条 -->
            <view v-if="hasProgress" style="height: 100%">
              <view class="txt">{{ percentText }}</view>
              <view class="progress" :style="setProStyle"></view>
            </view>
            <view v-else>
              <view class="btn upgrade force">{{
                isDownloadFinish ? '立即安装' : '等待下载ing...'
              }}</view>
            </view>
          </view>
        </view>
        <!-- 强制更新 -->
        <!-- <view class="footer">
          <view class="btn upgrade force" @click="handleUpgrade">立即更新</view>
        </view> -->
        <!-- 可选择更新 -->
        <view class="footer" v-else>
          <view class="btn close" @click="handleClose">以后再说</view>
          <view class="btn upgrade" @click="handleUpgrade">立即更新</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { downloadApp, installApp } from '@/utils/fileSystem.js'
export default {
  name: 'UserUpdate',
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isForceUpdate: false, //是否强制更新
      isDownloadFinish: false, //是否下载完成
      hasProgress: false, //是否能显示进度条
      currentPercent: 0, //当前下载百分比
      isStartDownload: false, //是否开始下载
      fileName: '', //下载后app本地路径名称
      downloadedSize: 0, //已下载大小
      totalSize: 0 //文件总大小
    }
  },
  computed: {
    //设置进度条样式，实时更新进度位置
    setProStyle() {
      return {
        width: (510 * this.currentPercent) / 100 + 'rpx' //510：按钮进度条宽度
      }
    },
    //百分比文字
    percentText() {
      let percent = this.currentPercent
      if (typeof percent !== 'number' || isNaN(percent)) return '下载中...'
      if (percent < 100) return `下载中 ${this.downloadedSize}MB/${this.totalSize}MB ${percent}%`
      return '立即安装'
    }
  },
  // onBackPress(options) {
  //     // 禁用返回
  //     if (options.from == 'backbutton') {
  //       return true;
  //     }
  //   },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    //更新
    handleUpgrade() {
      if (this.item.downloadUrl) {
        this.isStartDownload = true
        //开始下载App
        downloadApp(this.item.downloadUrl, (current, downloadedSize, totalSize) => {
          //下载进度监听
          this.hasProgress = true
          this.currentPercent = current
          this.downloadedSize = (downloadedSize / (1024 * 1024)).toFixed(2)
          this.totalSize = (totalSize / (1024 * 1024)).toFixed(2)
        })
          .then(fileName => {
            //下载完成
            this.isDownloadFinish = true
            this.fileName = fileName
            if (fileName) {
              //自动安装App
              this.handleInstallApp()
            }
          })
          .catch(e => {
            console.log(e, 'e')
          })
      } else {
        uni.showToast({
          title: '下载链接不存在',
          icon: 'none'
        })
      }
    },
    //安装app
    handleInstallApp() {
      //下载完成才能安装，防止下载过程中点击
      if (this.isDownloadFinish && this.fileName) {
        installApp(this.fileName, () => {
          //安装成功,关闭升级弹窗
          this.$emit('close')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upgrade-popup {
  width: 600rpx;
  height: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20rpx;
  box-sizing: border-box;
  border: 1px solid #eee;
}

.header-bg {
  width: 100%;
  border-radius: 10px;
}

.main {
  padding: 10rpx 30rpx 30rpx;
  box-sizing: border-box;

  .version {
    font-size: 36rpx;
    color: #026df7;
    font-weight: 700;
    width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 1px;
  }

  .content {
    margin-top: 30rpx;

    .title {
      font-size: 28rpx;
      font-weight: 700;
      color: #000000;
    }

    .desc {
      box-sizing: border-box;
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #6a6a6a;
      max-height: 80vh;
      overflow-y: auto;
    }
  }

  .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-shrink: 0;
    margin-top: 20rpx;

    .btn {
      width: 246rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 999;
      height: 96rpx;
      box-sizing: border-box;
      font-size: 32rpx;
      border-radius: 10rpx;
      letter-spacing: 2rpx;

      &.force {
        width: 500rpx;
      }

      &.close {
        border: 1px solid #e0e0e0;
        margin-right: 25rpx;
        color: #333;
      }

      &.upgrade {
        background-color: #026df7;
        color: white;
      }
    }

    .progress-view {
      width: 510rpx;
      height: 90rpx;
      display: flex;
      position: relative;
      align-items: center;
      border-radius: 15rpx;
      background-color: #dcdcdc;
      display: flex;
      justify-content: flex-start;
      padding: 0px;
      box-sizing: border-box;
      border: none;
      overflow: hidden;

      &.active {
        background-color: #026df7;
      }

      .progress {
        height: 100%;
        background-color: #026df7;
        padding: 0px;
        box-sizing: border-box;
        border: none;
        border-top-left-radius: 10rpx;
        border-bottom-left-radius: 10rpx;
      }

      .txt {
        width: max-content;
        font-size: 28rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
      }
    }
  }
}
</style>
