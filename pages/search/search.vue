<template>
	<view>

		<!-- 顶部搜索栏 -->
		<view class="search">
			<!-- 最左侧返回标签 -->
			<u-icon name="arrow-left" color="#000" @click="goBack"></u-icon>
			<u-search class="usearch" placeholder="搜索书名或作者" v-model="keyword" @custom='searchClick' focus
				@search='searchClick'></u-search>
		</view>


		<!-- 历史记录 -->
		<view v-if="visLsS" class="hos-results">
			<view class="results">
				<view class="hos">历史记录</view>
				<view class="h-icon" @click="clearHistoryItems">
					<icon type="clear"></icon>
				</view>
			</view>
			<!-- 历史记录列表 -->
			<view class="search-results">
				<view v-for="item in this.$store.state.historyItems" @click="goSearch(item)">
					<view class="tag" @longpress="clearHistoryItem(item)">
						{{ item }}
					</view>
				</view>
			</view>

		</view>

		<!-- 搜索后显示 -->
		<view v-else>
			<view class="booklist">
				<!-- 搜索加载 -->
				<u-loading-icon :show="uloading"></u-loading-icon>
				<view class="search-results" :v-if="!uloading" v-for="book in showBooks" @click="goBookHome(book)">
					<BookList :imgurl="book.imgurl" :title="book.bookname" :info="'作者: ' + book.author"
						:bookSourceName="book.bookSourceName" :tags="book.tags">
					</BookList>
				</view>

				<!-- 触底加载 -->
				<u-loading-icon :show="ubottom"></u-loading-icon>

				<!-- 加载时不显示 -->
				<view v-if="!uloading">
					<!-- 通过status设置组件的状态，加载前值为loadmore，加载中为loading，没有数据为nomore -->
					<u-loadmore status="nomore" nomore-text="找不到更多啦" />
				</view>
			</view>

		</view>


		<!-- 确认删除弹窗 -->
		<u-modal :show="visModaHistory" :title="clearTitle" showCancelButton closeOnClickOverlay :zoom="false"
			@cancel="cancelmodalD" @confirm="confirmmodalD" @close="closemodalD"></u-modal>


	</view>

</template>

