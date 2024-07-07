# l-swiper
# ## 使用方法
配置easycom规则后，自动按需引入，无需`import`组件，直接引用即可。

```html
<template>
	<l-swiper type="card" :banner="banner" v-model="curr"></l-swiper>
	<l-swiper :height="300" :banner="banner" v-model="curr"></l-swiper>
</template>
```
## 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|:---:|:---:|:---:|---|
| value | Number | 0 | 当前轮播图 v-model双向绑定 |
| banner | Array | [] | 图片数组 |
| height | Number | 240 | 轮播图高度 rpx |
| type | String | normal | 类型 卡片轮播图card 默认normal |
| indicatorDots | Boolean | true | 是否展示指示器 |
| autoplay | Boolean | true | 是否自动切换 |
| interval | Number | 3000 | 自动切换时间间隔 ms |
| duration | Number | 300 | 切换滑动动画时长 ms |
| circular | Boolean | true | 是否采用衔接滑动，即播放到末尾后重新回到开头 |


## 组件事件

| 名称 | 触发时机 |
|:---:|---|
| change | 轮播图改变 |
| clickItem | 点击轮播图 |