<template>
	<view>
		<view class="container">
			<view class="top">
				<image src="../../../static/images/user/login.png"
					style="width: 96px; height: 96px; border-radius: 10px;"></image>
				<view style="font-size: 20px;">
					{{name}}
				</view>
			</view>
			<view class="middle">
				<p>版本号: {{version}}</p>
				<p>联系方式:</p>
				<p>qq:2830671713</p>
			</view>
			<view class="bottom">
				<!-- 下部内容 -->
				<view v-for="(item, index) in items.slice().reverse()" :key="index"
					:class="['view_tupian_wenzi', { 'view_active': item.title === version}]">
					<!-- <image class="image_1" :src="item.imageUrl" /> -->
					<view class="view_wenzi2">
						<text>版本：{{ item.title }}</text>
						<text class="text_small">{{ item.description }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//引入HTML 文本解析器
	import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"

	export default {
		data() {
			return {
				name: "xx阅读",
				version: "1.0.0",
				items: [{
						title: "1.0.0",
						time:"2023-08-25",
						description: "初步完成界面设计，实现搜索、阅读、浏览记录、缓存下载等功能"
					}, {
						title: "1.0.2",
						time:"2023-08-25",
						description: "对书源进行替换"
					},
					{
						title: "1.0.4",
						time:"2023-09-04",
						description: "加入音量翻页功能，优化少量BUG"
					},
					{
						title: "1.0.6",
						time:"2023-09-18",
						description: "优化榜单界面，解决遇到连续英文翻页阅读页面显示不完全的BUG"
					},
					{
						title: "1.0.8",
						time:"2023-09-21",
						description: "书架页面新增左滑删除，新增更新提示，优化界面设计"
					},
					{
						title: "1.1.0",
						time:"2023-09-22",
						description: "新增头像昵称简介自定义设置"
					},
					{
						title: "1.1.2",
						time:"2023-09-25",
						description: "新增导出TXT功能，优化少量BUG"
					},
					{
						title: "2.0.0",
						time:"2023-11-03",
						description: "重构项目代码，新增下拉刷新，新增图片查看保存，新增书架宫格展示，优化书源，优化少量BUG"
					},
					{
						title: "2.0.2",
						time:"2023-11-08",
						description: "引入Levenshtein算法，优化搜索结果展示，增加多个书源，搜索结果改为多书源结果，优化少量BUG"
					},
					{
						title: "2.0.4",
						time:"2023-11-11",
						description: "新增书源管理，使用并发处理，优化数据加载速度和系统性能，优化少量BUG"
					},
					{
						title: "2.0.6",
						time:"2024-3-4",
						description: "支持音量长按翻页，使用虚拟列表，优化主页目录加载速度，优化少量BUG"
					},
					{
						title: "2.0.8",
						time:"2024-4-4",
						description: "使用触底刷新，优化搜索页内容过多卡顿问题，优化少量BUG"
					},
					{
						title: "2.1.0",
						time:"2024-4-5",
						description: "新增作品分类，新增作品标签，优化书城界面，优化少量BUG"
					}
				],

			};
		},
		onShow() {
			const accountInfo = uni.getSystemInfoSync();
			// console.log(accountInfo);
			this.name = accountInfo.appName
			this.version = accountInfo.appWgtVersion

			this.getUp();
		},
		methods: {
			getUp() {

				uni.request({
					url: "https://blog.dotcpp.com/a/98412",
					success: (res) => {
						const doc = new HTMLParser(res.data.toString().trim());
						// 获取更新信息
						const intro = new HTMLParser(doc.getElementsByClassName('ueditor_container')[0]
							.innerHTML);
						const newversion = intro.getElementsByTagName("p")[0].innerHTML.replace("<br/>", "");
						const title = intro.getElementsByTagName("p")[1].innerHTML.replace("<br/>", "");
						// console.log(newversion);
						// console.log(title)
						if (this.version != newversion) {
							const data =
								"百度网盘链接：https://pan.baidu.com/s/19SJYyOaue5YBnQtcRKpG9g?pwd=data 提取码：data"
							uni.setClipboardData({
								data: data,
								showToast: false,
								success: function() {
									console.log('剪切板设置success');
									uni.showToast({
										icon: "none",
										duration: 3500,
										title: "发现新版本" + newversion +
											"~\n下载链接已复制到剪切板，快去更新吧~\n" +
											"新版本更新：" + title
									})
								}
							});
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 100vh;
		// background-color: #f3f3f3;
	}

	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 100px;
	}

	.middle {
		// text-align: center;
		// margin-bottom: 20px;
	}

	.bottom {
		width: 100%;
	}

	/* 下部内容样式 */
	/* 包裹图片和两行文字 */
	.view_tupian_wenzi {
		height: 100px;
		display: flex;
		flex-direction: row;
		align-items: center;

		/* 圆角 */
		border-radius: 10px;

		/* 边 */
		// border: 0rpx solid #e0e3da;
		// box-shadow: 1px 1px 1px 1px #e0e3da;
		box-shadow: 2px 2px 2px rgba(85, 85, 85, 0.3);

		background-color: #f3f3f3;
		margin: 15px;

		/* padding使得文字和图片不至于贴着边框 */
		padding: 15px;
	}


	/* 包裹两行文字 */
	.view_wenzi2 {
		width: 100%;
		margin-left: 12px;
		display: flex;
		flex-direction: column;
	}

	/* 小字 */
	.text_small {
		font-size: 14px;
		word-break: break-all;
		color: #7a7878;
		margin-top: 4px;
	}

	/* 第一个项的背景颜色 */
	.view_first {
		background-color: #97ad8b;
	}

	/* 点击的项的背景颜色 */
	.view_active {
		background-color: #00aeff;
	}
</style>