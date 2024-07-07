<template>
	<view>
		<view class="zoo">
			<view class="title" @click="goRanKing">
				<view class="title-text">{{ title }}</view>
				<view class="arrow-container">
					<u-button type="info" shape="circle" :plain="true" size="mini" text="更多" />
					<!-- <u-icon name="arrow-right" size="16px" color="#000"></u-icon> -->
				</view>
			</view>
			<view class="book-container">
				<view v-for="(book, i) in limitedBooks" :key="book.bookurl" class="book-item" @click="goBookHome(book)">
					<view>
						<image :src="book.imgurl" class="book-cover"></image>
					</view>
					<view class="book-name">{{ book.bookname }}</view>
				</view>
			</view>
		</view>
	</view>

</template>


<script>
	export default {
		props: {
			title: {
				type: String,
				required: true
			},
			books: {
				type: Array, // 这里指定了 books prop 的类型为 Array  
				required: true, // prop 必传
			},
			index: 0,
			len: {
				type: Number,
				default: 8, // 设置 len 的默认值为 8  
			},
		},
		computed: {
			limitedBooks() {
				return this.books.slice(0, this.len);
			}
		},
		methods: {
			goRanKing() {
				uni.navigateTo({
					url: `/pages/bookRanking/bookRanking?index=${this.index}`
				})
			},
			goBookHome(book) {
				// // 同时传递书籍五个参数
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
			}
		},
	}
</script>

<style lang="scss" scoped>
	.zoo {
		margin: 8px;
		padding: 8px 16px;
		background-color: #fff;
		border-radius: 8px;
		// box-shadow: 1px 1px 1px rgba(85, 85, 85, 0.2);
		// box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

		.title {
			width: 100%;
			height: 32px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title-text {
				/* 根据需要设置文本样式 */
			}

			.arrow-container {
				padding-top: 7px;
				// width: 32px;
				height: 100%;
				/* 根据需要设置箭头容器样式 */
			}
		}

		.book-container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.book-item {
				flex-basis: 25%;
				padding-top: 8px;
				margin-bottom: 5px;
				max-width: 22%;
				box-sizing: border-box;

				.book-cover {
					width: 100%;
					max-width: 72px;
					height: 100px;
					position: relative;
					/* 或 absolute */
					left: 50%;
					transform: translateX(-50%);

					// box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
					border-radius: 5px;
					background-color: #efefef;
				}

				.book-name {
					text-align: center;
					font-size: 14px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #111;
				}


			}
		}
	}
</style>