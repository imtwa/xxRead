<template>
  <view @click="visMenu = false">
    <!-- 导航栏 -->
    <view class="bar">
      <view class="uni-bar">
        <view class="flex">
          <view @click="toVisList" style="padding-top: 4px">
            <u-icon name="list-dot" size="28px" v-if="visList"></u-icon>
            <u-icon name="grid-fill" size="28px" v-if="!visList"></u-icon>
          </view>
        </view>

        <view class="uni-title">
          我的书架
          <spen style="font-size: 14px">（共 {{ bookShelf.length }} 本）</spen>
        </view>

        <view class="icon">
          <navigator url="../search/search" hover-stay-time="0">
            <icon type="search" color="#2f2f2f"></icon>
          </navigator>
          <view
            @click.stop="visMenu = !visMenu"
            style="
              width: 50rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 25rpx;
              margin-top: 5px;
            "
          >
            <u-icon name="more-dot-fill" color="#000" size="23" style="transform: rotate(90deg)">
            </u-icon>
          </view>
        </view>
      </view>

      <view class="index-menu" v-show="visMenu">
        <view class="item" @click="refresh">
          <view class="item-left">
            <u-icon name="reload" bold size="18"></u-icon>
          </view>
          <view class="item-right">刷新目录</view>
        </view>
        <view class="item" @click="openFileSystem">
          <view class="item-left">
            <u-icon name="plus-circle" bold size="16"></u-icon>
          </view>
          <view class="item-right">本地导入</view>
        </view>
      </view>
    </view>

    <view v-if="0 === bookShelf.length" class="nobook">
      <u-empty mode="data" text="暂无书籍"> </u-empty>
    </view>
    <view class="yesbook">
      <view v-show="visList">
        <!-- 左滑组件 -->
        <uni-swipe-action-item
          v-for="(item, index) in bookShelf"
          :right-options="options"
          :key="item.bookurl"
          @change="swipeChange($event, index)"
          @click="swipeClick($event, index)"
        >
          <view class="bookList" @longpress="gomenu(index)">
            <view class="listleft" @click="goBookRead(index)">
              <BookList
                :imgurl="item.imgurl"
                :title="item.bookname"
                :info="getInfo(item)"
                :info1="getInfo1(item)"
                :isUpdated="item.isUpdated"
              >
              </BookList>
            </view>

            <!-- 详情图标 -->
            <view class="icon">
              <view class="iconmin" @click="gomenu(index)">
                <u-icon name="more-dot-fill" size="20"></u-icon>
                <!-- <FontAwesome type="fa fa-ellipsis-h" size="40" color="#777"></FontAwesome> -->
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </view>
      <view v-show="!visList" class="book-container">
        <view
          v-for="(item, index) in bookShelf"
          :key="item.bookurl"
          class="book-item"
          @click="goBookRead(index)"
          @longpress="gomenu(index)"
        >
          <view>
            <image :src="item.imgurl" class="book-cover"> </image>
          </view>
          <view class="book-name">{{ item.bookname }}</view>
          <u-badge class="cont-badge" :isDot="true" type="error" v-if="item.isUpdated"></u-badge>
        </view>
      </view>
    </view>

    <!-- 底部弹窗 -->
    <u-popup :show="vispopup" :round="10" mode="bottom" @close="popupclose" @open="popupopen">
      <Cpupup
        :spopupbook="spbook"
        @delete="handleDelete"
        @clearCache="handleClearCache"
        @download="handleDownload"
        @share="handleShare"
        @txt="handleTxt(spbook)"
      >
      </Cpupup>
    </u-popup>

    <!-- 确认删除弹窗 -->
    <u-modal
      :show="vismodalD"
      title="确定要删除本书吗？"
      showCancelButton
      closeOnClickOverlay
      :zoom="false"
      @cancel="cancelmodalD"
      @confirm="confirmmodalD"
      @close="closemodalD"
    ></u-modal>

    <!-- 确认清除全部缓存弹窗 -->
    <u-modal
      :show="vismodalH"
      title="确定要清除全部缓存吗？"
      showCancelButton
      closeOnClickOverlay
      :zoom="false"
      @cancel="cancelmodalH"
      @confirm="confirmmodalH"
      @close="closemodalH"
    ></u-modal>

    <!-- 确认缓存弹窗 -->
    <u-modal
      :show="vismodalX"
      :title="titlemodalX"
      showCancelButton
      closeOnClickOverlay
      :zoom="false"
      @cancel="cancelmodalX"
      @confirm="confirmmodalX"
      @close="closemodalX"
    ></u-modal>
    <!-- 更新弹窗 -->
    <u-popup
      :show="visUpdatePopup"
      :round="10"
      mode="center"
      :closeOnClickOverlay="false"
      @close="upadatePopupclose"
      @open="upadtePopupopen"
    >
      <UserUpdate :item="getUpdateItems[0]" @close="upadatePopupclose"></UserUpdate>
    </u-popup>
  </view>
