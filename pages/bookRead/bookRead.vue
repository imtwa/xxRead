<!-- 搜‘根据需要更改’，需要根据实际项目更改的已经列出来了 -->
<!-- 重要事项：
	1.由于阅读页截取整行的需要，请确保文本格式和本插件中的text变量所示一致，即：！！！每一行的高度要一致！！！
	  如果要加内容，例如每一章开头加上章节名:'<h1>章节名</h1>',请确保所加的内容是单行高度的整数倍！！
	2.‘仅用于计算’的样式必须和阅读页样式一致，不然显示会有问题,
	3.字体必须是偶数，否则1.5倍行距的时候会无法截取到整行
 -->

<template>
  <view style="height: 100vh" :class="currentFontFamily">
    <!-- 仅用于计算（结构和样式请和阅读页一致） -->
    <view class="container hidden">
      <view class="chapter"> 章节名 </view>
      <view id="content" class="content">
        <view class="inner-box" :style="{ height: `${innerHeight}px` }">
          <view
            class="book-inner"
            id="preChapter"
            v-html="preChapter.text"
            :style="{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight * fontSize}px`
            }"
          >
          </view>
        </view>
      </view>
      <view class="bottom-bar"> 显示电量、页码 </view>
    </view>

    <view class="container hidden">
      <view class="chapter"> 章节名 </view>
      <view class="content">
        <view class="inner-box" :style="{ height: `${innerHeight}px` }">
          <view
            class="book-inner"
            id="curChapter"
            v-html="curChapter.text"
            :style="{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight * fontSize}px`
            }"
          >
          </view>
        </view>
      </view>
      <view class="bottom-bar"> 显示电量、页码 </view>
    </view>

    <view class="container hidden">
      <view class="chapter"> 章节名 </view>
      <view class="content">
        <view class="inner-box" :style="{ height: `${innerHeight}px` }">
          <view
            class="book-inner"
            id="nextChapter"
            v-html="nextChapter.text"
            :style="{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight * fontSize}px`
            }"
          >
          </view>
        </view>
      </view>
      <view class="bottom-bar"> 显示电量、页码 </view>
    </view>

    <!-- ************************** -->
    <!--     根据需要更改（封面）     -->
    <!-- ************************** -->
    <!-- 封面 -->
    <view
      class="cover container"
      :class="{
        container0: background === 1,
        container1: background === 2
      }"
      :style="{
        zIndex: 201,
        transform: `translate${cover.pageTranslate[turnType]}`,
        transition: `transform ${showAnimation ? turnPageTime : 0}s`,
        boxShadow: showShadow && turnType === 0 ? '0 0 10px 0 rgba(0,0,0,.4)' : '',
        background:
          background === 3
            ? `rgba(${backgroundColor.rgba.r},${backgroundColor.rgba.g},${backgroundColor.rgba.b},${backgroundColor.rgba.a})`
            : ''
      }"
      @touchstart="coverTouchStart"
      @touchend="coverTouchEnd"
      @touchmove="coverTouchMove"
      @touchcancel="coverTouchcancel"
    >
      <image
        :src="book.imgurl"
        style="border-radius: 10px; box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.5)"
      ></image>
      <view style="padding: 50rpx; font-size: 24px">
        {{ book.bookname }}
      </view>
    </view>
    <!-- ************************** -->
    <!--****************************-->
    <!-- ************************** -->

    <!-- 阅读页（结构和样式请和仅用于计算元素一致） -->
    <!-- 上一页 -->
    <view
      class="container"
      :class="{
        container0: background === 1,
        container1: background === 2
      }"
      :style="{
        zIndex: 102,
        transform: `translate${prePage.pageTranslate[turnType]}`,
        transition: `transform ${showAnimation ? turnPageTime : 0}s`,
        boxShadow: showShadow && turnType === 0 ? '0 0 10px 0 rgba(0,0,0,.4)' : '',
        background:
          background === 3
            ? `rgba(${backgroundColor.rgba.r},${backgroundColor.rgba.g},${backgroundColor.rgba.b},${backgroundColor.rgba.a})`
            : ''
      }"
    >
      <!-- 章节名 -->
      <view class="chapter">
        {{ prePage.chapterName }}
      </view>

      <!-- 外层class="content"用于计算阅读部分的高度 -->
      <view class="content">
        <!-- 内层class="inner-box"利用innerHeight将内容截取至整行，防止文字不完整的情况出现 -->
        <view class="inner-box" :style="{ height: `${innerHeight}px` }" v-if="prePage.canRead">
          <!-- 最里层class="book-inner"的用于获取文本总高度，计算总页数，注意不可以overflow:hidden -->
          <view
            class="book-inner"
            v-html="prePage.text"
            :style="{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight * fontSize}px`,
              color: `${colorList[background - 1]}`,
              transform: `translateY(-${prePage.pageNum * innerHeight}px)`
            }"
          >
          </view>
        </view>
        <view
          style="
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
          v-else
        >
          付费章节
          <view style="padding: 5px 15px; background-color: #eee">去购买</view>
        </view>
      </view>
      <view class="bottom-bar">
        <!-- 时间 -->
        <view>
          {{ systemTimeStr }}
        </view>
        <!-- 页码 -->
        <view> {{ prePage.pageNum + 1 }}/{{ prePage.totalPage }} </view>
        <!-- 电量 -->
        <view>
          <battery :level="batteryLevel" :charging="batteryState === 2"></battery>
        </view>
      </view>
    </view>

    <!-- 本页 -->
    <view
      class="container"
      :class="{
        container0: background === 1,
        container1: background === 2
      }"
      :style="{
        zIndex: 101,
        transform: `translate${curPage.pageTranslate[turnType]}`,
        transition: `transform ${showAnimation ? turnPageTime : 0}s`,
        boxShadow: showShadow && turnType === 0 ? '0 0 10px 0 rgba(0,0,0,.4)' : '',
        background:
          background === 3
            ? `rgba(${backgroundColor.rgba.r},${backgroundColor.rgba.g},${backgroundColor.rgba.b},${backgroundColor.rgba.a})`
            : ''
      }"
      @touchstart="touchStart"
      @touchend="touchEnd"
      @touchmove="touchMove"
      @touchcancel="touchcancel"
    >
      <!-- 章节名 -->
      <view class="chapter">
        {{ curPage.chapterName }}
      </view>
      <view class="content">
        <view class="inner-box" :style="{ height: `${innerHeight}px` }" v-if="curPage.canRead">
          <view
            class="book-inner"
            v-html="curPage.text"
            :style="{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight * fontSize}px`,
              color: `${colorList[background - 1]}`,
              transform: `translateY(-${curPage.pageNum * innerHeight}px)`
            }"
          >
          </view>
        </view>
        <view
          style="
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
          v-else
        >
          付费章节
          <view
            style="padding: 5px 15px; background-color: #eee"
            @touchstart.stop
            @touchmove.stop
            @touchend.stop="buyBook"
            >去购买</view
          >
        </view>
      </view>
      <view class="bottom-bar">
        <!-- 时间 -->
        <view>
          {{ systemTimeStr }}
        </view>
        <!-- 页码 -->
        <view> {{ curPage.pageNum + 1 }}/{{ curPage.totalPage }} </view>
        <!-- 电量 -->
        <view>
          <battery :level="batteryLevel" :charging="batteryState === 2"></battery>
        </view>
      </view>
    </view>

    <!-- 下一页 -->
    <view
      class="container"
      :class="{
        container0: background === 1,
        container1: background === 2
      }"
      :style="{
        zIndex: 100,
        transform: `translate${nextPage.pageTranslate[turnType]}`,
        transition: `transform ${showAnimation ? turnPageTime : 0}s`,
        boxShadow: showShadow && turnType === 0 ? '0 0 10px 0 rgba(0,0,0,.4)' : '',
        background:
          background === 3
            ? `rgba(${backgroundColor.rgba.r},${backgroundColor.rgba.g},${backgroundColor.rgba.b},${backgroundColor.rgba.a})`
            : ''
      }"
    >
      <!-- 章节名 -->
      <view class="chapter">
        {{ nextPage.chapterName }}
      </view>
      <view class="content">
        <view class="inner-box" :style="{ height: `${innerHeight}px` }" v-if="nextPage.canRead">
          <view
            class="book-inner"
            v-html="nextPage.text"
            :style="{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight * fontSize}px`,
              color: `${colorList[background - 1]}`,
              transform: `translateY(-${nextPage.pageNum * innerHeight}px)`
            }"
          >
          </view>
        </view>
        <view
          style="
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
          v-else
        >
          付费章节
          <view style="padding: 5px 15px; background-color: #eee">去购买</view>
        </view>
      </view>
      <view class="bottom-bar">
        <!-- 时间 -->
        <view>
          {{ systemTimeStr }}
        </view>
        <!-- 页码 -->
        <view> {{ nextPage.pageNum + 1 }}/{{ nextPage.totalPage }} </view>
        <!-- 电量 -->
        <view>
          <battery :level="batteryLevel" :charging="batteryState === 2"></battery>
        </view>
      </view>
    </view>

    <!-- 菜单层 -->
    <view
      class="menu"
      :style="{ height: `100%`, width: `${windowWidth}px` }"
      v-if="menuShow"
      @touchend="closeMenu"
    >
      <!-- 菜单层包含返回按钮的上半部分 -->
      <view
        class="menu-top"
        :style="{
          height: `${statusBarHeight + 40}px`,
          top: itemShow ? 0 : `-100%`
        }"
        @touchend.stop
      >
        <view :style="{ height: `${statusBarHeight}px` }"></view>
        <view class="head">
          <!-- <text class="iconfont back" @click="back">&#xe71a;</text> -->
          <u-icon
            name="arrow-left"
            size="25px"
            class="iconfont back"
            color="#fff"
            @click="back"
          ></u-icon>
          <view style="margin-bottom: 12px; font-size: 14px; color: #eee">{{ book.bookname }}</view>
        </view>
      </view>
      <!-- 菜单主体 -->
      <view class="menu-bottom" :style="{ bottom: itemShow ? 0 : '-100%' }" @touchend.stop>
        <!-- 用于显示章节进度 -->
        <view class="show-chapter" v-if="progressTouched">{{
          directoryList[chapterProgress].name
        }}</view>
        <view class="show-chapter" v-else>{{ curChapter.chapterName }}</view>

        <!-- 章节进度条 -->
        <view class="progress-box">
          <text @click="goPreChapter">上一章</text>
          <view style="flex: 1; height: 100%; padding: 8px 0">
            <slider
              :value="curChapter.chapterIndex"
              activeColor="#000"
              :block-size="20"
              :max="directoryList.length - 1"
              @changing="slideChanging"
              @change="slideChange"
            />
          </view>
          <text @click="goNextChapter">下一章</text>
        </view>
        <view class="items-box">
          <view class="item-box" @click="openDirectory">
            <!-- <text class="iconfont" style="font-size: 25px;">&#xe601;</text> -->
            <u-icon name="list" size="25px" class="iconfont" color="#efefef"></u-icon>
            <text style="font-size: 13px">目录</text>
          </view>

          <view class="item-box" @click="refreshPageData">
            <!-- <text class="iconfont" style="font-size: 25px;">&#xe61d;</text> -->
            <u-icon name="reload" size="25px" class="iconfont" color="#efefef"></u-icon>
            <text style="font-size: 13px">刷新</text>
          </view>
          <view class="item-box" v-if="background !== 1" @click="changeBackground(1)">
            <!-- <text class="iconfont" style="font-size: 25px;">&#xe64c;</text> -->
            <u-icon name="eye" size="25px" class="iconfont" color="#efefef"></u-icon>
            <text style="font-size: 13px">日间</text>
          </view>
          <view class="item-box" v-else @click="changeBackground(2)">
            <!-- <text class="iconfont" style="font-size: 25px;">&#xe63e;</text> -->
            <u-icon name="eye-off" size="25px" class="iconfont" color="#efefef"></u-icon>
            <text style="font-size: 13px">夜间</text>
          </view>
          <view class="item-box" @click="openSetting">
            <!-- <text class="iconfont" style="font-size: 25px;">&#xe61d;</text> -->
            <u-icon name="setting" size="25px" class="iconfont" color="#efefef"></u-icon>
            <text style="font-size: 13px">设置</text>
          </view>
        </view>
      </view>

      <view class="setting" :style="{ bottom: settingShow ? 0 : `-100%` }" @touchend.stop>
        <view class="item">
          <view class="item-name">字号</view>
          <view class="icon" @click="bigSize" v-if="fontSize < maxFontSize">A+</view>
          <view class="icon" style="color: #666; border: #666 solid 1px" v-else>A+</view>
          <view class="icon" @click="smallSize" v-if="fontSize > minFontSize">A-</view>
          <view class="icon" style="color: #666; border: #666 solid 1px" v-else>A-</view>
          <view class="icon" @click="changeFont(2)" v-if="simplified === 1">繁體</view>
          <view
            class="icon"
            @click="changeFont(1)"
            v-else
            style="border: #ff9900 solid 1px; color: #ff9900"
          >
            繁體
          </view>
        </view>
        <view class="item">
          <view class="item-name">字体</view>
          <view style="width: 80%">
            <u-scroll-list
              style="padding-top: 30rpx; padding-bottom: 0"
              indicatorActiveColor="#ff9900"
            >
              <view
                class="font-face fontFamily0"
                @click="FontFamily('fontFamily0')"
                :class="{ active: currentFontFamily === 'fontFamily0' }"
                style="min-width: 180rpx"
                >默认</view
              >

              <view
                class="font-face fontFamily1"
                @click="FontFamily('fontFamily1')"
                :class="{ active: currentFontFamily === 'fontFamily1' }"
                >方正新楷体</view
              >

              <view
                class="font-face fontFamily2"
                @click="FontFamily('fontFamily2')"
                :class="{ active: currentFontFamily === 'fontFamily2' }"
                >仓耳今楷04-W03</view
              >

              <view
                class="font-face fontFamily3"
                @click="FontFamily('fontFamily3')"
                :class="{ active: currentFontFamily === 'fontFamily3' }"
                >仓耳今楷05-W05</view
              >
            </u-scroll-list>
          </view>
        </view>
        <view class="item">
          <view class="item-name">排版</view>
          <view
            class="type-setting"
            :class="{ active: lineHeight === 1 }"
            @click="changeLineHeight(1)"
          >
            <view
              class="line"
              :class="{ lineActive: lineHeight === 1 }"
              v-for="i in 5"
              :key="i"
            ></view>
          </view>
          <view
            class="type-setting"
            :class="{ active: lineHeight === 2 }"
            @click="changeLineHeight(2)"
          >
            <view
              class="line"
              :class="{ lineActive: lineHeight === 2 }"
              v-for="i in 4"
              :key="i"
            ></view>
          </view>
          <view
            class="type-setting"
            :class="{ active: lineHeight === 3 }"
            @click="changeLineHeight(3)"
          >
            <view
              class="line"
              :class="{ lineActive: lineHeight === 3 }"
              v-for="i in 3"
              :key="i"
            ></view>
          </view>
        </view>
        <view class="item">
          <view class="item-name">翻页</view>
          <view
            class="icon"
            :class="{ active: turnType === 0 }"
            style="padding: 5px 8px"
            @click="changeTurnType(0)"
            >覆盖
          </view>
          <view
            class="icon"
            :class="{ active: turnType === 1 }"
            style="padding: 5px 8px"
            @click="changeTurnType(1)"
          >
            左右平移</view
          >
          <view
            class="icon"
            :class="{ active: turnType === 2 }"
            style="padding: 5px 8px"
            @click="changeTurnType(2)"
          >
            上下平移</view
          >
        </view>
        <view class="item">
          <view class="item-name">背景</view>
          <view
            class="icon"
            style="background: url(../../static/background1.jpg)"
            :class="{ active: background === 1 }"
            @click="changeBackground(1)"
          ></view>
          <view
            class="icon"
            style="background-color: #000"
            :class="{ active: background === 2 }"
            @click="changeBackground(2)"
          ></view>
          <view
            class="icon"
            :class="{ active: background === 3 }"
            :style="{
              background:
                'rgba(' +
                backgroundColor.rgba.r +
                ',' +
                backgroundColor.rgba.g +
                ',' +
                backgroundColor.rgba.b +
                ',' +
                backgroundColor.rgba.a +
                ')'
            }"
            @click="openBackgroundColor"
          >
          </view>
        </view>
      </view>

      <!-- 目录层 -->
      <view
        class="directory"
        :class="{
          container0: background === 1,
          container1: background === 2
        }"
        v-if="directoryShowBefore"
        :style="{
          left: directoryShow ? 0 : '-100%',
          color: `${colorList[background - 1]}`,
          boxShadow: '0 0 10px 0 rgba(0,0,0,.4)',
          background:
            background === 3
              ? `rgba(${backgroundColor.rgba.r},${backgroundColor.rgba.g},${backgroundColor.rgba.b},${backgroundColor.rgba.a})`
              : ''
        }"
        @touchend.stop
      >
        <view class="bookname">{{ book.bookname }}</view>
        <!--  :size="40"——每一栏高度为40px  :scrollHeight="windowHeight - 60"——书名的高度为60px -->
        <virtual-list
          :items="directoryList"
          :size="40"
          :remain="16"
          :active="curChapter.chapterIndex"
          :scrollHeight="windowHeight - 60"
        >
          <template v-slot="{ item, active }">
            <view
              class="directory-listItem"
              :class="{ active: item.index == active }"
              :style="{ color: directoryListItemColor(item.index) }"
              @click="goToChapter(item.index)"
            >
              {{ item.name }}
            </view>
          </template>
        </virtual-list>
      </view>
    </view>
    <!-- 调色盘 -->
    <t-color-picker
      ref="backgroundColorPicker"
      :color="backgroundColor.rgba"
      @confirm="confirmBackgroundColor"
    ></t-color-picker>
  </view>
