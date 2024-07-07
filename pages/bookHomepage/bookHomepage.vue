<template>
	<view>

		<!-- 页加载 -->
		<u-loading-page :loading="loading"></u-loading-page>
		<!-- 消息提醒 -->
		<u-toast ref="uToast"></u-toast>

		<!-- 加载后显示书籍主页 -->
		<view class="bookHome" v-if="!loading">
			<!-- 头部 -->
			<view class="head">
				<BookList :imgurl="book.imgurl" :title="book.bookname" :isClick="true" :info="'作者: ' + book.author"
					:info1="'共 '+book.chapters.length+' 章'" :bookSourceName="book.bookSourceName" :tags="book.tags">
				</BookList>
			</view>
			<!-- 中间 包含简介和章节 -->
			<view class="bom">
				<view class="tab">
					<u-tabs :list="list4" lineWidth="30" lineColor="#f56c6c" :activeStyle="{
					            color: '#303133',
					            fontWeight: 'bold',
					            transform: 'scale(1.05)'
					        }" :inactiveStyle="{
					            color: '#606266',
					            transform: 'scale(1)'
					        }" itemStyle="padding: 20rpx; height: 100rpx;width: 50%; " @click="goclick">
					</u-tabs>
				</view>
				<view class="intro">

					<template v-if="vis">
						<view>
							<!-- decode简介解码 -->
							<text decode>
								{{book.intro}}
							</text>
						</view>

					</template>
					<template v-else> 

						<virtual-list :items="book.chapters" :size="40" :remain="16" :active="book.readIndex"
							:scrollHeight="scrollHeight">
							<template v-slot="{item}">
								<view class="directory-listItem" @click="gochapter(item.chapterurl)">
									{{item.chaptername}}
								</view>
							</template>
						</virtual-list>

						<!-- 章节列表 -->
						<!-- <view v-for="(chapter, index) in chapters" :key="index" @click="gochapter(index)">
							<Chapter :book="book" :chapter="chapter"></Chapter>
						</view> -->

					</template>

				</view>

			</view>
			<!-- 固定在最底部 -->
			<view class="footer">

				<!-- 添加到书架 -->
				<view class="bookadd">
					<view class="add" @click="addclick()">
						<u-icon :name="addList[addid].name" size="26">
						</u-icon>
						<view class="addtext">
							{{addList[addid].text}}
						</view>
					</view>

				</view>

				<!-- 开始阅读 -->
				<button type="default" size="default" @click="goread">开始阅读</button>

			</view>
		</view>

	</view>
</template>

