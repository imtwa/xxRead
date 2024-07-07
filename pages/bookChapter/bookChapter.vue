<template>
	<view>
		<!-- 目录层 -->
		<view class="directory" @touchend.stop>
			<!-- 最左侧返回标签 -->
			<!-- <view class="bookname">
				<u-icon name="arrow-left" @click="goBack" style="margin-right: 10px;"></u-icon>
				<view>{{book.bookname}}目录</view>
			</view> -->

			<!--  :size="40"——每一栏高度为40px  :scrollHeight="windowHeight - 60"——书名的高度为60px -->
			<virtual-list :items="directoryList" :size="40" :remain="16" :active="book.readIndex" :scrollHeight="810">
				<template v-slot="{item,active}">
					<view class="directory-listItem" :class="{active: item.index == active}"
						:style="{color: directoryListItemColor(item.index)}" @click="goToChapter(item.index)">
						{{item.name}}
					</view>
				</template>
			</virtual-list>
		</view>
	</view>
</template>

<script>
	import battery from '../../components/battery.vue'
	import virtualList from '../../components/virtualList.vue'
	import {
		traditionalized,
		simplized,
		dateToStr
	} from '../../utils/utils.js'
	export default {

		components: {
			battery,
			virtualList
		},

		data() {
			return {
				book: {},
				directoryList: [], //目录列表
			};
		},
		onReady() {
			// 动态设置标题
			uni.setNavigationBarTitle({
				title: this.book.bookname
			});

		},
		onLoad(e) {
			console.log(e);
			this.book = this.$store.state.bookShelf[e.index]
			//将章节赋值给章节列表
			const chapters = this.book.chapters;

			for (let i = 0; i < chapters.length; i++) {
				this.directoryList.push({
					index: i,
					chapterId: chapters[i].chapterurl, //注意：这个chapterId用于获取章节内容而不是index
					name: chapters[i].chaptername
				})
			}
		},
		computed: {
			//判断是否缓存过
			directoryListItemColor() {
				return (index) => {
					if (true === this.book.chapters[index].visD) {
						return ''; // 否则返回默认颜色
					} else {
						return 'gray'; // 如果index为-1，则返回灰色
					}
				};
			},
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			goToChapter(index) {
				this.book.readIndex = index
				// 更新章节
				this.$store.commit('modifyBook', this.book.readIndex);

				// 然后得到在书架中的索引，需要传入bookurl（唯一标识）
				this.$store.dispatch('findBookFromShelf', this.book.bookurl).then(index => {

						// 阅读页面需要两个值，在书架中的索引以及点击的第几章的索引
						uni.navigateTo({
							url: `/pages/bookRead/bookRead?bookShelfIndex=${index}&readIndex=${this.book.readIndex}`
						})

					})
					.catch(error => {
						// 异常情况的处理
					});;

			}
		}
	}
</script>

<style lang="scss" scoped>
	.directory {
		position: absolute;
		top: 0;
		display: flex;
		flex-flow: column;
		width: 100%;
		height: 100%;
		transition: left .4s;

		.bookname {
			//上右下左
			padding: 30px 20px 20px 20px;
			height: 60px;
			font-size: 18px;
			display: flex;
			// justify-content: center;
			align-items: center;
		}

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

		.active {
			color: #E5363D
		}
	}
</style>