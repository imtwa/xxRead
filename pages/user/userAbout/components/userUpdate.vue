<template>
  <view>
    <view class="upgrade-popup">
      <image class="header-bg" src="@/static/images/user/uasrUpdate.png" mode="widthFix"></image>
      <view class="main">
        <view class="version">发现新版本{{ versionName }}</view>
        <view class="content">
          <text class="title">更新内容</text>
          <view class="desc" v-html="versionDesc"></view>
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
                isDownloadFinish ? '立即安装' : '下载中...'
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
export default {
  name: 'UserUpdate',
  data() {
    return {
      isForceUpdate: false, //是否强制更新
      versionName: '2.1.4', //版本名称
      versionDesc: '阅读界面增加多个字体选择，加入背景颜色调色盘，优化少量BUG', //更新说明
      downloadUrl: '', //APP下载链接
      isDownloadFinish: false, //是否下载完成
      hasProgress: false, //是否能显示进度条
      currentPercent: 0, //当前下载百分比
      isStartDownload: false, //是否开始下载
      fileName: '' //下载后app本地路径名称
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.upgrade-popup {
  width: 500rpx;
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
    margin-top: 60rpx;

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
    margin-top: 100rpx;

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
      border-radius: 6rpx;
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