<script>
	//引入HTML 文本解析器
	import HTMLParser from "@/uni_modules/html-parser/js_sdk/index.js"
	import bookReadVue from "../bookRead/bookRead.vue"
	import store from "@/store/index.js"
	import virtualList from '@/components/virtualList.vue';
	import origins from '@/getNetwork/origins.json'

	export default {
		components: {
			virtualList
		},
		data() {
			return {
				// 书籍对象，imgurl，bookurl，bookname，author，origin
				book: {},
				// //简介
				// intro: "简介：无",
				// // 章节列表
				// chapters: [],
				// //读到第几章
				// readIndex: 0,
				//是否显示简介
				vis: true,
				//页面加载等待，一进入页面就进行加载
				loading: true,
				//u-tabs导航栏内容
				list4: [{
					name: '简介'
				}, {
					name: '目录'
				}],

				// 加入书架列表
				addList: [{
						name: 'plus-circle-fill',
						text: "加入书架",
					},
					{
						name: 'checkmark-circle',
						text: "已在书架",
					}
				],
				// 加入书架列表索引
				addid: 0,
				// 消息提示列表
				uToastList: [{
					type: 'default',
					position: 'bottom',
					message: "已从书架中移除",
					// iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png',
					duration: 1500
				}, {
					type: 'default',
					position: 'bottom',
					message: "已加入书架",
					// iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png',
					duration: 1500
				}],
				// 这本书在书架中的索引,-1为没有
				bookShelfIndex: -1,
				scrollHeight: 0,
			};
		},

		//书籍对象由路由中传递的元素获取
		onLoad(e) {
			// this.book = e;
			this.book = JSON.parse(e.book)
			console.log(this.book);
			
			// 添加书源属性
			this.getSourceName();
			// 添加进历史记录
			this.$store.commit("addBookHistoryList", this.book)

			const {
				windowHeight,
				windowWidth,
			} = uni.getSystemInfoSync()
			//获取一些必要的设备参数
			// 将rpx转成px
			let height = (windowWidth / 750) * Number(580)
			// 获取章节可视化区域高度
			this.scrollHeight = windowHeight - height
		},
		//每次展示就刷新
		onShow() {

			//得到在书架中的索引，需要传入bookurl（唯一标识）
			this.$store.dispatch('findBookFromShelf', this.book.bookurl).then(index => {

					this.bookShelfIndex = index;
					//如果在书架中，则应该显示已在书架
					if (this.bookShelfIndex != -1) {
						this.addid = 1;
						// 并将该书对象赋值给页面元素，优化，如果有该信息就不用再请求了
						// const book = this.$store.state.bookShelf[index]
						// this.intro = book.intro
						// this.chapters = book.chapters
						// this.readIndex = book.readIndex
						// 取消页面加载
						this.loading = false;

						// 添加进历史记录
						this.$store.commit("addBookHistoryList", this.book)

					} else {
						this.addid = 0;
						//如果不在书架，需要获取该书信息
						//获取简介章节数据
						this.fetchData();
					}

				})
				.catch(error => {
					// 异常情况的处理
				});;
		},

		methods: {

			// 获取书源
			getSourceName() {
				const index = origins.findIndex(item => item.bookSourceUrl === this.book.origin.trim());
				this.book.bookSourceName = origins[index].bookSourceName;
			},

			//点击切换目录和简介
			goclick(e) {
				// 如果点击的是目录，显示目录，否则显示简介
				if (e.index === 1) {
					this.vis = false;
				} else {
					this.vis = true;
				}
			},

			//加入书架和移除操作
			addclick() {
				// 如果索引小于1，则变成1，否则等于0
				if (this.addid < 1) {
					this.addid++;

					// //创建这本书的对象，并加入到书架里面
					// let addbook = {
					// 	imgurl: this.book.imgurl,
					// 	bookurl: this.book.bookurl,
					// 	bookname: this.book.bookname,
					// 	author: this.book.author,
					// 	intro: this.intro,
					// 	origin: this.book.origin,
					// 	bookSourceName: this.book.bookSourceName,
					// 	readIndex: 0,
					// 	readAll: this.chapters.length,
					// 	chapters: this.chapters
					// }
					this.book.readIndex = 0;
					this.book.readAll = this.book.chapters.length
					
					this.$store.commit('addBookShelf', this.book);

					//得到在书架中的索引，需要传入bookurl（唯一标识）
					this.$store.dispatch('findBookFromShelf', this.book.bookurl).then(index => {

							this.bookShelfIndex = index;
						})
						.catch(error => {
							// 异常情况的处理
						});;


				} else {
					//如果是移除书架
					this.addid = 0;
					//调用同步方法删除，需要传入bookurl
					this.$store.commit('deleteBook', this.book.bookurl);
					//已经删除了 书架中没有 标识为-1
					this.bookShelfIndex = -1;
				}

				//消息提示，根据索引值提示不同消息（加入书架或移除）
				this.$refs.uToast.show({
					...this.uToastList[this.addid],
				})

			},

			//点击开始阅读
			goread() {

				if (this.bookShelfIndex != -1) {
					// 如果在书架，则不用获取索引（索引已在页面加载时获取到了）
					// 阅读页面需要两个值，在书架中的索引以及读到第几章的索引
					uni.navigateTo({
						url: `/pages/bookRead/bookRead?bookShelfIndex=${this.bookShelfIndex}&readIndex=${this.book.readIndex}`
					})
				} else {
					//如果不在书架中
					// //创建这本书的对象，并加入到书架里面
					// let addbook = {
					// 	imgurl: this.book.imgurl,
					// 	bookurl: this.book.bookurl,
					// 	bookname: this.book.bookname,
					// 	author: this.book.author,
					// 	intro: this.intro,
					// 	origin: this.book.origin,
					// 	bookSourceName: this.book.bookSourceName,
					// 	readIndex: 0,
					// 	readAll: this.chapters.length,
					// 	chapters: this.chapters
					// }
					this.book.readIndex = 0;
					this.book.readAll = this.book.chapters.length
					
					this.$store.commit('addBookShelf', this.book);

					// 然后得到在书架中的索引，需要传入bookurl（唯一标识）
					this.$store.dispatch('findBookFromShelf', this.book.bookurl).then(index => {

							this.bookShelfIndex = index;
							// 新加入的书架，阅读章节为0
							this.readIndex = 0;

							// 阅读页面需要两个值，在书架中的索引以及读到第几章的索引
							uni.navigateTo({
								url: `/pages/bookRead/bookRead?bookShelfIndex=${this.bookShelfIndex}&readIndex=${this.book.readIndex}`
							})

						})
						.catch(error => {
							// 异常情况的处理
						});;
				}

			},

			//点击章节
			gochapter(rIndex) {
				console.log("点击了" + rIndex);

				rIndex = this.book.chapters.findIndex(item => item.chapterurl === rIndex);

				// 点击的第几章
				// this.readIndex = rIndex;
				// //创建这本书的对象，并加入到书架里面
				// let addbook = {
				// 	imgurl: this.book.imgurl,
				// 	bookurl: this.book.bookurl,
				// 	bookname: this.book.bookname,
				// 	author: this.book.author,
				// 	intro: this.intro,
				// 	origin: this.book.origin,
				// 	bookSourceName: this.book.bookSourceName,
				// 	readIndex: rIndex,
				// 	readAll: this.chapters.length,
				// 	chapters: this.chapters
				// }
				this.book.readIndex = rIndex;
				this.book.readAll = this.book.chapters.length

				if (this.bookShelfIndex !== -1) {

					// 如果在书架，更新章节
					// 阅读页面需要两个值，在书架中的索引以及点的是第几章的索引
					this.$store.commit('modifyBook', this.book);

					uni.navigateTo({
						url: `/pages/bookRead/bookRead?bookShelfIndex=${this.bookShelfIndex}&readIndex=${this.book.readIndex}`
					})
				} else {
					//如果不在书架中
					this.$store.commit('addBookShelf', this.book);
					// 然后得到在书架中的索引，需要传入bookurl（唯一标识）
					this.$store.dispatch('findBookFromShelf', this.book.bookurl).then(index => {

						this.bookShelfIndex = index;

						// 阅读页面需要两个值，在书架中的索引以及点击的第几章的索引
						uni.navigateTo({
							url: `/pages/bookRead/bookRead?bookShelfIndex=${this.bookShelfIndex}&readIndex=${this.readIndex}`
						})

					}).catch(error => {
						// 异常情况的处理
					});;
				}
			},


			// 发送网络请求，获取页面内容
			async fetchData() {

				const newbook = await this.$getNetwork.homePage(this.book);
				// console.log(newbook);
				if (newbook != -1) {
					// 复制对象 同属性会被覆盖 所以传入homePage的是this.book
					Object.assign(this.book, newbook);
					// this.book.intro = newbook.intro
					// if (newbook.chapters.length > 0) {
					// 	this.book.chapters = newbook.chapters
					// }

				} else {
					uni.showToast({
						title: "加载出错",
						icon: 'none'
					})
				}

				// 取消加载
				this.loading = false;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.bookHome {
		.head {
			height: 350rpx;
			background: linear-gradient(to bottom, #FFC0CB 20%, #fff 100%);
			// background: linear-gradient(to top, #362998 0%, #f5f5f5 100%);
			/*渐变方向to bottom表示从上到下*/

			display: flex;
			/* 使用Flexbox布局 */
			flex-direction: column;
			/* 将子元素以垂直方向排列 */
			justify-content: flex-end;
			/* 将子元素在交叉轴方向上靠近底部 */

		}

		.bom {
			.tab {}

			.intro {
				padding: 0 30rpx;

				// 目录样式
				.directory-listItem {
					display: flex;
					align-items: center;
					padding-left: 20px;
					padding-right: 20px;
					height: 50px;
					font-size: 16px;
					// border-bottom: #eee solid 1px;
				}
			}

			padding-bottom: 130rpx;
			/* 与.footer元素的高度一致 避免被底部遮挡*/
		}

		// 底部固定元素
		.footer {
			position: fixed;
			box-sizing: border-box;
			display: flex;
			/* 使用flex布局 */
			align-items: center;
			/* 垂直居中 */
			bottom: 0;
			width: 100%;
			height: 130rpx;
			background-color: #fff;
			border-top: 1px solid #efefef;

			.bookadd {

				//加入书架距离左侧距离
				padding-left: 100rpx;

				.add {
					display: flex;

					.addtext {
						padding-left: 10rpx;
					}
				}

			}

			button {
				width: 100px;
				height: 40px;
				margin-right: 80rpx;
				border-radius: 50rpx;
				font-size: 16px;
				color: #fff;
				float: right;
				background-color: #E5363D;
				box-shadow: 0 0 2px #dd0000;
			}
		}


	}
</style>