</template>

<script>
import battery from '@/components/battery.vue'
import virtualList from '@/components/virtualList.vue'
import tColorPicker from '@/components/t-color-picker/t-color-picker.vue'
import { traditionalized, simplized, dateToStr, clearExcessiveRepeats } from '@/utils/utils.js'
//引入HTML 文本解析器
// import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"
// import store from "@/store/index.js"
import { deepCopy } from '@/utils/utils.js'

export default {
  components: {
    battery,
    virtualList,
    tColorPicker
  },

  data() {
    return {
      book: {},
      bookall: {},
      bookName: '我是书名',
      bookId: 0,
      history: {
        //本书历史记录
        chapterIndex: 0,
        progress: 0
      },
      text: `<p>b站up:指针原来是套娃的</p>`,
      directoryList: [], //目录列表
      currentPage: 0, //当前页
      refreshData: false, //是否刷新

      innerHeight: 0, //截取至整行的最大高度

      preChapter: {
        //上一章数据
        ready: false, //是否准备完毕
        chapterIndex: '',
        chapterName: '',
        text: '',
        totalPage: '',
        canRead: true
      },

      curChapter: {
        //本一章数据
        chapterIndex: '',
        chapterName: '',
        text: '',
        totalPage: '',
        canRead: true
      },

      nextChapter: {
        //下一章数据
        ready: false, //是否准备完毕
        chapterIndex: '',
        chapterName: '',
        text: '',
        totalPage: '',
        canRead: true
      },

      tmpChapter: {
        //暂存章节内容
        text: '',
        canRead: true
      },

      cover: {
        //封面的状态
        pageTranslate: ['', '', ''] //页面位移，三个数对应三种翻页方式
      },

      prePage: {
        //上一页数据
        ready: false, //是否准备完毕
        chapterName: '',
        text: '',
        pageNum: '',
        totalPage: 1,
        pageTranslate: ['', '', ''], //页面位移，三个数对应三种翻页方式
        canRead: true
      },

      curPage: {
        //本页数据
        ready: false, //是否准备完毕
        chapterName: '',
        text: '',
        pageNum: 1,
        totalPage: 1,
        pageTranslate: ['', '', ''], //页面位移，三个数对应三种翻页方式
        canRead: true
      },

      nextPage: {
        //下一页数据
        ready: false, //是否准备完毕
        chapterName: '',
        text: '',
        pageNum: '',
        totalPage: '',
        pageTranslate: ['', '', ''], //页面位移，三个数对应三种翻页方式
        canRead: true
      },

      next: false, //用户是否正在翻下一页
      pre: false, //用户是否正在翻上一页

      waitForNext: false, //是否正在等待下一页准备完毕后跳转
      waitForPre: false, //是否正在等待上一页准备完毕后跳转
      waitForNextChapter: false, //是否正在等待下一章准备完毕后跳转
      waitForPreChapter: false, //是否正在等待上一章准备完毕后跳转

      showAnimation: false, //是否开启动画
      showShadow: false, //是否显示页面阴影

      windowWidth: 0, //可用屏幕宽度
      windowHeight: 0, //可用屏幕高度
      contentHeight: 0, //阅读区域高度

      platform: '', //设备
      batteryState: '', //电池状态
      batteryLevel: 100, //电量
      systemTime: '', //系统时间
      systemTimeStr: '', //系统时间字符串
      statusBarHeight: 0, //状态栏高度
      pixelRatio: '', //设备像素比
      // 获取时间监听器
      IntervalTime: null,

      touchStartX: 0, // 触屏起始点x
      touchX: 0, // 瞬时触屏点x
      delta: 0, // 手指瞬时位移

      touchStartY: 0, // 触屏起始点y
      touchY: 0, // 瞬时触屏点y

      menuShow: false, //菜单栏box是否渲染
      itemShow: false, // 菜单栏动画控制
      settingShow: false, //设置栏动画控制
      directoryShow: false, //目录动画控制
      directoryShowBefore: false, // 目录渲染
      turnPageTime: 0.3, //翻页动画时间

      maxFontSize: 30, //最大字体大小，px
      minFontSize: 12, //最小字体大小，px
      turnType: 0, //翻页方式
      fontSize: '', //字体大小，
      currentFontFamily: 'fontFamily0', //字体
      simplified: '', //是否简体
      lineHeight: '', //行高，注意是fontSize的倍数
      background: '', //背景
      backgroundColor: {
        rgba: {
          r: 255,
          g: 255,
          b: 255,
          a: 255
        },
        hex: '#FFFFFF'
      }, //背景颜色
      colorList: ['#000', '#ccc', '#000'], //与背景对应的字体颜色

      chapterProgress: 0, //‘章节进度条’的参数
      progressTouched: false //是否正在点击‘章节进度条’
    }
  },
  onLoad(e) {
    //书籍对象由路由中传递的元素获取
    //传递的是bookShelfIndex和readIndex
    this.book = this.$store.state.bookShelf[e.bookShelfIndex]
    // console.log(this.book);
    // this.book.readIndex = e.readIndex
    // 将更新的红点取消
    this.$store.state.bookShelf[e.bookShelfIndex].isUpdated = false

    // 先迷惑用户
    this.getSystemInfo()
    // this.initPage()
    uni.showToast({
      title: '正在努力加载缓存ing...',
      icon: 'none'
    })

    const key = 'bookall' + this.book.bookurl
    // 使用异步读取缓存
    uni.getStorage({
      key: key,
      success: res => {
        this.bookall = res.data
        if (!this.bookall) {
          // 深拷贝 否则引用的是同一个对象
          this.bookall = deepCopy(this.book)
          this.bookall.progress = 0
        } else {
          // console.log("缓存数据不为空");
          // console.log(this.bookall);
          // 在这里处理非空情况下的逻辑
          // 如果有新更新的，将新更新的添加进来
          if (this.book.readAll > this.bookall.readAll) {
            for (let ri = this.bookall.readAll; ri < this.book.readAll; ri++) {
              // 添加新更新的章节
              const newchap = this.book.chapters[ri]
              this.bookall.chapters.push(newchap)
            }
            // 更新最大章数
            this.bookall.readAll = this.book.readAll
            // console.log("有新更新的章节");
          }
        }
      },
      fail: err => {
        // 缓存读取失败的处理逻辑
        console.error(err)
        // 深拷贝
        this.bookall = deepCopy(this.book)
        this.bookall.progress = 0
      },
      complete: res => {
        // 将这本书放到书架开头
        this.$store.commit('moveBookshelfToLast', e.bookShelfIndex)

        // 重新进行计算
        this.getSystemInfo()
        this.initPage()
      }
    })

    // 注册按键监听器，监听音量键
    plus.key.addEventListener('keydown', this.handleKeyDown)
    // 注册长按监听器，监听音量键长按
    plus.key.addEventListener('longpressed', this.handleLongpressed)

    // 设置时间监听器
    let date = new Date()
    this.systemTime = Date.parse(date)
    this.systemTimeStr = dateToStr(this.systemTime)
    // 每10S校正一次时间
    this.IntervalTime = setInterval(() => {
      // this.systemTime += 60000;
      // this.systemTimeStr = dateToStr(this.systemTime);
      let date = new Date()
      this.systemTime = Date.parse(date)
      this.systemTimeStr = dateToStr(this.systemTime)
      // console.log(this.systemTimeStr);
    }, 10000)
  },
  onShow() {},
  //组件被销毁
  onUnload() {
    // #ifdef APP-PLUS
    // 退出全屏
    plus.navigator.setFullscreen(false)
    // #endif

    // this.setStorage()
    // console.log("组件被销毁");
    // 移除按键监听器
    plus.key.removeEventListener('keydown', this.handleKeyDown)
    plus.key.removeEventListener('longpressed', this.handleLongpressed)
    // 移除监听器
    clearInterval(this.IntervalTime)
  },
  //组件被隐藏
  onHide() {
    this.setStorage()
    // console.log("组件被隐藏");
  },
  // 退出页面时的操作
  onBackPress(options) {
    this.setStorage()
    // console.log("我退出啦！更新成功");
  },
  mounted() {
    // this.initPage()
  },

  computed: {
    progress() {
      //章节的阅读进度
      if (this.curChapter.totalPage === 1) {
        return 0
      }
      return this.currentPage / (this.curChapter.totalPage - 1)
    },
    //判断是否缓存过
    directoryListItemColor() {
      return index => {
        if (this.bookall.chapters[index].hasOwnProperty('text')) {
          // 对象包含 text 属性
          return '' // 否则返回默认颜色
        } else {
          return 'gray' // 如果index为-1，则返回灰色
        }
      }
    }
  },
  methods: {
    /***
     * 打开背景取色盘
     */
    openBackgroundColor() {
      // 打开背景颜色选择器
      this.$refs.backgroundColorPicker.open()
      // 切换到第三种模式
      this.changeBackground(3)
    },

    /***
     * 背景取色盘返回值
     */
    confirmBackgroundColor(e) {
      console.log('背景颜色选择器返回值：')
      console.log(e)
      this.backgroundColor = e
      uni.setStorageSync('backgroundColor', JSON.stringify(this.backgroundColor))
    },

    /***
     * 上下音量键翻页
     */
    handleKeyDown(e) {
      // console.log(e);
      //监控音量键并且不弹出音量加减动画
      //启用动画 不设置阴影
      this.showAnimation = true
      this.showShadow = false
      // console.log(e);
      if (24 === e.keyCode) {
        // 音量+ 上一页
        // console.log("音量加，上一页");
        this.goPrePage()
      } else if (25 === e.keyCode) {
        // 音量- 下一页
        // console.log("音量减，下一页");
        this.goNextPage()
      }
      this.next = false
      this.pre = false
    },

    /***
     * 长按上下音量键翻页
     */
    handleLongpressed(e) {
      // console.log("长按了键：" + JSON.stringify(e));
      // console.log("长按了键：" + e.keyCode);
      //监控音量键并且不弹出音量加减动画
      //启用动画 不设置阴影
      this.showAnimation = true
      this.showShadow = false
      if (24 === e.keyCode) {
        // 音量+ 上一页
        this.goPrePage()
      } else if (25 === e.keyCode) {
        // 音量- 下一页
        this.goNextPage()
      }
      this.next = false
      this.pre = false
    },

    setStorage() {
      // let history = uni.getStorageSync('history')
      // if (typeof history !== 'object') {
      // 	history = []
      // }
      // let have = false
      // history.forEach((value) => {
      // 	if (value.bookId === this.bookId) {
      // 		have = true
      // 		value.chapterIndex = this.curChapter.chapterIndex
      // 		value.progress = this.progress
      // 	}
      // })
      // if (!have) {
      // 	history.push({
      // 		bookId: this.bookId,
      // 		chapterIndex: this.curChapter.chapterIndex,
      // 		progress: this.progress
      // 	})
      // }
      // uni.setStorageSync('history', history)

      // 读到了这里
      this.book.readIndex = this.curChapter.chapterIndex
      this.bookall.readIndex = this.curChapter.chapterIndex
      this.bookall.progress = this.progress
      // 更新
      this.$store.commit('modifyBook', this.book)
      // 缓存小说数据
      const key = 'bookall' + this.book.bookurl

      uni.setStorage({
        key: key,
        data: this.bookall,
        success: function () {
          console.log('缓存小说全部数据成功')
        }
      })
    },

    /**
     * 返回上一页面
     **/
    back() {
      uni.navigateBack()
    },

    /**
     * 获取设备信息
     **/
    getSystemInfo() {
      const { windowWidth, windowHeight, statusBarHeight, platform, pixelRatio } =
        uni.getSystemInfoSync()
      //获取一些必要的设备参数
      this.statusBarHeight = statusBarHeight
      this.windowWidth = windowWidth
      this.windowHeight = windowHeight
      this.pixelRatio = pixelRatio
      this.platform = platform
      // #ifdef APP-PLUS
      // 全屏
      plus.navigator.setFullscreen(true)
      // 取消ios左滑返回
      let page = this.$mp.page.$getAppWebview()
      page.setStyle({
        popGesture: 'none'
      })

      if (this.platform === 'ios') {
        // 获取ios电量
        let UIDevice = plus.ios.import('UIDevice')
        let dev = UIDevice.currentDevice()
        if (!dev.isBatteryMonitoringEnabled()) {
          dev.setBatteryMonitoringEnabled(true)
        }
        setInterval(() => {
          this.batteryState = dev.batteryState()
          this.batteryLevel = dev.batteryLevel() * 100
        }, 1000)
      } else {
        // 获取安卓电量
        let main = plus.android.runtimeMainActivity()
        let Intent = plus.android.importClass('android.content.Intent')
        let recevier = plus.android.implements(
          'io.dcloud.feature.internal.reflect.BroadcastReceiver',
          {
            onReceive: (context, intent) => {
              let action = intent.getAction()
              if (action == Intent.ACTION_BATTERY_CHANGED) {
                this.batteryState = intent.getIntExtra('status', 0) //电池状态
                this.batteryLevel = intent.getIntExtra('level', 0) //电量
              }
            }
          }
        )
        let IntentFilter = plus.android.importClass('android.content.IntentFilter')
        let filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        main.registerReceiver(recevier, filter)
      }

      // #endif

      // // 设置时间
      // let date = new Date();
      // this.systemTime = Date.parse(date);
      // this.systemTimeStr = dateToStr(this.systemTime);
      // // 每半分钟校正一次时间
      // this.IntervalTime = setInterval(() => {
      // 	// this.systemTime += 60000;
      // 	// this.systemTimeStr = dateToStr(this.systemTime);
      // 	let date = new Date();
      // 	this.systemTime = Date.parse(date);
      // 	this.systemTimeStr = dateToStr(this.systemTime);
      // 	console.log(this.systemTimeStr);
      // }, 10000)

      // 获取字体、排版等信息

      /*****************************************/
      /**********    根据需要更改    ************/
      /*****************************************/

      //可能缓存在前端可能从后端拿，如果是异步注意同步处理
      this.fontSize = uni.getStorageSync('fontSize')
      if (typeof this.fontSize !== 'number') {
        this.fontSize = 18
      }
      this.simplified = uni.getStorageSync('simplified')
      if (typeof this.simplified !== 'number') {
        this.simplified = 1
      }
      this.lineHeight = uni.getStorageSync('lineHeight')
      if (typeof this.lineHeight !== 'number') {
        this.lineHeight = 2
      }
      this.background = uni.getStorageSync('background')
      if (typeof this.background !== 'number') {
        this.background = 1
      }
      this.turnType = uni.getStorageSync('turnType')
      if (typeof this.turnType !== 'number') {
        this.turnType = 0
      }
      this.currentFontFamily = uni.getStorageSync('currentFontFamily')
      if (typeof this.currentFontFamily !== 'string' || this.currentFontFamily.length === 0) {
        this.currentFontFamily = 'fontFamily0'
      }
      this.backgroundColor = uni.getStorageSync('backgroundColor')
      if (typeof this.backgroundColor !== 'string' || this.backgroundColor.length === 0) {
        this.backgroundColor = {
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 255
          },
          hex: '#FFFFFF'
        }
      } else {
        // 字符串转换成对象
        this.backgroundColor = JSON.parse(this.backgroundColor)
      }

      // let history = uni.getStorageSync('history')
      // if (typeof history !== 'object') {
      // 	history = []
      // }
      // history.forEach((value) => {
      // 	if (value.bookId === this.bookId) {
      // 		this.history = value
      // 	}
      // })

      // 找到看到了第几章的第几页
      this.history = {
        chapterIndex: this.book.readIndex,
        progress: this.bookall.progress
      }

      /*****************************************/
      /*****************************************/
      /*****************************************/
    },

    /**
     * 获取数据并计算页面
     **/
    async initPage() {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      this.cover.pageTranslate = [
        `(${-this.windowWidth}px,0)`,
        `(${-this.windowWidth}px,0)`,
        `(0,${-this.windowHeight}px)`
      ]
      await this.calcHeight()
      await this.getDirectoryList()

      if (this.history.chapterIndex > this.directoryList.length - 1 || !this.history.chapterIndex) {
        this.history.chapterIndex = 0
      }

      await this.getThreeChapter(this.history.chapterIndex)
      let page = Math.floor((this.curChapter.totalPage - 1) * this.history.progress)
      this.goToPage(page)
      uni.hideLoading()
    },

    /**
     * 计算innerHeight，用于截取至整行
     **/
    calcHeight() {
      if (this.contentHeight) {
        let lineHeight = this.fontSize * this.lineHeight
        // #ifdef APP-PLUS || MP-WEIXIN
        lineHeight = Math.floor(lineHeight * this.pixelRatio) / this.pixelRatio
        // #endif
        let lineNum = Math.floor(
          (this.contentHeight + Math.floor((lineHeight - this.fontSize) / 2)) / lineHeight
        )
        this.innerHeight = lineNum * lineHeight
      } else {
        return new Promise((resolve, reject) => {
          this.$nextTick(() => {
            const query = uni.createSelectorQuery().in(this)
            query
              .select('#content')
              .boundingClientRect(data => {
                let height = data.height
                this.contentHeight = height
                let lineHeight = this.fontSize * this.lineHeight

                // #ifdef APP-PLUS || MP-WEIXIN
                lineHeight = Math.floor(lineHeight * this.pixelRatio) / this.pixelRatio
                // #endif
                let lineNum = Math.floor(
                  (height + Math.floor((lineHeight - this.fontSize) / 2)) / lineHeight
                )
                this.innerHeight = lineNum * lineHeight
                resolve()
              })
              .exec()
          })
        })
      }
    },

    /**
     * 计算本章页数
     **/
    calcCurChapter() {
      return new Promise((resolve, reject) => {
        // 此处setTimeout 100ms是为了确保元素渲染完毕从而获取正确高度，如果遇到页面页数计算不正确的情况可以增加时间试试看
        setTimeout(() => {
          const query = uni.createSelectorQuery().in(this)
          query
            .select('#curChapter')
            .boundingClientRect(data => {
              let height = data.height
              // #ifdef APP-PLUS || MP-WEIXIN

              height = Math.round(height * this.pixelRatio) / this.pixelRatio
              // #endif
              this.curChapter.totalPage = Math.ceil(height / this.innerHeight) || 1
              this.curChapter.ready = true //章节准备完毕
              resolve()
            })
            .exec()
        }, 100)
      })
    },

    /**
     * 计算上一章页数,并翻页（如果有）
     **/
    calcPreChapter() {
      return new Promise((resolve, reject) => {
        // 此处setTimeout 100ms是为了确保元素渲染完毕从而获取正确高度，如果遇到页面页数计算不正确的情况可以增加时间试试看
        setTimeout(() => {
          const query = uni.createSelectorQuery().in(this)
          query
            .select('#preChapter')
            .boundingClientRect(data => {
              let height = data.height
              // #ifdef APP-PLUS || MP-WEIXIN
              height = Math.round(height * this.pixelRatio) / this.pixelRatio
              // #endif
              this.preChapter.totalPage = Math.ceil(height / this.innerHeight) || 1
              this.preChapter.ready = true //章节准备完毕
              if (this.waitForPre) {
                //发生在用户翻至上一章，但是上一章数据未准备完毕时
                uni.hideLoading() //把loading关掉
                this.waitForPre = false
                //页面准备完毕
                this.goPrePage()
              }
              if (this.waitForPreChapter) {
                uni.hideLoading()
                this.waitForPreChapter = false
                this.goPreChapter()
              }
              resolve()
            })
            .exec()
        }, 100)
      })
    },

    /**
     * 计算下一章页数,并翻页（如果有）
     **/
    calcNextChapter() {
      return new Promise((resolve, reject) => {
        // 此处setTimeout 100ms是为了确保元素渲染完毕从而获取正确高度，如果遇到页面页数计算不正确的情况可以增加时间试试看
        setTimeout(() => {
          const query = uni.createSelectorQuery().in(this)
          query
            .select('#nextChapter')
            .boundingClientRect(data => {
              let height = data.height
              // #ifdef APP-PLUS || MP-WEIXIN
              height = Math.round(height * this.pixelRatio) / this.pixelRatio
              // #endif
              this.nextChapter.totalPage = Math.ceil(height / this.innerHeight) || 1
              this.nextChapter.ready = true //章节准备完毕
              if (this.waitForNext) {
                //发生在用户翻至下一章，但是下一章数据未准备完毕时
                uni.hideLoading() //把loading关掉
                this.waitForNext = false
                //页面准备完毕
                this.goNextPage()
              }
              if (this.waitForNextChapter) {
                uni.hideLoading()
                this.waitForNextChapter = false
                this.goNextChapter()
              }
              resolve()
            })
            .exec()
        }, 100)
      })
    },

    /**
     * 触摸开始（封面）
     **/
    coverTouchStart(e) {
      this.showAnimation = false //关掉动画，否则翻页会很慢
      this.touchX = e.touches[0].clientX
      this.touchStartX = e.touches[0].clientX
      this.touchY = e.touches[0].clientY
      this.touchStartY = e.touches[0].clientY
    },

    /**
     * 触摸（封面）
     **/
    coverTouchMove(e) {
      this.showShadow = true
      let delta = 0
      if (this.turnType === 0 || this.turnType === 1) {
        //翻页方式为‘覆盖’或者‘左右平移’
        delta = e.touches[0].clientX - this.touchStartX

        // 限制边界
        if (delta > this.windowWidth) {
          delta = this.windowWidth
        }
        if (delta < -this.windowWidth) {
          delta = -this.windowWidth
        }

        this.delta = e.touches[0].clientX - this.touchX
        this.touchX = e.touches[0].clientX
      } else {
        //翻页方式为‘上下平移’
        delta = e.touches[0].clientY - this.touchStartY

        // 限制边界
        if (delta > this.windowHeight) {
          delta = this.windowHeight
        }
        if (delta < -this.windowHeight) {
          delta = -this.windowHeight
        }

        this.delta = e.touches[0].clientY - this.touchY
        this.touchY = e.touches[0].clientY
      }

      if (this.next) {
        //首次翻下一页之后

        // 限制边界
        if (delta > 0) {
          delta = 0
        }

        this.cover.pageTranslate = [`(${delta}px,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
        this.curPage.pageTranslate = [
          `(0,0)`,
          `(${this.windowWidth + delta}px,0)`,
          `(0,${this.windowHeight + delta}px)`
        ]
      }
      if (!this.pre && !this.next && delta < 0) {
        //首次翻下一页
        this.next = true
        this.cover.pageTranslate = [`(${delta}px,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
        this.curPage.pageTranslate = [
          `(0,0)`,
          `(${this.windowWidth + delta}px,0)`,
          `(0,${this.windowHeight + delta}px,)`
        ]
      }
      if (this.pre) {
        //首次右滑后，由于是封面不做任何操作
        return
      }
      if (!this.pre && !this.next && delta > 0) {
        //首次右滑
        this.pre = true
        uni.showToast({
          title: '已经是第一页了',
          icon: 'none'
        })
      }
    },

    /**
     * 触摸结束（封面）
     **/
    coverTouchEnd(e) {
      this.showAnimation = true
      this.showShadow = false
      let delta = 0
      if (this.turnType === 0 || this.turnType === 1) {
        //翻页方式为‘覆盖’或者‘左右平移’
        delta = e.changedTouches[0].clientX - this.touchStartX
      } else {
        //翻页方式为‘上下平移’
        delta = e.changedTouches[0].clientY - this.touchStartY
      }
      if (delta === 0) {
        if (e.changedTouches[0].clientX < this.windowWidth / 3) {
          //点击屏幕左1/3为上一页
          uni.showToast({
            title: '已经是第一页了',
            icon: 'none'
          })
        } else if (e.changedTouches[0].clientX > (this.windowWidth / 3) * 2) {
          //点击屏幕右1/3为下一页
          this.cover.pageTranslate = [
            `(${-this.windowWidth}px,0)`,
            `(${-this.windowWidth}px,0)`,
            `(0,${-this.windowHeight}px)`
          ]
          this.curPage.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
        } else if (
          e.changedTouches[0].clientX <= (this.windowWidth / 3) * 2 &&
          e.changedTouches[0].clientX >= this.windowWidth / 3
        ) {
          //点击屏幕中间1/3为呼出菜单
          this.showMenu()
        }
      } else {
        if (this.next && this.delta <= 0) {
          //下一页
          this.cover.pageTranslate = [
            `(${-this.windowWidth}px,0)`,
            `(${-this.windowWidth}px,0)`,
            `(0,${-this.windowHeight}px)`
          ]
          this.curPage.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
        } else if (this.next && this.delta > 0) {
          //取消翻页
          this.cover.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
          this.curPage.pageTranslate = [
            `(0,0)`,
            `(${this.windowWidth}px,0)`,
            `(0,${this.windowHeight}px)`
          ]
        }
      }
      this.next = false
      this.pre = false
    },

    /**
     * 触摸取消（封面）
     **/
    coverTouchcancel() {
      // 取消翻页
      this.showAnimation = false
      this.showShadow = false
      this.cover.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
      this.curPage.pageTranslate = [
        `(0,0)`,
        `(${this.windowWidth}px,0)`,
        `(0,${this.windowHeight}px)`
      ]
      this.next = false
      this.pre = false
    },

    /**
     * 触摸开始
     **/
    touchStart(e) {
      this.showAnimation = false
      this.touchX = e.touches[0].clientX
      this.touchStartX = e.touches[0].clientX
      this.touchY = e.touches[0].clientY
      this.touchStartY = e.touches[0].clientY
    },

    /**
     * 触摸
     **/
    touchMove(e) {
      this.showShadow = true
      let delta = 0
      if (this.turnType === 0 || this.turnType === 1) {
        //翻页方式为‘覆盖’或者‘左右平移’
        delta = e.touches[0].clientX - this.touchStartX

        // 限制边界
        if (delta > this.windowWidth) {
          delta = this.windowWidth
        }
        if (delta < -this.windowWidth) {
          delta = -this.windowWidth
        }

        this.delta = e.touches[0].clientX - this.touchX
        this.touchX = e.touches[0].clientX
      } else {
        //翻页方式为‘上下平移’
        delta = e.touches[0].clientY - this.touchStartY

        // 限制边界
        if (delta > this.windowHeight) {
          delta = this.windowHeight
        }
        if (delta < -this.windowHeight) {
          delta = -this.windowHeight
        }

        this.delta = e.touches[0].clientY - this.touchY
        this.touchY = e.touches[0].clientY
      }

      if (this.next && this.nextPage.ready) {
        //首次翻下一页之后
        if (this.nextPage.isEnd) {
          return
        }

        // 限制边界
        if (delta > 0) {
          delta = 0
        }

        this.prePage.pageTranslate = [
          `(${-this.windowWidth}px,0)`,
          `(${-this.windowWidth + delta}px,0)`,
          `(0,${-this.windowHeight + delta}px)`
        ]
        this.curPage.pageTranslate = [`(${delta}px,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
        this.nextPage.pageTranslate = [
          `(0,0)`,
          `(${this.windowWidth + delta}px,0)`,
          `(0,${this.windowHeight + delta}px)`
        ]
      }
      if (!this.pre && !this.next && delta < 0) {
        //首次翻下一页
        this.next = true
        if (this.nextPage.ready) {
          //页面准备好了
          if (this.nextPage.isEnd) {
            /*****************************************/
            /**********    根据需要更改    ************/
            /*****************************************/
            // uni.showToast({
            // 	title: '跳转推荐页',
            // 	icon: 'none'
            // })
            /*****************************************/
            /*****************************************/
            /*****************************************/
          } else {
            this.prePage.pageTranslate = [
              `(${-this.windowWidth}px,0)`,
              `(${-this.windowWidth + delta}px,0)`,
              `(0,${-this.windowHeight + delta}px)`
            ]
            this.curPage.pageTranslate = [`(${delta}px,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
            this.nextPage.pageTranslate = [
              `(0,0)`,
              `(${this.windowWidth + delta}px,0)`,
              `(0,${this.windowHeight + delta}px)`
            ]
          }
        } else if (this.nextChapter.ready) {
          //下一章已经准备好了
          this.nextPage = {
            ready: this.nextChapter.ready,
            chapterName: this.nextChapter.chapterName,
            text: this.nextChapter.text,
            pageNum: 0,
            totalPage: this.nextChapter.totalPage,
            pageTranslate: [`(0,0)`, `(${this.windowWidth}px,0)`, `(0,${this.windowHeight}px)`],
            canRead: this.nextChapter.canRead
          }
          this.prePage.pageTranslate = [
            `(${-this.windowWidth}px,0)`,
            `(${-this.windowWidth + delta}px,0)`,
            `(0,${-this.windowHeight + delta}px)`
          ]
          this.curPage.pageTranslate = [`(${delta}px,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
          this.nextPage.pageTranslate = [
            `(0,0)`,
            `(${this.windowWidth + delta}px,0)`,
            `(0,${this.windowHeight + delta}px)`
          ]
        }
      }
      if (this.pre && this.prePage.ready) {
        //首次翻上一页之后

        // 限制边界
        if (delta < 0) {
          delta = 0
        }

        if (this.prePage.isCover) {
          //上一页是封面

          this.cover.pageTranslate = [
            `(${-this.windowWidth + delta}px,0)`,
            `(${-this.windowWidth + delta}px,0)`,
            `(0,${-this.windowHeight + delta}px)`
          ]
          this.curPage.pageTranslate = [`(0,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
        } else {
          this.prePage.pageTranslate = [
            `(${-this.windowWidth + delta}px,0)`,
            `(${-this.windowWidth + delta}px,0)`,
            `(0,${-this.windowHeight + delta}px)`
          ]
          this.curPage.pageTranslate = [`(0,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
          this.nextPage.pageTranslate = [
            `(0,0)`,
            `(${this.windowWidth + delta}px,0)`,
            `(0,${this.windowHeight + delta}px)`
          ]
        }
      }
      if (!this.pre && !this.next && delta > 0) {
        //首次翻上一页

        this.pre = true
        if (this.prePage.ready) {
          //页面准备好了
          if (this.prePage.isCover) {
            //上一页是封面

            this.cover.pageTranslate = [
              `(${-this.windowWidth + delta}px,0)`,
              `(${-this.windowWidth + delta}px,0)`,
              `(0,${-this.windowHeight + delta}px)`
            ]
            this.curPage.pageTranslate = [`(0,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
          } else {
            this.prePage.pageTranslate = [
              `(${-this.windowWidth + delta}px,0)`,
              `(${-this.windowWidth + delta}px,0)`,
              `(0,${-this.windowHeight + delta}px)`
            ]
            this.curPage.pageTranslate = [`(0,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
            this.nextPage.pageTranslate = [
              `(0,0)`,
              `(${this.windowWidth + delta}px,0)`,
              `(0,${this.windowHeight + delta}px)`
            ]
          }
        } else if (this.preChapter.ready) {
          //上一章已经准备好了
          this.prePage = {
            ready: this.preChapter.ready,
            chapterName: this.preChapter.chapterName,
            text: this.preChapter.text,
            pageNum: this.preChapter.totalPage - 1,
            totalPage: this.preChapter.totalPage,
            pageTranslate: [
              `(${-this.windowWidth}px,0)`,
              `(${-this.windowWidth}px,0)`,
              `(0,${-this.windowHeight}px)`
            ],
            canRead: this.preChapter.canRead
          }
          this.prePage.pageTranslate = [
            `(${-this.windowWidth + delta}px,0)`,
            `(${-this.windowWidth + delta}px,0)`,
            `(0,${-this.windowHeight + delta}px)`
          ]
          this.curPage.pageTranslate = [`(0,0)`, `(${delta}px,0)`, `(0,${delta}px)`]
          this.nextPage.pageTranslate = [
            `(0,0)`,
            `(${this.windowWidth + delta}px,0)`,
            `(0,${this.windowHeight + delta}px)`
          ]
        }
      }
    },

    /**
     * 触摸结束
     **/
    touchEnd(e) {
      // console.log("结束");
      this.showAnimation = true
      this.showShadow = false
      let delta = 0
      if (this.turnType === 0 || this.turnType === 1) {
        delta = e.changedTouches[0].clientX - this.touchStartX
      } else {
        delta = e.changedTouches[0].clientY - this.touchStartY
      }
      if (delta < 0.8 && delta > -0.8) {
        //部分手机点击屏幕时无法做到delta===0
        if (e.changedTouches[0].clientX < this.windowWidth / 3) {
          //点击屏幕左1/3为上一页
          this.goPrePage()
        } else if (e.changedTouches[0].clientX > (this.windowWidth / 3) * 2) {
          //点击屏幕右1/3为下一页
          this.goNextPage()
        } else if (
          e.changedTouches[0].clientX <= (this.windowWidth / 3) * 2 &&
          e.changedTouches[0].clientX >= this.windowWidth / 3
        ) {
          //点击屏幕中间1/3为呼出菜单
          this.showMenu()
        }
      } else {
        if (this.next && this.delta <= 0) {
          //下一页
          this.goNextPage()
        } else if (this.next && this.delta > 0) {
          //取消翻页
          this.prePage.pageTranslate = [
            `(${-this.windowWidth}px,0)`,
            `(${-this.windowWidth}px,0)`,
            `(0,${-this.windowHeight}px)`
          ]
          this.curPage.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
          this.nextPage.pageTranslate = [
            `(0,0)`,
            `(${this.windowWidth}px,0)`,
            `(0,${this.windowHeight}px)`
          ]
        } else if (this.pre && this.delta >= 0) {
          //上一页
          this.goPrePage()
        } else if (this.pre && this.delta < 0) {
          //取消翻页
          this.prePage.pageTranslate = [
            `(${-this.windowWidth}px,0)`,
            `(${-this.windowWidth}px,0)`,
            `(0,${-this.windowHeight}px)`
          ]
          this.curPage.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
          this.nextPage.pageTranslate = [
            `(0,0)`,
            `(${this.windowWidth}px,0)`,
            `(0,${this.windowHeight}px)`
          ]
          this.cover.pageTranslate = [
            `(${-this.windowWidth}px,0)`,
            `(${-this.windowWidth}px,0)`,
            `(0,${-this.windowHeight}px)`
          ]
        }
      }
      this.next = false
      this.pre = false
    },

    /**
     * 取消触摸
     **/
    touchcancel() {
      //取消翻页,重置页面
      this.showAnimation = false
      this.showShadow = false
      this.prePage.pageTranslate = [
        `(${-this.windowWidth}px,0)`,
        `(${-this.windowWidth}px,0)`,
        `(0,${-this.windowHeight}px)`
      ]
      this.curPage.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
      this.nextPage.pageTranslate = [
        `(0,0)`,
        `(${this.windowWidth}px,0)`,
        `(0,${this.windowHeight}px)`
      ]
      this.cover.pageTranslate = [
        `(${-this.windowWidth}px,0)`,
        `(${-this.windowWidth}px,0)`,
        `(0,${-this.windowHeight}px)`
      ]
      this.next = false
      this.pre = false
    },

    /**
     * 呼出菜单
     **/
    showMenu() {
      // #ifdef APP-PLUS
      plus.navigator.setFullscreen(false)
      // #endif
      this.menuShow = true
      setTimeout(() => {
        this.itemShow = true
      }, 100)
    },

    /**
     * 关闭菜单
     **/
    closeMenu() {
      // #ifdef APP-PLUS
      plus.navigator.setFullscreen(true)
      // #endif
      this.itemShow = false
      this.settingShow = false
      this.directoryShow = false
      setTimeout(() => {
        this.directoryShowBefore = false
        this.menuShow = false
      }, 300)
    },

    /**
     * 重新加载，刷新数据
     **/
    async refreshPageData() {
      // 启用刷新
      this.refreshData = true
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      //获取三页数据
      await this.getThreeChapter(this.curChapter.chapterIndex)
      // // 取消加载
      // uni.hideLoading()
      // 跳转到第一页
      this.goToPage(0)
    },

    /**
     * 关闭菜单栏，呼出设置栏
     **/
    openSetting() {
      this.itemShow = false
      setTimeout(() => {
        this.settingShow = true
      }, 300)
    },

    /**
     * 关闭菜单栏，呼出目录栏
     **/
    openDirectory() {
      // #ifdef APP-PLUS
      plus.navigator.setFullscreen(true)
      // #endif
      this.itemShow = false
      this.directoryShowBefore = true
      setTimeout(() => {
        this.directoryShow = true
      }, 300)
    },

    /**
     * 拖动进度条
     **/
    slideChanging(e) {
      this.progressTouched = true
      this.chapterProgress = e.detail.value
    },

    /**
     * 结束拖动进度条
     **/
    async slideChange(e) {
      this.chapterProgress = e.detail.value
      uni.showLoading({
        title: '加载中'
      })
      await this.getThreeChapter(e.detail.value)
      this.progressTouched = false
      this.goToPage(0)
      uni.hideLoading()
    },

    /**
     * 上一页,页面轮换
     **/
    goPrePage() {
      if (this.prePage.isCover) {
        //如果是首页
        this.cover.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
        this.curPage.pageTranslate = [
          `(0,0)`,
          `(${this.windowWidth}px,0)`,
          `(0,${this.windowHeight}px)`
        ]
        return
      }
      if (!this.prePage.ready && !this.preChapter.ready) {
        this.waitForPre = true
        uni.showLoading({
          title: '正在准备上一章',
          mask: true
        })
        return
      }
      let showChapter = false
      this.currentPage -= 1
      if (this.currentPage === -1) {
        //翻至上一章了
        showChapter = true
        this.currentPage = this.preChapter.totalPage - 1
        this.chapterRotate('pre')
      }

      let cur = [].concat(this.curPage.pageTranslate)
      let pre = [].concat(this.prePage.pageTranslate)
      this.goToPage(this.currentPage)
      this.prePage.pageTranslate = [
        `(${-this.windowWidth}px,0)`,
        `(${-this.windowWidth}px,0)`,
        `(0,${-this.windowHeight}px)`
      ]
      this.curPage.pageTranslate = pre
      this.nextPage.pageTranslate = cur
      setTimeout(() => {
        if (showChapter) {
          // 弹出本章标题
          // uni.showToast({
          // 	title: this.curChapter.chapterName,
          // 	icon: 'none'
          // })
        }
        this.showAnimation = true
        this.prePage.pageTranslate = [
          `(${-this.windowWidth}px,0)`,
          `(${-this.windowWidth}px,0)`,
          `(0,${-this.windowHeight}px)`
        ]
        this.curPage.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
        this.nextPage.pageTranslate = [
          `(0,0)`,
          `(${this.windowWidth}px,0)`,
          `(0,${this.windowHeight}px)`
        ]
      }, 50)
    },

    /**
     * 下一页,页面轮换
     **/
    goNextPage() {
      if (this.nextPage.isEnd) {
        //如果翻至本书末尾

        /*****************************************/
        /**********    根据需要更改    ************/
        /*****************************************/
        uni.showToast({
          title: '后面没有啦',
          icon: 'none'
        })
        /*****************************************/
        /*****************************************/
        /*****************************************/
        return
      }
      if (!this.nextPage.ready && !this.nextChapter.ready) {
        this.waitForNext = true
        uni.showLoading({
          title: '正在准备下一章',
          mask: true
        })
        return
      }
      this.currentPage += 1
      let showChapter = false
      if (this.currentPage === this.curChapter.totalPage) {
        //翻至下一章了
        showChapter = true
        this.currentPage = 0
        this.chapterRotate('next')
      }

      let cur = [].concat(this.curPage.pageTranslate)
      let next = [].concat(this.nextPage.pageTranslate)
      this.goToPage(this.currentPage)
      this.prePage.pageTranslate = cur
      this.curPage.pageTranslate = next
      this.nextPage.pageTranslate = [
        `(0,0)`,
        `(${this.windowWidth}px,0)`,
        `(0,${this.windowHeight}px)`
      ]
      setTimeout(() => {
        if (showChapter) {
          // uni.showToast({
          // 	title: this.curChapter.chapterName,
          // 	icon: 'none'
          // })
        }
        this.showAnimation = true
        this.prePage.pageTranslate = [
          `(${-this.windowWidth}px,0)`,
          `(${-this.windowWidth}px,0)`,
          `(0,${-this.windowHeight}px)`
        ]
        this.curPage.pageTranslate = [`(0,0)`, `(0,0)`, `(0,0)`]
        this.nextPage.pageTranslate = [
          `(0,0)`,
          `(${this.windowWidth}px,0)`,
          `(0,${this.windowHeight}px)`
        ]
      }, 50)
    },

    /**
     * 章节轮换
     **/
    async chapterRotate(type) {
      if (type === 'next') {
        this.preChapter = Object.assign({}, this.curChapter)
        this.curChapter = Object.assign({}, this.nextChapter)
        if (this.curChapter.chapterIndex !== this.directoryList.length - 1) {
          //最后一章是根据目录列表长度判断
          this.nextChapter = {
            ready: false,
            chapterIndex: this.curChapter.chapterIndex + 1,
            chapterName: this.directoryList[this.curChapter.chapterIndex + 1].name
          }
          await this.getOneChapter(this.directoryList[this.curChapter.chapterIndex + 1].chapterId)
          this.$set(this.nextChapter, 'text', this.tmpChapter.text)
          this.$set(this.nextChapter, 'canRead', this.tmpChapter.canRead)
          this.calcNextChapter()
        } else {
          this.nextChapter = {
            ready: true,
            isEnd: true
          }
        }
      }
      if (type === 'pre') {
        this.nextChapter = Object.assign({}, this.curChapter)
        this.curChapter = Object.assign({}, this.preChapter)
        if (this.curChapter.chapterIndex !== 0) {
          this.preChapter = {
            ready: false,
            chapterIndex: this.curChapter.chapterIndex - 1,
            chapterName: this.directoryList[this.curChapter.chapterIndex - 1].name
          }
          await this.getOneChapter(this.directoryList[this.curChapter.chapterIndex - 1].chapterId)
          this.$set(this.preChapter, 'text', this.tmpChapter.text)
          this.$set(this.preChapter, 'canRead', this.tmpChapter.canRead)
          this.calcPreChapter()
        } else {
          this.preChapter = {
            ready: true,
            isCover: true
          }
        }
      }
    },

    /**
     * 跳转下一章
     **/
    goNextChapter() {
      if (this.curChapter.chapterIndex === this.directoryList.length - 1) {
        uni.showToast({
          title: '已经是最后一章了',
          icon: 'none'
        })
        return
      }
      if (this.waitForNext || this.waitForPre) {
        return
      }
      if (this.nextChapter.ready) {
        this.chapterRotate('next')
        this.goToPage(0)
      } else {
        uni.showLoading({
          title: '正在准备下一章'
        })
        this.waitForNextChapter = true
      }
    },

    /**
     * 跳转上一章
     **/
    goPreChapter(page) {
      if (this.curChapter.chapterIndex === 0) {
        uni.showToast({
          title: '这是第一章',
          icon: 'none'
        })
        return
      }
      if (this.waitForNext || this.waitForPre) {
        return
      }
      if (this.preChapter.ready) {
        this.chapterRotate('pre')
        this.goToPage(0)
      } else {
        uni.showLoading({
          title: '正在准备上一章'
        })
        this.waitForPreChapter = true
      }
    },

    /**
     * 根据页码跳转
     **/
    goToPage(page) {
      this.currentPage = page
      this.showAnimation = false
      this.curPage = {
        ready: this.curChapter.ready,
        chapterName: this.curChapter.chapterName,
        text: this.curChapter.text,
        pageNum: this.currentPage,
        totalPage: this.curChapter.totalPage,
        pageTranslate: [`(0,0)`, `(0,0)`, `(0,0)`],
        canRead: this.curChapter.canRead
      }
      if (this.currentPage === 0) {
        if (this.preChapter.ready && this.preChapter.isCover) {
          //翻至封面了
          this.prePage = {
            ready: true,
            isCover: true,
            pageTranslate: [
              `(${-this.windowWidth}px,0)`,
              `(${-this.windowWidth}px,0)`,
              `(0,${-this.windowHeight}px)`
            ]
          }
        } else {
          this.prePage = {
            ready: this.preChapter.ready,
            chapterName: this.preChapter.chapterName,
            text: this.preChapter.text,
            pageNum: this.preChapter.totalPage - 1,
            totalPage: this.preChapter.totalPage,
            pageTranslate: [
              `(${-this.windowWidth}px,0)`,
              `(${-this.windowWidth}px,0)`,
              `(0,${-this.windowHeight}px)`
            ],
            canRead: this.preChapter.canRead
          }
        }
      } else {
        this.prePage = {
          ready: true,
          chapterName: this.curChapter.chapterName,
          text: this.curChapter.text,
          pageNum: this.currentPage - 1,
          totalPage: this.curChapter.totalPage,
          pageTranslate: [
            `(${-this.windowWidth}px,0)`,
            `(${-this.windowWidth}px,0)`,
            `(0,${-this.windowHeight}px)`
          ],
          canRead: this.curChapter.canRead
        }
      }
      if (this.currentPage >= this.curChapter.totalPage - 1) {
        if (this.nextChapter.ready && this.nextChapter.isEnd) {
          //翻至最后一章了
          this.nextPage = {
            ready: true,
            isEnd: true,
            pageTranslate: [`(0,0)`, `(${this.windowWidth}px,0)`, `(0,${this.windowHeight}px)`]
          }
        } else {
          this.nextPage = {
            ready: this.nextChapter.ready,
            chapterName: this.nextChapter.chapterName,
            text: this.nextChapter.text,
            pageNum: 0,
            totalPage: this.nextChapter.totalPage,
            pageTranslate: [`(0,0)`, `(${this.windowWidth}px,0)`, `(0,${this.windowHeight}px)`],
            canRead: this.nextChapter.canRead
          }
        }
      } else {
        this.nextPage = {
          ready: true,
          chapterName: this.curChapter.chapterName,
          text: this.curChapter.text,
          pageNum: this.currentPage + 1,
          totalPage: this.curChapter.totalPage,
          pageTranslate: [`(0,0)`, `(${this.windowWidth}px,0)`, `(0,${this.windowHeight}px)`],
          canRead: this.curChapter.canRead
        }
      }
    },

    /**
     * 跳转到指定章节
     **/
    async goToChapter(index) {
      this.progressTouched = false
      this.closeMenu()
      uni.showLoading({
        title: '加载中'
      })
      await this.getThreeChapter(index)
      this.goToPage(0)
      uni.hideLoading()
    },

    /**
     * 加大字体
     **/
    async bigSize() {
      let progress = this.progress //记录阅读进度用于调整字体后跳转
      this.fontSize += 2
      uni.setStorageSync('fontSize', this.fontSize)
      this.calcHeight()
      await this.calcCurChapter()
      let page = Math.floor((this.curChapter.totalPage - 1) * progress)
      this.goToPage(page)
      if (this.preChapter.ready && !this.preChapter.isCover) {
        this.preChapter.ready = false
        await this.calcPreChapter()
      }
      if (this.nextChapter.ready && !this.nextChapter.isEnd) {
        this.nextChapter.ready = false
        await this.calcNextChapter()
      }
    },

    /**
     * 缩小字体
     **/
    async smallSize() {
      let progress = this.progress
      this.fontSize -= 2
      uni.setStorageSync('fontSize', this.fontSize)
      this.calcHeight()
      await this.calcCurChapter()
      let page = Math.floor((this.curChapter.totalPage - 1) * progress)
      this.goToPage(page)
      if (this.preChapter.ready && !this.preChapter.isCover) {
        this.preChapter.ready = false
        await this.calcPreChapter()
      }
      if (this.nextChapter.ready && !this.nextChapter.isEnd) {
        this.nextChapter.ready = false
        await this.calcNextChapter()
      }
    },

    /**
     * 更改字体
     **/
    FontFamily(family) {
      this.currentFontFamily = family
      uni.setStorageSync('currentFontFamily', family)
    },

    /**
     * 切换繁体简体
     **/
    changeFont(type) {
      if (type === 2) {
        //切换为繁体
        this.preChapter.text = traditionalized(this.preChapter.text)
        this.curChapter.text = traditionalized(this.curChapter.text)
        this.nextChapter.text = traditionalized(this.nextChapter.text)
        this.prePage.text = traditionalized(this.prePage.text)
        this.curPage.text = traditionalized(this.curPage.text)
        this.nextPage.text = traditionalized(this.nextPage.text)
        this.simplified = 2
        uni.setStorageSync('simplified', 2)
      } else {
        //切换为简体
        this.preChapter.text = simplized(this.preChapter.text)
        this.curChapter.text = simplized(this.curChapter.text)
        this.nextChapter.text = simplized(this.nextChapter.text)
        this.prePage.text = simplized(this.prePage.text)
        this.curPage.text = simplized(this.curPage.text)
        this.nextPage.text = simplized(this.nextPage.text)
        this.simplified = 1
        uni.setStorageSync('simplified', 1)
      }
    },

    /**
     * 改变行距
     **/
    async changeLineHeight(lineHeight) {
      let progress = this.progress
      if (lineHeight === this.lineHeight) {
        return
      } else {
        this.lineHeight = lineHeight
        uni.setStorageSync('lineHeight', this.lineHeight)
        this.calcHeight()
        await this.calcCurChapter()
        let page = Math.floor((this.curChapter.totalPage - 1) * progress)
        this.goToPage(page)
        if (this.preChapter.ready && !this.preChapter.isCover) {
          this.preChapter.ready = false
          await this.calcPreChapter()
        }
        if (this.nextChapter.ready && !this.nextChapter.isEnd) {
          this.nextChapter.ready = false
          await this.calcNextChapter()
        }
      }
    },

    /**
     * 改变翻页方式
     **/
    changeTurnType(turnType) {
      if (turnType === this.turnType) {
        return
      } else {
        this.showAnimation = false
        this.turnType = turnType
        uni.setStorageSync('turnType', this.turnType)
      }
    },

    /**
     * 改变背景
     **/
    changeBackground(background) {
      // console.log(background);
      if (background === this.background) {
        return
      } else {
        this.background = background
        uni.setStorageSync('background', this.background)
      }
    },

    /**
     * 获取目录
     **/
    getDirectoryList(showLoading) {
      /*****************************************/
      /**********    根据需要更改    ************/
      /*****************************************/
      if (showLoading) {
        uni.showLoading({
          title: '加载中',
          mask: true
        })
      }

      //将章节赋值给章节列表
      const chapters = this.book.chapters

      for (let i = 0; i < chapters.length; i++) {
        this.directoryList.push({
          index: i,
          chapterId: chapters[i].chapterurl, //注意：这个chapterId用于获取章节内容而不是index
          name: chapters[i].chaptername
        })
      }

      if (showLoading) {
        //取消加载
        uni.hideLoading()
      }

      /*****************************************/
      /*****************************************/
      /*****************************************/
    },

    /**
     * 购买书籍接口
     **/
    buyBook() {
      // //在回调中调用this.initPage()刷新本页
      // uni.showToast({
      // 	title: '跳转至购买页面，如果未登陆则跳转登陆',
      // 	icon: 'none'
      // })
    },

    /**
     * 获取一章数据
     **/
    async getOneChapter(chapterId, showLoading) {
      /*****************************************/
      /**********    根据需要更改    ************/
      /*****************************************/

      // 加载的这章在哪个目录下
      let chapindex = 0

      for (let i = 0; i < this.bookall.chapters.length; i++) {
        if (this.bookall.chapters[i].chapterurl === chapterId) {
          chapindex = i
          break
        }
      }
      // const endindex = this.bookall.chapters.length - chapindex;
      // // 是否使用缓存数据
      // // 当有更新且当前章为最后十章的时候，不使用缓存数据，重新加载
      // const visend = this.book.isUpdated && endIndex < 10 ? false : true;
      // 存在，且不刷新

      if (this.bookall.chapters[chapindex].hasOwnProperty('text') && !this.refreshData) {
        // 对象包含 text 属性
        //直接用
        this.text = this.bookall.chapters[chapindex].text
        //文本
        this.tmpChapter.text = this.text
        // 设置可读
        this.tmpChapter.canRead = true
      } else {
        // 对象不包含 text 属性
        if (showLoading) {
          uni.showLoading({
            title: '加载中',
            mask: true
          })
        }
        const originF = this.bookall.origin

        let getText = await this.$getNetwork.read(originF, chapterId)
        if (-1 == getText) {
          console.log('网络请求错误')
          //取消加载
          uni.hideLoading()
          uni.showToast({
            title: '获取章节错误，请检查网络状态',
            icon: 'none'
          })
          //文本
          this.tmpChapter.text = ''
          // 设置可读
          this.tmpChapter.canRead = true
        } else {
          // this.text = getText
          // 文本去除多次重复字段
          getText = clearExcessiveRepeats(getText, 6)
          this.tmpChapter.text = getText
          // 设置可读
          this.tmpChapter.canRead = true

          if (this.simplified === 2) {
            //切换为繁体  注意：这里默认数据库中是简体字
            this.tmpChapter.text = traditionalized(this.tmpChapter.text)
          }
          //缓存添加文本，最重要！！！！！！
          this.bookall.chapters[chapindex]['text'] = this.tmpChapter.text
          //标记为已经下载
          this.book.chapters[chapindex].visD = true
          this.text = ''
        }
      }

      // //取消加载(等计算页面信息后再取消)
      // uni.hideLoading()

      /*****************************************/
      /*****************************************/
      /*****************************************/
    },

    /**
     * 获取三章数据
     **/
    async getThreeChapter(index) {
      // 获取当前章节的内容
      await this.getOneChapter(this.directoryList[index].chapterId)
      this.curChapter = {
        chapterIndex: index,
        chapterName: this.directoryList[index].name,
        text: this.tmpChapter.text,
        canRead: this.tmpChapter.canRead
      }

      // 获取上一章节的内容
      if (this.curChapter.chapterIndex !== 0) {
        await this.getOneChapter(this.directoryList[index - 1].chapterId)
        this.preChapter = {
          chapterIndex: index - 1,
          chapterName: this.directoryList[index - 1].name,
          text: this.tmpChapter.text,
          canRead: this.tmpChapter.canRead
        }
      } else {
        // 当当前章节是第一章时，设置上一章节为封面或空白
        this.preChapter = {
          ready: true,
          isCover: true
        }
      }

      // 获取下一章节的内容
      if (this.curChapter.chapterIndex !== this.directoryList.length - 1) {
        await this.getOneChapter(this.directoryList[index + 1].chapterId)
        this.nextChapter = {
          chapterIndex: index + 1,
          chapterName: this.directoryList[index + 1].name,
          text: this.tmpChapter.text,
          canRead: this.tmpChapter.canRead
        }
      } else {
        // 当当前章节是最后一章时，设置下一章节为结束标识或空白
        this.nextChapter = {
          ready: true,
          isEnd: true
        }
      }

      // 计算当前章节的相关信息
      await this.calcCurChapter()
      // 计算上一章节的相关信息
      await this.calcPreChapter()
      // 计算下一章节的相关信息
      await this.calcNextChapter()

      // 加载完毕，不使用刷新
      this.refreshData = false
      // 取消加载
      uni.hideLoading()
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  position: relative;
  width: 100%;
  height: 100%;
}

.hidden {
  opacity: 0;
}

.action {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .item {
    flex: 1;
    height: 100%;
  }
}

.container {
  position: fixed;
  // 连续英文换行
  word-break: break-all;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
  height: 100%;
  width: 100%;
  background-color: #fff;
  overflow: hidden;

  .chapter {
    padding-top: 30px;
    font-size: 12px;
    color: $minor-text-color;
    height: 30px;
    width: 100%;
    line-height: 20px;
    text-overflow: ellipsis;
    display: inline-block;
    /* 或者 block */
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
    // overflow: hidden;
  }

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: $minor-text-color;
    height: 30px;
    width: 100%;
  }

  .content {
    margin-top: 30px;
    margin-bottom: 5px;
    flex: 1 1 auto;
    overflow: hidden;

    .inner-box {
      overflow: hidden;

      .book-inner {
        text-indent: 2em;
        text-align: justify;
      }
    }
  }
}

.container0 {
  background: url(../../static/background1.jpg);
  background-color: #fff;
  background-size: 100% 100%;
}

.container1 {
  background-color: #000;
}

.container2 {
  background-color: #97bf18;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 300;

  // transition: all .3s;
  .menu-top {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #333;
    transition: top 0.3s;

    .head {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 100%;
      line-height: 40px;
      color: #fff;
    }

    .back {
      position: absolute;
      top: 0;
      left: 10px;
    }
  }

  .directory {
    position: absolute;
    top: 0;
    display: flex;
    flex-flow: column;
    width: 550rpx;
    height: 100%;
    transition: left 0.4s;

    .bookname {
      padding: 20px 0 20px 10px;
      height: 60px;
      font-size: 18px;
    }

    // 目录样式
    .directory-listItem {
      display: flex;
      align-items: center;
      padding-left: 10px;
      height: 50px;
      font-size: 16px;
      // border-bottom: #eee solid 1px;
    }

    .active {
      color: #e5363d;
    }
  }

  .menu-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #333;
    transition: bottom 0.3s;
    color: #fff;

    .show-chapter {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -110%);
      padding: 5px 10px;
      line-height: 20px;
      border-radius: 10rpx;
      font-size: 13px;
      background-color: #333;
    }

    .progress-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 50px;
      width: 100%;
      font-size: 15px;
    }

    .items-box {
      display: flex;
      justify-content: space-around;
      align-items: center;
      // padding-top: 20px;
      height: 80px;
      width: 100%;

      .item-box {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    }
  }

  .setting {
    position: absolute;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 10px 20px;
    width: 100%;
    color: #fff;
    background-color: #333;
    transition: bottom 0.3s;

    .item {
      display: flex;
      align-items: center;
      height: 70px;

      .item-name {
        padding: 10px;
        color: #fff;
        font-size: 14px;
      }

      .icon {
        margin-right: 10px;
        padding: 5px 20px;
        font-size: 15px;
        height: 32px;
        line-height: 20px;
        width: auto;
        text-align: center;
        border-radius: 20px;
        border: #fff solid 1px;
      }

      .font-face {
        margin-right: 10px;
        padding: 5px 20px;
        font-size: 15px;
        height: 32px;
        line-height: 20px;
        width: auto;
        min-width: 360rpx;
        text-align: center;
        border-radius: 20px;
        border: #fff solid 1px;
      }

      .type-setting {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin-right: 10px;
        padding: 5px;
        height: 30px;
        width: 30px;
        border-radius: 5px;
        border: #fff solid 1px;

        .line {
          width: 100%;
          border-bottom: #fff solid 1px;
        }

        .lineActive {
          width: 100%;
          border-bottom: #ff9900 solid 1px;
        }
      }

      .active {
        color: #ff9900;
        border: #ff9900 solid 1px;
      }
    }
  }
}

.cover {
  image {
    height: 400rpx;
    width: 300rpx;
    background-color: #eee;
  }
}
</style>