</template>

<script>
import store from '@/store/index.js'
import HTMLParser from '@/uni_modules/html-parser/js_sdk/index.js'
import UserUpdate from '@/components/userUpdate.vue'
import { deepCopy } from '@/utils/utils.js'
import update from '@/api/update.js'
import { outputTxT, inputTxT, readTxt } from '@/utils/fileSystem.js'

export default {
  components: {
    UserUpdate
  },
  data() {
    return {
      //书架列表
      // bookShelf: [],
      //列表格式？宫格or列表
      visList: true,
      //书架里没有书
      visnobook: false,
      //是否显示底部弹窗
      vispopup: false,
      // 更新弹窗
      visUpdatePopup: false,
      // 更新内容
      getUpdateItems: [],
      //是否显示菜单
      visMenu: false,
      //在哪本书打开的弹窗
      spbook: {},
      //在书架中的索引
      spindex: -1,
      // 删除确认弹窗
      vismodalD: false,
      vismodalH: false,
      vismodalX: false,
      titlemodalX: '确定要缓存全部章节吗？',
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: 'rgb(255,58,49)'
          }
        }
      ]
    }
  },
  // onLoad()  {
  // 	console.log("页面加载");

  // 	// 检查更新
  // 	this.updateBookshelf()
  // },

  onReady() {
    // 检查更新
    this.updateBookshelf()
    this.$nextTick(() => {
      // 检测软件更新
      this.getUp()
    })
  },
  mounted() {
    // // 检测软件更新
    // this.getUp()
    // this.resultPath('/storage/emulated/0/Download/Documents/《穿书后所有人都开始爱我》.txt')
  },
  onShow() {
    // //页面显示时就刷新值
    // this.bookShow()
    // //将数据缓存
    // this.$store.commit('setBookShelfFromStorage')
  },
  //组件被销毁
  onUnload() {
    // console.log("组件被销毁");
    // //将数据缓存
    // this.$store.commit('setBookShelfFromStorage')
  },
  //组件被隐藏
  onHide() {
    // console.log("组件被隐藏");
    // //将数据缓存
    // this.$store.commit('setBookShelfFromStorage')
  },
  // 退出页面时的操作
  onBackPress(options) {
    console.log('我退出啦')
    //将数据缓存
    // this.$store.commit('setBookShelfFromStorage')
  },
  //监听用户下拉刷新动作
  onPullDownRefresh() {
    // 检查更新
    this.updateBookshelf()
  },

  //计算属性
  computed: {
    bookShelf() {
      return this.$store.state.bookShelf.slice().reverse()
    }
  },

  methods: {
    //关闭菜单弹窗
    upadatePopupclose() {
      this.visUpdatePopup = false
      // console.log('菜单弹窗关闭啦')
    },
    //打开了菜单弹窗
    upadtePopupopen() {
      // console.log('菜单弹窗打开啦')
    },
    /**
     * 获取更新信息 打开弹窗
     */
    async getUp() {
      const res = await update.getUpdate()
      if (res !== '') {
        this.getUpdateItems.splice(0) // 清空数组
        this.getUpdateItems.push(...res)

        const accountInfo = uni.getSystemInfoSync()
        let version = accountInfo.appWgtVersion

        if (version != res[0].title) {
          console.log('index更新了')
          this.visUpdatePopup = true
        }
      }
    },
    /**
     * 根据路径获取文件内容
     */
    async resultPath(e) {
      console.log(e)
      const File = plus.android.importClass('java.io.File')
      let fileLen = new File(e).length()
      let fileSize = (fileLen / (1024 * 1024)).toFixed(2)
      uni.showLoading({
        title: `导入ing...\n预计 ${fileSize * 25}s`
      })
      // 读取文件内容
      const startTime = Date.now() // 记录开始时间
      const content = await readTxt(e)
      const endTime = Date.now() // 记录结束时间

      // 计算并打印耗时
      console.log(`读取文件耗时：${endTime - startTime} 毫秒`)
      // console.log(content)

      // 如果读取到内容
      if (content) {
        let inputBook = inputTxT(content)
        inputBook.bookurl = e
        // 将书籍加入缓存
        const key = 'bookall' + inputBook.bookurl
        uni.setStorage({
          key: key,
          data: inputBook,
          success: function () {
            console.log('导入文件缓存成功')
          }
        })
        // 这里只保留目录 不保留内容
        inputBook.chapters.forEach(chapter => {
          chapter.text = ''
        })
        // console.log(inputBook)
        // 加入书架
        this.$store.commit('addBookShelf', inputBook)
        // 取消加载提示
        uni.hideLoading()
        uni.showToast({
          icon: 'none',
          duration: 3000,
          title: '导入' + inputBook.bookname + '成功！'
        })
      } else {
        // 处理读取不到的逻辑
        uni.showToast({
          icon: 'none',
          duration: 3000,
          title: '读取' + e + '失败了...'
        })
      }
    },

    /**
     * 判断读取文件权限 并获取权限
     */
    async openFileSystem() {
      try {
        // 获取Android应用的上下文
        const context = plus.android.runtimeMainActivity().getApplicationContext()
        // 请求的权限
        const permission = 'android.permission.READ_EXTERNAL_STORAGE'
        // 检查权限状态
        const permissionState = context.checkCallingOrSelfPermission(permission)
        //如果已经授权,获取到的permissionState为0，未授权为-1
        if (permissionState === 0) {
          this.permissionGranted = true
          // 打开文件选择器
          this.openFile()
        } else {
          // 未授权，请求权限
          const activity = plus.android.runtimeMainActivity()
          const requestCode = 100 // 自定义请求码
          activity.requestPermissions([permission], requestCode)
          // 打开文件选择器
          this.openFile()
        }
      } catch (error) {
        console.error('Error requesting permission:', error)
      }
    },

    /**
     * 打开文件选择器，允许用户选择文件。
     * 该方法仅在Android平台上有效。
     *
     * @description
     * 1. 检查当前平台是否为Android，如果不是则提示用户并返回。
     * 2. 使用Android原生API启动一个Intent，允许用户选择特定类型的文件。
     * 3. 通过Intent回调获取用户选择的文件Uri。
     * 4. 根据Android版本解析Uri以获取文件的绝对路径。
     * 5. 将获取到的文件路径通过回调传递出去。
     *
     * @param {none}
     *
     * @returns {Boolean} 如果平台不是Android，则返回false；否则无返回值。
     */
    openFile() {
      // #ifdef APP-PLUS
      if (plus.os.name.toLowerCase() != 'android') {
        uni.showModal({
          title: '提示',
          content: '仅支持Android平台',
          success: function (res) {}
        })
        return false
      }
      let that = this
      // java 代码来自 http://www.cnblogs.com/panhouye/archive/2017/04/23/6751710.html
      let main = plus.android.runtimeMainActivity()
      let Intent = plus.android.importClass('android.content.Intent')

      let fileIntent = new Intent(Intent.ACTION_GET_CONTENT)
      //fileIntent.setType(“image/*”);//选择图片
      //fileIntent.setType(“audio/*”); //选择音频
      //fileIntent.setType(“video/*”); //选择视频 （mp4 3gp 是android支持的视频格式）
      //fileIntent.setType(“video/*;image/*”);//同时选择视频和图片
      // fileIntent.setType("*/*"); //无类型限制
      fileIntent.setType('txt/*') //txt类型
      fileIntent.addCategory(Intent.CATEGORY_OPENABLE)
      main.startActivityForResult(fileIntent, 1)
      // 获取回调
      main.onActivityResult = function (requestCode, resultCode, data) {
        let Activity = plus.android.importClass('android.app.Activity')
        let ContentUris = plus.android.importClass('android.content.ContentUris')
        let Cursor = plus.android.importClass('android.database.Cursor')
        let Uri = plus.android.importClass('android.net.Uri')
        let Build = plus.android.importClass('android.os.Build')
        let Environment = plus.android.importClass('android.os.Environment')
        let DocumentsContract = plus.android.importClass('android.provider.DocumentsContract')
        let MediaStore = plus.android.importClass('android.provider.MediaStore')
        // 给系统导入 contentResolver
        let contentResolver = main.getContentResolver()
        plus.android.importClass(contentResolver)
        // 返回路径
        let path = ''
        if (resultCode == Activity.RESULT_OK) {
          let uri = data.getData()
          if ('file' == uri.getScheme().toLowerCase()) {
            //使用第三方应用打开
            path = uri.getPath()
            return
          }
          if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) {
            //4.4以后
            path = getPath(this, uri)
          } else {
            //4.4以下下系统调用方法
            path = getRealPathFromURI(uri)
          }
          // 回调
          that.resultPath(path)

          // that.$emit('result', path)
        }
        // 4.4 以上 从Uri 获取文件绝对路径
        function getPath(context, uri) {
          let isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT
          let scheme = uri.getScheme().toLowerCase()
          if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
            // ExternalStorageProvider
            if (isExternalStorageDocument(uri)) {
              let docId = DocumentsContract.getDocumentId(uri)
              let split = docId.split(':')
              let type = split[0]
              // 如果是手机内部存储
              if ('primary' == type.toLowerCase()) {
                return Environment.getExternalStorageDirectory() + '/' + split[1]
              } else {
                return '/storage/' + type + '/' + split[1]
              }
            }
            // DownloadsProvider
            else if (isDownloadsDocument(uri)) {
              let id = DocumentsContract.getDocumentId(uri)
              let split = id.split(':')
              return split[1]
              // console.log(id)
              // let contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), id);
              // return getDataColumn(context, contentUri, null, null);
            }
            // MediaProvider
            else if (isMediaDocument(uri)) {
              let docId = DocumentsContract.getDocumentId(uri)
              let split = docId.split(':')
              let type = split[0]
              let contentUri = null
              if ('image' == type.toLowerCase()) {
                contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
              } else if ('video' == type.toLowerCase()) {
                contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI
              } else if ('audio' == type.toLowerCase()) {
                contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
              }
              let selection = '_id=?'
              let selectionArgs = [split[1]]
              return getDataColumn(context, contentUri, selection, selectionArgs)
            }
          }
          // MediaStore (and general)
          else if ('content' == scheme) {
            return getDataColumn(context, uri, null, null)
          }
          // File
          else if ('file' == scheme) {
            return uri.getPath()
          }
        }
        // 4.4 以下 获取 绝对路径
        function getRealPathFromURI(uri) {
          let res = null
          let proj = [MediaStore.Images.Media.DATA]
          let cursor = contentResolver.query(uri, proj, null, null, null)
          if (null != cursor && cursor.moveToFirst()) {
            let column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
            res = cursor.getString(column_index)
            cursor.close()
          }
          return res
        }
        // 通过uri 查找出绝对路径
        function getDataColumn(context, uri, selection, selectionArgs) {
          let cursor = null
          let column = '_data'
          let projection = [column]
          // let contentResolver = context.getContentResolver()
          // plus.android.importClass(contentResolver);
          cursor = contentResolver.query(uri, projection, selection, selectionArgs, null)
          if (cursor != null && cursor.moveToFirst()) {
            let column_index = cursor.getColumnIndexOrThrow(column)
            return cursor.getString(column_index)
          }
        }

        function isExternalStorageDocument(uri) {
          return 'com.android.externalstorage.documents' == uri.getAuthority() ? true : false
        }

        function isDownloadsDocument(uri) {
          return 'com.android.providers.downloads.documents' == uri.getAuthority() ? true : false
        }

        function isMediaDocument(uri) {
          return 'com.android.providers.media.documents' == uri.getAuthority() ? true : false
        }
      }
      // #endif
      // #ifndef APP-PLUS
      uni.showModal({
        title: '提示',
        content: '仅支持Android平台',
        success: function (res) {}
      })
      // #endif
    },

    // 切换列表宫格格式
    toVisList() {
      this.visList = !this.visList
    },

    /**
     * 点击刷新目录
     */
    refresh() {
      // 手动调用下拉刷新
      uni.startPullDownRefresh()
    },

    /**
     * 检查更新
     * */
    updateBookshelf() {
      this.$store.commit('updateBookshelf', this.$getNetwork)
    },

    swipeChange(e, index) {
      console.log('返回：' + e)
      console.log('当前索引：' + index)
    },
    swipeClick(e, index) {
      console.log(e)
      console.log('返回：' + e.content.text)
      console.log('当前索引：' + index)
      if (0 == e.index) {
        //传过来的是倒序的索引，需要转变成在vuex中的索引
        this.spindex = this.bookShelf.length - 1 - index
        //选中了哪本书
        this.spbook = this.bookShelf[index]
        // 调用删除
        this.handleDelete()
      }
    },
    bookShow() {
      //刷新书架
      //得到的是倒序
      // this.bookShelf = this.$store.state.bookShelf.slice().reverse();
      if (this.bookShelf.length === 0) {
        this.visnobook = true
      } else {
        this.visnobook = false
      }
    },
    getInfo(item) {
      // 	const readIndex = item.readIndex + 1;
      // 	const readAll = item.readAll;
      // 	const readPercent = (readIndex * 100) / readAll;

      // 	return `作者：${item.author}\n读到 ${readIndex} 章 共 ${readAll} 章 ${readPercent.toFixed(2)}%`;

      if (item?.chapters[item.chapters.length - 1]?.chaptername) {
        return `最新章节：${item?.chapters[item.chapters.length - 1]?.chaptername}`
      }
      return `此书无内容，请删除此书`
    },
    getInfo1(item) {
      const readIndex = item.readIndex + 1
      const readAll = item.readAll
      const readPercent = (readIndex * 100) / readAll

      return `读到 ${readIndex} 章 共 ${readAll} 章 ${readPercent.toFixed(2)}%`
    },
    //点击了三个点
    gomenu(index) {
      //传过来的是倒序的索引，需要转变成在vuex中的索引
      this.spindex = this.bookShelf.length - 1 - index
      //选中了哪本书
      this.spbook = this.bookShelf[index]
      // 打开菜单弹窗
      this.vispopup = true
    },
    handleDelete() {
      // 处理删除事件的逻辑
      console.log('删除事件被触发')
      // 弹出确定弹窗
      this.vismodalD = true
    },
    //点击了确定删除
    confirmmodalD() {
      //找到这本书的索引并删除
      this.$store
        .dispatch('deleteBook', this.spbook.bookurl)
        .then(index => {
          if (-1 === index) {
            uni.showToast({
              title: '删除失败,书架内没有这本书',
              icon: 'none'
            })
          } else {
            //消息提示
            uni.showToast({
              title: '删除成功',
              icon: 'none'
            })
            //刷新书架
            this.bookShow()
          }
        })
        .catch(error => {
          // 异常情况的处理
          //消息提示
          uni.showToast({
            title: '删除失败,书架内没有这本书' + error,
            icon: 'none'
          })
        })

      //隐藏弹窗
      this.vismodalD = false
      //隐藏菜单
      this.vispopup = false
    },
    cancelmodalD() {
      //点击了取消
      //隐藏弹窗
      this.vismodalD = false
    },
    closemodalD() {
      //遮罩层关闭
      this.vismodalD = false
    },

    handleClearCache() {
      // 处理清除缓存事件的逻辑
      console.log('清除缓存事件被触发')
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

    handleDownload() {
      console.log('下载事件被触发')
      if (this.spbook.origin === 'local') {
        // 弹窗
        uni.showToast({
          title: '本地书籍不支持下载',
          duration: 3000,
          icon: 'none'
        })
        return
      }
      // 计算有多少章没有下载
      let count = 0
      //查找具有visD属性且值为true的元素数量
      this.spbook.chapters
        .filter(chapter => chapter.visD === true)
        .forEach(chapter => {
          count++
        })
      console.log(count)
      let time = `${((this.spbook.chapters.length - count) * 0.5).toFixed(2)}`
      this.titlemodalX = '确定要缓存全部章节吗？\n预计需要 ' + time + ' s'
      // 弹窗
      this.vismodalX = true
    },

    async confirmmodalX() {
      this.vismodalX = false

      // 确认按钮点击事件处理逻辑
      // 在这里进行下载的操作
      uni.showToast({
        title: '开始下载啦',
        icon: 'none'
      })

      const key = 'bookall' + this.spbook.bookurl
      let bookall = uni.getStorageSync(key)

      if (!bookall) {
        console.log('缓存数据为空')
        // // 走缓存中转一下，否则引用的是同一个对象
        // uni.setStorageSync(key, this.spbook);
        // // 使用同步读取！！
        // bookall = uni.getStorageSync(key);
        // bookall = JSON.parse(JSON.stringify(this.spbook));
        bookall = deepCopy(this.spbook)
        console.log(this.spbook)
        console.log(bookall)

        bookall.progress = 0
      }

      const originF = bookall.origin

      for (let i = 0; i < bookall.chapters.length; i++) {
        const chapter = bookall.chapters[i]

        if (!chapter.hasOwnProperty('text')) {
          try {
            const chapterId = chapter.chapterurl
            // const originF = this.spbook.origin;
            console.log(originF, chapterId)

            const text = await this.$getNetwork.read(originF, chapterId)
            if (-1 == text) {
              console.log('网络请求错误')
            }
            // uni.showToast({
            // 	title: '正在下载第 ' + (i + 1) + ' 章',
            // 	icon: 'none'
            // });

            //添加数据
            bookall.chapters[i]['text'] = text
            //标记为已经下载
            this.spbook.chapters[i]['visD'] = true

            if ((i + 1) % 10 === 0) {
              // 每10次执行一次逻辑
              // 缓存
              uni.setStorageSync(key, bookall)
              // 更新
              this.$store.commit('modifyBook', this.spbook)
            }

            if (bookall.chapters.length - 1 === i) {
              // 缓存
              uni.setStorageSync(key, bookall)
              // 更新
              this.$store.commit('modifyBook', this.spbook)
              uni.showToast({
                title: '全部下载完成',
                icon: 'none'
              })
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
            this.$store.commit('modifyBook', this.spbook)
          }
        }
      }
    },
    cancelmodalX() {
      // 取消按钮点击事件处理逻辑
      this.vismodalX = false
    },
    closemodalX() {
      // 弹窗关闭事件处理逻辑
      this.vismodalX = false
    },

    handleShare() {
      // 处理打开目录的逻辑
      console.log('打开目录被触发')

      uni.navigateTo({
        url: `/pages/bookChapter/bookChapter?index=${this.spindex}`
      })
    },
    /**
     * 导出文件
     */
    async handleTxt(spbook) {
      // 保存成文件
      try {
        // console.log(spbook)
        const fileName = spbook.bookname.trim() + '.txt'
        // console.log(fileName)
        const key = 'bookall' + spbook.bookurl
        // 使用同步读取
        const bookTxt = uni.getStorageSync(key)
        const jsonString = outputTxT(bookTxt)
        // console.log(jsonString);

        // return

        plus.io.requestFileSystem(
          plus.io.PUBLIC_DOWNLOADS,
          fs => {
            fs.root.getFile(
              fileName,
              {
                create: true
              },
              fileEntry => {
                fileEntry.createWriter(
                  writer => {
                    writer.write(jsonString)
                    writer.onwriteend = () => {
                      console.log('写入文件成功', fileEntry.fullPath)
                      console.log(fileEntry.toLocalURL())

                      const bookTxt = {
                        imgurl: spbook.imgurl,
                        bookname: spbook.bookname,
                        author: spbook.author,
                        toLocalURL: fileEntry.toLocalURL()
                      }

                      this.$store.commit('addBookTxts', bookTxt)

                      // fileEntry.file((file) => {
                      // 	const fileReader = new plus.io
                      // 		.FileReader();
                      // 	fileReader.onloadend = () => {
                      // 		const fileContent = fileReader
                      // 			.result;
                      // 		console.log('读取文件内容：',
                      // 			fileContent);
                      // 	};
                      // 	fileReader.readAsText(file, 'utf-8');
                      // });

                      // 弹窗提示文件保存成功
                      plus.nativeUI.confirm(
                        '文件保存成功！',
                        e => {
                          const openIndex = e.index
                          if (openIndex === 1) {
                            // 点击打开按钮
                            plus.runtime.openFile(
                              fileEntry.toLocalURL(),
                              {
                                withSystemUI: true
                              },
                              e => {
                                console.log('打开文件成功', e)
                              },
                              err => {
                                console.error('打开文件发生错误', err)
                              }
                            )
                          }
                        },
                        '提示',
                        ['确定', '打开']
                      )
                    }

                    writer.onerror = err => {
                      console.error('写入文件发生错误', err)
                      plus.nativeUI.alert('写入文件发生错误：' + JSON.stringify(err))
                    }
                  },
                  err => {
                    console.error('创建文件写入器发生错误', err)
                    plus.nativeUI.alert('创建文件写入器发生错误：' + JSON.stringify(err))
                  }
                )
              },
              err => {
                console.error('获取文件条目发生错误', err)
                plus.nativeUI.alert('获取文件条目发生错误：' + JSON.stringify(err))
              }
            )
          },
          err => {
            console.error('请求文件系统发生错误', err)
            plus.nativeUI.alert('请求文件系统发生错误：' + JSON.stringify(err))
          }
        )
      } catch (err) {
        console.error('操作文件发生错误', err)
        plus.nativeUI.alert('操作文件发生错误：' + JSON.stringify(err))
      }
    },
    //关闭菜单弹窗
    popupclose() {
      this.vispopup = false
      console.log('菜单弹窗关闭啦')
    },
    //打开了菜单弹窗
    popupopen() {
      console.log('菜单弹窗打开啦')
    },
    //点击了跳转阅读页
    goBookRead(index) {
      if (this.visMenu) {
        return
      }
      //传过来的是倒序的索引，需要转变成在vuex中的索引
      const bookShelfIndex = this.bookShelf.length - 1 - index
      const readIndex = this.bookShelf[index].readIndex
      // 阅读页面需要两个值，在书架中的索引以及点的是第几章的索引
      uni.navigateTo({
        url: `/pages/bookRead/bookRead?bookShelfIndex=${bookShelfIndex}&readIndex=${readIndex}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bar {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;

  .uni-bar {
    // border-bottom: 0.5px solid #ccc;
    background-color: #ffffff;
    // border-bottom: 1px solid #8c8c8c;
    margin-top: 30px;
    margin-left: 30rpx;
    margin-right: 35rpx;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding: 0 20rpx;

    /* 设置标题样式 */
    .uni-title {
      font-size: 20px;
      color: #2f2f2f;
      // font-weight: bold;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.index-menu {
  position: fixed;
  width: 300rpx;
  top: 80px;
  right: 8px;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 8rpx;
  border: 1px solid rgba(239, 239, 239, 0.8);
  /* 添加左下方扩散阴影 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 确保元素在其他内容之上 */
  z-index: 9999;
  /* 初始状态，假设是隐藏的，从上方偏移 */
  opacity: 0;
  transform: translateY(-10%);
  //transition: transform 0.3s ease, opacity 0.3s ease;
  /* 应用动画 */
  animation: fadeInFromTop 0.2s forwards;
  /* 清除过渡效果*/
  transition: none;

  .item {
    display: flex;
    justify-items: center;
    align-items: center;
    height: 48px;

    .item-left {
      // width: 10%;
      margin-right: 8px;
      margin-top: 2px;
    }

    .item-right {
      font-size: 16px;
      color: #333;
    }
  }
}

/* 动画关键帧 */
@keyframes fadeInFromTop {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

.yesbook {
  padding-top: 80px;

  // .book-container {
  // 	display: flex;
  // 	flex-wrap: wrap;
  // 	// justify-content: space-between;
  // 	justify-content: flex-start;
  // 	/* 从左到右排列 */
  // 	padding: 10px;
  // 	// flex-direction: row; // 从左往右排列

  // 	.cont-badge {
  // 		position: relative;
  // 		top: -97%;
  // 		margin-left: 90%;
  // 	}

  // 	.book-item {
  // 		flex: 1;
  // 		// flex-basis: 33%;
  // 		padding: 4px;
  // 		margin-bottom: 4px;
  // 		// width: 33%;
  // 		max-width: 33%;
  // 		box-sizing: border-box;
  // 		// 居中对齐
  // 		text-align: center;

  // 		.book-cover {
  // 			width: 92px;
  // 			max-width: 100%;
  // 			height: 128px;
  // 			box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
  // 			border-radius: 5px;
  // 			background-color: #efefef;
  // 		}

  // 		.book-name {
  // 			font-size: 14px;
  // 			overflow: hidden;
  // 			white-space: nowrap;
  // 			text-overflow: ellipsis;
  // 			color: #555;
  // 			text-align: center;
  // 		}

  // 	}
  // }

  .book-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
    margin: 0 5%;
    /* 创建三列，每列宽度相等 */
    grid-gap: 8px;
    /* 设置网格线之间的间距 */
  }

  .cont-badge {
    position: relative;
    top: -98%;
    margin-left: 95%;
  }

  .book-item {
    padding: 4px;
    // margin-bottom: 4px;
    max-width: 100%;
    /* 根据需要调整最大宽度 */
    box-sizing: border-box;
    text-align: center;
    display: block;
    /* 将元素设置为块元素 */
    margin-left: auto;
    /* 水平居中 */
    margin-right: auto;
  }

  .book-cover {
    width: 92px;
    max-width: 100%;
    height: 128px;
    // box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #efefef;
  }

  .book-name {
    font-size: 14px;
    color: #555;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2; // 为-webkit-line-clamp属性定义标准属性line-clamp
    /* 限制显示的行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: center;
  }

  .bookList {
    display: flex;
    // 左右排列
    justify-content: space-between;

    .listleft {
      width: 100%;
    }

    .icon {
      display: flex;
      // 水平居中
      justify-content: center;
      // 垂直居中
      align-items: center;
      width: 15%;

      .iconmin {
        height: 30px;
        margin-right: 40rpx;
      }
    }
  }
}
</style>
