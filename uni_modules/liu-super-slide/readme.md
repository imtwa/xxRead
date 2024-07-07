### liu-super-slide适用于uni-app项目的3D轮播、堆叠轮播、轮播图(很好看)组件
### 本组件目前兼容微信小程序、H5
### 本组件是很好看、好用的3D轮播、堆叠轮播，支持任何图片数量、点击、自动轮播、手动轮播(走过路过千万不要错过)
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用方式
``` 
<template>
	<view class="page-main">
		<liu-super-slide :swiperList="swiperList" :bgUrl="bgUrl" :autoplay="autoplay" :interval="interval"
			@change="change" @click="click"></liu-super-slide>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoplay: true,
				interval: 3000,
				bgUrl: "https://cdn.pixabay.com/photo/2020/09/05/19/38/landscape-5547401_1280.png",
				swiperList: [{
					picUrl: 'https://cdn.pixabay.com/photo/2020/05/19/13/32/cartoon-5190837_1280.jpg',
					title: '思考'
				}, {
					picUrl: 'https://cdn.pixabay.com/photo/2020/05/19/13/35/cartoon-5190860_1280.jpg',
					title: '雨天'
				}, {
					picUrl: 'https://cdn.pixabay.com/photo/2021/07/22/11/25/rabbit-6485072_1280.jpg',
					title: '兔子'
				}, {
					picUrl: 'https://cdn.pixabay.com/photo/2022/03/31/14/53/camp-7103189_1280.png',
					title: '日落'
				}, {
					picUrl: 'https://cdn.pixabay.com/photo/2022/11/29/19/05/boho-7625140_1280.jpg',
					title: '植物'
				}, {
					picUrl: 'https://cdn.pixabay.com/photo/2022/08/25/23/06/woman-7411414_1280.png',
					title: '时尚'
				}, {
					picUrl: 'https://cdn.pixabay.com/photo/2023/03/07/12/45/child-7835677_1280.jpg',
					title: '生活'
				}]
			}
		},
		methods: {
			change(e) {
				console.log('当前轮播信息：', e)
			},
			//点击轮播
			click(e) {
				console.log('点击轮播', e)
			}
		}
	}
</script>
```

### 属性说明
| 名称                         | 类型            | 默认值                  | 描述            |
| ----------------------------|---------------- | ---------------------- | ---------------|
| swiperList                  | Array           | []                     | 轮播数据源
| bgUrl                       | String          |                        | 背景图片(非必传)
| autoplay                    | Boolean         | true                   | 是否自动轮播
| interval                    | Number          | 5000                   | 轮播自动切换时间间隔(autoplay为true时生效)
| vibrate                     | Boolean         | true                   | 点击轮播是否有触感振动(自动轮播不生效)
| @change                     | Function        |                        | 轮播回调
| @click                      | Function        |                        | 点击轮播






