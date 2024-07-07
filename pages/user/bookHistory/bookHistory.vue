<template>
	<view>
		<view v-if="visnobook" class="nobook">
			<u-empty mode="data" text="暂无书籍">
			</u-empty>
		</view>
		<view v-if="!visnobook" class="yesbook">
			<view class="ta">
				<view class="ta1">共有{{bookHistoryList.length}}条记录</view>
				<view class="h-icon" @click="goclearHistoryItems">
					<view>清空记录</view>
					<icon type="clear" size="16"></icon>
				</view>
			</view>
			<view v-for="(item, index) in bookHistoryList" :key="index" class="bookList">
				<view class="listleft" @click="goBookHome(item)">
					<BookList 
						:imgurl="item.imgurl" 
						:title="item.bookname" 
						:info="'作者: ' + item.author"
						:info1="getInfo(item)"
						:isUpdated="item.isUpdated">
					</BookList>
				</view>

				<!-- 详情图标 -->
				<view class="icon">
					<view class="iconmin" @click="gomenu(item)">
						<u-icon name="trash" size="24"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 确认删除弹窗 -->
		<u-modal :show="vismodalD" title="确定要删除这条记录吗？" showCancelButton closeOnClickOverlay :zoom="false"
			@cancel="cancelmodalD" @confirm="confirmmodalD" @close="closemodalD"></u-modal>
		<!-- 确认清除全部缓存弹窗 -->
		<u-modal :show="vismodalH" title="确定要清空浏览记录吗？" showCancelButton closeOnClickOverlay :zoom="false"
			@cancel="cancelmodalH" @confirm="confirmmodalH" @close="closemodalH"></u-modal>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//在哪本书打开的弹窗
				spbook: {},
				// 删除确认弹窗
				vismodalD: false,
				vismodalH: false,
			};
		},
		computed: {
			bookHistoryList() {
				return this.$store.state.bookHistoryList.slice().reverse()
			},
			visnobook() {
				if (this.$store.state.bookHistoryList.length === 0) {
					return true
				} else {
					return false
				}
			},

		},
		methods: {
			getInfo(item) {
				if ('readIndex' in item && 'readAll' in item) {

					const readIndex = item.readIndex + 1;
					const readAll = item.readAll;
					const readPercent = (readIndex * 100) / readAll;
					return `读到 ${readIndex} 章 共 ${readAll} 章 ${readPercent.toFixed(2)}%`;
				} else {
					return `无阅读信息`
				}
			},
			//点击到主页
			goBookHome(book) {
				// console.log(book);
				// 同时传递书籍五个参数
				const e = encodeURIComponent(JSON.stringify(book));
				uni.navigateTo({
					url: `/pages/bookHomepage/bookHomepage?book=${e}`
				})
			},

			//点击了删除
			gomenu(item) {
				this.spbook = item;
				// 弹出确定弹窗
				this.vismodalD = true
			},
			//点击了确定删除
			confirmmodalD() {
				//找到这本书的索引并删除
				this.$store.dispatch('deleteBookHistoryList', this.spbook.bookurl).then(index => {
						if (-1 === index) {
							uni.showToast({
								title: '删除失败,历史记录内没有这本书',
								icon: 'none',
							})

						} else {
							//消息提示
							uni.showToast({
								title: '删除成功',
								icon: 'none',
							})
						}

					})
					.catch(error => {
						// 异常情况的处理
						//消息提示
						uni.showToast({
							title: '删除失败,书架内没有这本书' + error,
							icon: 'none',
						})
					});;

				//隐藏弹窗
				this.vismodalD = false;

			},
			cancelmodalD() {
				//点击了取消
				//隐藏弹窗
				this.vismodalD = false;
			},
			closemodalD() {
				//遮罩层关闭
				this.vismodalD = false;
			},
			goclearHistoryItems() {
				// 弹窗
				this.vismodalH = true;
			},
			confirmmodalH() {
				// 确认按钮点击事件处理逻辑
				//找到这本书的索引并删除
				this.$store.dispatch('clearBookHistoryList').then(index => {
						//消息提示
						uni.showToast({
							title: '清空成功',
							icon: 'none',
						})
					})
					.catch(error => {
						// 异常情况的处理
						//消息提示
						uni.showToast({
							title: '清除失败\n' + error,
							icon: 'none',
						})
					});;

				this.vismodalH = false;
			},
			cancelmodalH() {
				// 取消按钮点击事件处理逻辑
				this.vismodalH = false;
			},
			closemodalH() {
				// 弹窗关闭事件处理逻辑
				this.vismodalH = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
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
		.ta {
			display: flex;
			// 左右排列
			justify-content: space-between;
			align-items: center;
			height: 30px;
			margin-left: 10px;
			margin-right: 20px;

			.h-icon {
				display: flex;

				icon {
					padding-left: 3px;
					padding-top: 5px;
				}
			}
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