<script>
	// import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"
	// import origins from '@/getNetwork/origins.json'

	export default {
		data() {
			return {
				// 搜索的内容
				keyword: "",
				// 搜索的书的列表，内容有imgurl，bookurl，bookname, author, origin
				books: [],
				// 展示的列表 通过触底进行刷新
				showBooks: [],
				// 加载等待显示
				uloading: false,
				// 触底加载
				ubottom: false,
				// 历史记录搜索显示
				visLsS: true,
				// 确认删除弹窗
				visModaHistory: false,
				// 是否是删除历史记录单项
				visHistoryItem: false,
				// 要删除的历史记录单项
				historyItem: null,
				clearTitle: '确定要删除历史记录吗？',
			};
		},
		onLoad() {

		},
		/**
		 * 触底加载
		 */
		onReachBottom() {
			// console.log('触底刷新')
			this.ubottom = true
			if (this.showBooks.length < this.books.length) {
				const size = this.showBooks.length;
				this.showBooks.push(...this.books.slice(size, size + 20));
			}
			this.ubottom = false
		},
		methods: {
			//返回上一级目录
			goBack() {
				uni.navigateBack();
			},

			//打开书籍主页
			goBookHome(book) {
				// 同时传递书籍五个参数
				// uni.navigateTo({
				// 	url: `/pages/bookHomepage/bookHomepage?author=${book.author}&bookname=${book.bookname}
				// 	&bookurl=${book.bookurl}&imgurl=${book.imgurl}&origin=${book.origin}`
				// })
				// encodeURIComponent 对字符串中的某些特殊字符进行转义，以便可以安全地包含在 URL 中 这样可以传递大对象
				// 使用decodeURIComponent转码
				const e = encodeURIComponent(JSON.stringify(book));
				uni.navigateTo({
					url: `/pages/bookHomepage/bookHomepage?book=${e}`
				})
			},

			//点击历史记录触发，需要传进搜索的字符串
			goSearch(e) {
				this.keyword = e;
				this.searchClick();
			},

			//点击清除历史记录的图标后触发，将历史记录清空
			clearHistoryItems() {
				this.clearTitle = "确定要删除全部的历史记录吗？";
				// 显示弹窗
				this.visModaHistory = true;
				// 全部删除
				this.visHistoryItem = false;
			},
			//长按出现删除标志
			clearHistoryItem(item) {
				this.clearTitle = `确定要删除记录“${item}”吗？`;
				// 显示弹窗
				this.visModaHistory = true;
				// 显示删除单项
				this.visHistoryItem = true;
				this.historyItem = item;
			},
			//点击了确定删除
			confirmmodalD() {
				//隐藏弹窗
				this.visModaHistory = false;
				if(this.visHistoryItem === false){
					this.$store.commit('clearHistoryItems')
				}else{
					// 只删除单项
					this.$store.commit('clearHistoryItem',this.historyItem)
				}
			},
			cancelmodalD() {
				//点击了取消
				//隐藏弹窗
				this.visModaHistory = false;
			},
			closemodalD() {
				//遮罩层关闭
				this.visModaHistory = false;
			},

			//点击搜索后触发
			async searchClick() {

				// 不搜索空格或空字符串
				if (this.keyword.trim().length === 0) {
					console.log("搜索空内容" + this.keyword);
					return
				}

				// 只要进行搜索，就隐藏历史记录
				this.visLsS = false;
				// 开启加载等待动画
				this.uloading = true;
				// 优化视觉体验
				this.books = [];

				// 将搜索的值添加到历史记录里面
				this.$store.commit('addToHistoryItems', this.keyword);

				const bookOrigins = this.$store.state.bookOrigins
				/**
				 * 异步请求，加快搜索速度
				 * */
				const requests = bookOrigins.map(async config => {
					try {
						if (config.isSelect) {
							const id = config.id;
							const book = await this.$getNetwork.search(id, this.keyword);

							if (-1 === book || 0 === book.length) {
								// // 取消等待动画，显示列表
								// this.uloading = false;
							} else {
								// 添加到列表中显示
								this.books.push(...book)
								this.books.sort((a, b) => {
									if (a.bookname.toLowerCase() === b.bookname.toLowerCase()) {
										//如果a和b完全匹配
										return 0;
									}
									const similarityA = this.similarity(a.bookname, this.keyword);
									const similarityB = this.similarity(b.bookname, this.keyword);
									if (a.bookname.toLowerCase() === this.keyword.toLowerCase()) {
										// 如果a的书名与搜索关键词完全匹配  
										return -1;
									} else if (b.bookname.toLowerCase() === this.keyword
										.toLowerCase()) {
										// 如果b的书名与搜索关键词完全匹配  
										return 1;
									} else if (a.bookname.startsWith(this.keyword.toLowerCase())) {
										// 如果a的书名以搜索关键词开头，则a更匹配
										return -1;
									} else if (b.bookname.startsWith(this.keyword.toLowerCase())) {
										// 如果b的书名以搜索关键词开头，则b更匹配
										return 1;
									} else {
										// 如果a与b的书名开头都不是搜索关键词，则按照相似度排序
										return similarityB - similarityA;
									}
									return similarityA - similarityB;
								});
								this.showBooks = this.books.slice(0, 20);
							}
						}

					} catch (error) {
						console.error("Error occurred while fetching book details:", error);
						throw error; // 在Promise链中抛出错误，以便在Promise.all的catch中捕获  
					}
				});

				Promise.all(requests)
					.then(results => {
						if (0 === this.books.length) {
							uni.showToast({
								title: "搜索无结果 | 稍后重试",
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: "搜索完成，共搜索到" + this.books.length + "本",
								icon: 'none'
							})
						}
						// 取消等待动画，显示列表
						this.uloading = false;
					})
					.catch(error => {
						console.log("请求错误:", error);
						// 取消等待动画，显示列表
						this.uloading = false;
					});

			},

			/**
			 * Levenshtein距离 算法
			 * 计算搜索结果和搜索内容相似度
			 * 返回dp[m][n]，即bookname和keyword之间的Levenshtein距离，这个值越小，说明bookname和keyword越相似
			 * */
			similarity(bookname, keyword) {
				let m = bookname.length;
				let n = keyword.length;
				let cost = 0;
				let distance = 0;

				let dp = new Array(m + 1);
				for (let i = 0; i <= m; i++) {
					dp[i] = new Array(n + 1).fill(0);
				}

				for (let i = 0; i <= m; i++) {
					dp[i][0] = i;
				}
				for (let j = 0; j <= n; j++) {
					dp[0][j] = j;
				}

				for (let i = 1; i <= m; i++) {
					for (let j = 1; j <= n; j++) {
						if (bookname[i - 1] === keyword[j - 1]) {
							cost = 0;
							distance = 0;
						} else {
							cost = 1;
							distance = 1;
						}
						dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
					}
				}
				return dp[m][n];
			},

		},
	};
</script>

<style lang="scss">
	.search {
		display: flex;
		padding-top: 36px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 10px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background-color: #fff;

		.usearch {
			padding-left: 20rpx;
		}
	}

	.tab {
		margin-top: 80px;
		height: 48px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background-color: #fff;
	}

	.booklist {
		margin-top: 80px;
	}

	.hos-results {
		margin-top: 80px;

		.results {
			//左右排列
			display: flex;
			height: 40px;
			//垂直居中
			align-items: center;
			//一左一右
			justify-content: space-between;

			.hos {
				margin-left: 30rpx;
			}

			.h-icon {
				margin-right: 30rpx;
			}
		}

		.search-results {
			display: flex;
			flex-wrap: wrap;
			/* 允许标签换行 */

			/* 设置标签样式 */
			.tag {
				display: inline-block;
				/* 将元素设置为内联块级元素，宽度随内容变化 */
				background-color: #F2F2F2;
				/* 背景颜色 */
				color: #505050;
				/* 文字颜色 */
				border-radius: 10px;
				// 文字大小
				font-size: 14px;

				padding: 5px 5px;
				/* 内边距 */
				margin: 5px 5px;
				/* 外边距 */
			}
		}
	}
</style>