<template>
  <view style="background-color: rgb(239, 239, 239); height: 100vh">
    <view>
      <view class="row" @click="upAvatarUrl">
        <view class="text">头像</view>
        <view class="right-area">
          <view class="lf">
            <image :src="newUserInfo.avatarUrl" class="img"></image>
          </view>
          <u-icon name="arrow-right" size="16px" color="#333"></u-icon>
        </view>
      </view>
      <view class="row">
        <view class="text">昵称</view>
        <view class="right-area">
          <view class="lf">
            <input maxlength="10" :placeholder="userInfo.nickname" v-model="newUserInfo.nickname" />
          </view>
          <u-icon name="arrow-right" size="16px" color="#333"></u-icon>
        </view>
      </view>
      <view class="row">
        <view class="text">简介</view>
        <view class="right-area">
          <view class="lf">
            <input
              class="uni-input"
              maxlength="20"
              :placeholder="userInfo.bio"
              v-model="newUserInfo.bio"
            />
          </view>
          <u-icon name="arrow-right" size="16px" color="#333"></u-icon>
        </view>
      </view>
    </view>
    <view class="bot">
      <u-button type="success" text="保存" color="#07c160" @click="up"></u-button>
    </view>
  </view>
</template>

<script>
// 在组件中引入辅助函数
import { mapState } from 'vuex'
import { deepCopy } from '@/utils/utils.js'
export default {
  data() {
    return {
      newUserInfo: {
        avatarUrl: '',
        nickname: '',
        bio: ''
      }
    }
  },
  computed: {
    // 使用 mapState 辅助函数将 Vuex 中的状态映射为组件的计算属性
    ...mapState(['userInfo'])
  },
  created() {
    // 在组件创建时，将 userInfo 的值赋给 newUserInfo
    // 这样是浅拷贝，修改newUserInfo会影响到userInfo
    // this.newUserInfo = this.userInfo;

    // 将 this.userInfo 对象转换为字符串，然后再将其解析为一个新的对象，从而实现深拷贝
    // this.newUserInfo = JSON.parse(JSON.stringify(this.userInfo))
    this.newUserInfo = deepCopy(this.userInfo)
  },
  methods: {
    upAvatarUrl() {
      uni.chooseImage({
        count: 1, // 最多选择的图片数量
        sizeType: ['compressed'], // 图片压缩类型，可以是原图(original)或压缩图(compressed)
        sourceType: ['album'], // 图片选择来源，可以是相册(album)或相机(camera)
        success: res => {
          const tempFilePaths = res.tempFilePaths[0]
          // console.log(tempFilePaths);
          this.newUserInfo.avatarUrl = tempFilePaths

          // // 将选择的图片路径更新到 Vuex 的 avatarUrl 状态中
          // this.$store.commit('modifyUserInfo', this.newUserInfo)
        }
      })
    },
    up() {
      this.$store.commit('modifyUserInfo', this.newUserInfo)
      //返回上一级界面
      uni.navigateBack()
      uni.showToast({
        icon: 'none',
        duration: 1500,
        title: '保存成功~'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  height: 56px;
  padding-left: 16px;
  background-color: #fff;
  border-bottom: 1px #eee solid;
}

.text {
  flex: 1;
  color: #444;
}

.right-area {
  /* 右侧内容的样式设置 */
  flex-shrink: 0;
  /* 防止右侧区域被压缩 */
  text-align: right;
  /* 设置右侧内容的对齐方式 */
  margin-right: 16px;
  margin-left: auto;
  /* 将内容靠右侧 */
  display: flex;
  align-items: center;
}

.lf {
  margin-right: 8px;
}

.img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}

.bot {
  margin-top: 150px;
  // position: relative;
  // /* 或 absolute */
  // left: 50%;
  // transform: translateX(-50%);
  width: 25%;
  margin-left: auto;
  margin-right: auto;
}
</style>
