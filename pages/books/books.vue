<template>
	<!-- 书城页面 -->
	<view class="container">
		<navigator url="../search/search">
			<view class="search">
				<u-search placeholder="搜索书名或作者" v-model="keyword" :showAction="false" disabled></u-search>
			</view>
		</navigator>
		<view class="boby">
			<!-- 轮播 -->
			<!-- <view class="swiper">
				<carousel :img-list="imgList" url-key="url" @selected="selectedBanner" />
			</view> -->
			<view class="swiper">
				<u-swiper :list="imgList" :circular="true" interval="5000" duration="500" radius="8">
				</u-swiper>
			</view>

			<!-- 分类 -->
			<BookClassify></BookClassify>
			<!-- 排行 -->
			<view v-for="(config, index) in bookConfigs">
				<BookShowList :key="index" v-if="bookLists[index]" :title="config.title" :books="bookLists[index]"
					:index="index">
				</BookShowList>
			</view>

		</view>

	</view>
</template>

<script>
	import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"
	import carousel from '@/components/vear-carousel/vear-carousel'
	// import listItem from "../../uni_modules/uview-ui/libs/config/props/listItem"

	export default {
		components: {
			carousel
		},
		data() {
			return {
				keyword: '',
				// 轮播图
				imgList: [{
					url: '../../static/images/recommend/recommend2.jpg',
					id: 1
				}, {
					url: '../../static/images/recommend/recommend3.jpg',
					id: 2
				}, {
					url: '../../static/images/recommend/recommend1.jpg',
					id: 3
				}, ],
				bookLists: [],
			}
		},
		onLoad() {

		},
		onShow() {
			if (this.bookLists.length < this.bookConfigs.length) {
				this.int()
			}
		},
		//监听用户下拉刷新动作
		onPullDownRefresh() {
			// 检查更新
			this.int()
		},
		computed: {
			bookConfigs() {
				return this.$store.state.bookConfigs
			},
		},
		methods: {
			selectedBanner(item, index) {
				console.log('🥒', item, index)
			},

			int() {
				const requests = this.bookConfigs.map(config => {
					return new Promise((resolve, reject) => {
						let url = config.url
						// #ifdef H5
						const regex = /^http[s]?:\/\/www\.(.*?)\.(.*?)\/(.*)$/;
						const match = url.match(regex);
						if (match && match[2] && match[3]) {
							url = '/' + match[1] + '/' + match[3];
						}
						// #endif

						uni.request({
							url: url,
							success: (res) => {
								const doc = new HTMLParser(res.data.toString().trim());
								const list = this.getbook(doc);
								resolve(list);
							},
							fail: reject
						})
					});
				});

				Promise.all(requests)
					.then(results => {
						if (this.bookLists.length > 0) {
							uni.showToast({
								title: "刷新成功",
								icon: "none"
							})
							uni.stopPullDownRefresh(); //停止刷新
						}
						for (let i = 0; i < results.length; i++) {
							this.$set(this.bookLists, i, results[i]);
						}
						this.$store.commit("modifyBookLists", this.bookLists)
					})
					.catch(error => {
						console.log("请求错误:", error);
					});
			},
			getbook(doc) {
				const origin = "http://www.qiushu.info";
				const ui = new HTMLParser(doc.getElementsByClassName("toplists")[0]["innerHTML"]);
				const trList = ui.getElementsByTagName('dl');

				let book = [];
				// 该网站下标从1开始
				for (let i = 1; i < trList.length; i++) {
					const trdoc = new HTMLParser(trList[i].innerHTML);

					// 获取链接和作者
					const spant1 = trdoc.getElementsByTagName("a")[1];
					const bookurl = spant1.attributes.href;
					const bookname = trdoc.getElementsByTagName("a")[0].innerHTML.replace(
						/<strong>《(.*?)》<\/strong>/, "$1");

					// 获取作者
					const author = trdoc.getElementsByClassName("top_author")[0].innerHTML.replace(
						/<a.*?>(.*?)<\/a>/, "$1");

					// 获取封面
					const number = bookurl.match(/\/(\d+)\/$/)[1];
					const truncatedNumber = number > 999 ? number.slice(0, -3) : "0";
					const imgurl =
						`http://www.qiushu.info/${truncatedNumber}/${number}/${number}s.jpg`;
						
					const createdAt = trdoc.getElementsByClassName("top_lastupdate")[0].innerHTML
					
					let tags = [];
					// 连载状态 分类
					tags.push(trdoc.getElementsByClassName("top_fullflag")[0].innerHTML)
					tags.push(trdoc.getElementsByClassName("top_sort")[0].innerHTML)

					book.push({
						imgurl: imgurl,
						bookurl: origin + bookurl,
						bookname: bookname,
						author: author,
						origin: origin,
						createdAt: createdAt,
						tags: tags
					});
				}
				return book;
			},
		},
	}
</script>

<style lang="scss">
	.container {
		// height: 100vh;
		background-color: #F5F5F5;

		/* 设置背景颜色为浅灰色 */
		.search {
			z-index: 9999;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			padding: 10px;
		}

		.swiper {
			margin: 0 16rpx;

			.indicator {
				@include flex(row);
				justify-content: center;

				&__dot {
					height: 6px;
					width: 6px;
					border-radius: 100px;
					background-color: rgba(255, 255, 255, 0.35);
					margin: 0 5px;
					transition: background-color 0.3s;

					&--active {
						background-color: #ffffff;
					}
				}
			}

			.indicator-num {
				padding: 2px 0;
				background-color: rgba(0, 0, 0, 0.35);
				border-radius: 100px;
				width: 35px;
				@include flex;
				justify-content: center;

				&__text {
					color: #FFFFFF;
					font-size: 12px;
				}
			}
		}

		.boby {
			padding-top: 56px;
			padding-bottom: 4px;
		}
	}
</style>