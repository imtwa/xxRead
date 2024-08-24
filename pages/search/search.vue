<template>
	<view @click="visSelect = false">
		<!-- 顶部搜索栏 -->
		<view class="search">
			<view style="display: flex; align-items: center; width: 100%;">
				<!-- 最左侧返回标签 -->
				<u-icon name="arrow-left" color="#000" size="18" @click="goBack"></u-icon>
				<u-search class="usearch" placeholder="搜索书名或作者" v-model="keyword" focus :show-action="false"
					@search='searchClick'></u-search>
				<view @click.stop="visSelect = !visSelect"
					style="width: 50rpx; display: flex; justify-content: center; align-items: center;">
					<u-icon name="more-dot-fill" color="#000" size="20" style="transform: rotate(90deg);">
					</u-icon>
				</view>
			</view>
		</view>

		<!-- 选择搜索书名还是作者 -->
		<view v-show="visSelect" class="search-select">
			<view style="font-size:28rpx; color: #333; margin: 20rpx 0;">
				<p>精确展示搜索结果</p>
			</view>
			<!-- 单选框 -->
			<u-radio-group v-model="selecValue" @change="radioGroupChange" placement="column" activeColor="#000"
				iconPlacement="right">
				<u-radio @change="radioChange" v-for="(item, index) in selectList" :key="index" :name="item.name"
					:disabled="item.disabled" style="height: 75rpx;">
					{{ item.name }}
				</u-radio>
			</u-radio-group>
		</view>
		<view style="min-height: 90vh;">
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
				// 是否显示选择框
				visSelect: false,
				// 选择框数据
				selectList: [{
						name: '搜索书名',
						disabled: false
					},
					{
						name: '搜索作者',
						disabled: false
					}
				],
				selecValue: '搜索书名',
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
				if(this.visSelect){
					return;
				}
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
				if (this.visHistoryItem === false) {
					this.$store.commit('clearHistoryItems')
				} else {
					// 只删除单项
					this.$store.commit('clearHistoryItem', this.historyItem)
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

			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
				this.selecValue = e;
				// 触发排序
				this.bookSort();
			},
			// 选中任一radio时，由radio-group触发
			// 点击已选中也会重复触发
			radioGroupChange(e) {
				// console.log(e);
				// console.log(this.selecValue);
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
						// 该书源是否选中
						if (config.isSelect) {
							const id = config.id;
							const book = await this.$getNetwork.search(id, this.keyword);

							if (-1 === book || 0 === book.length) {
								// // 取消等待动画，显示列表
								// this.uloading = false;
							} else {
								// 添加到列表中显示
								this.books.push(...book)
								// 排序
								this.bookSort();
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
			 * 根据相似度排序
			 * 依赖selecValue区分是搜索书名还是搜索作者
			 */
			bookSort() {
				let propertyName = 'bookname';
				if(this.selecValue === '搜索书名'){
					propertyName = 'bookname'
				}else if(this.selecValue === '搜索作者'){
					propertyName = 'author'
				}
				// console.log(this.selecValue);
				// console.log(propertyName);
				
				this.books.sort((a, b) => {
					if (a[propertyName].toLowerCase() === b[propertyName].toLowerCase()) {
						//如果a和b完全匹配
						return 0;
					}
					const similarityA = this.similarity(a[propertyName], this.keyword);
					const similarityB = this.similarity(b[propertyName], this.keyword);
					if (a[propertyName].toLowerCase() === this.keyword.toLowerCase()) {
						// 如果a的书名与搜索关键词完全匹配  
						return -1;
					} else if (b[propertyName].toLowerCase() === this.keyword.toLowerCase()) {
						// 如果b的书名与搜索关键词完全匹配  
						return 1;
					} else if (a[propertyName].startsWith(this.keyword.toLowerCase())) {
						// 如果a的书名以搜索关键词开头，则a更匹配
						return -1;
					} else if (b[propertyName].startsWith(this.keyword.toLowerCase())) {
						// 如果b的书名以搜索关键词开头，则b更匹配
						return 1;
					} else {
						// 如果a与b的书名开头都不是搜索关键词，则按照相似度排序
						return similarityB - similarityA;
					}
				});
				// 排序后将结果展示 若展示列表为空则先展示前二十本
				this.showBooks = this.books.slice(0, 20)
				// console.log(this.showBooks);
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
			padding: 0 20rpx;
		}
	}

	.search-select {
		position: fixed;
		width: 300rpx;
		top: 160rpx;
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
		animation: fadeInFromTop 0.5s forwards;
		/* 清除过渡效果*/
		transition: none;
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