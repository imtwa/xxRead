<template>
	<view>
		<view class="zoo">
			<view class="title" @click="goBookClassShow()">
				<view class="title-text">{{ config.title }}</view>
				<view class="arrow-container">
					<u-button type="info" shape="circle" :plain="true" size="mini" text="更多" />
				</view>
			</view>
			<view>
				<view v-for="(item, i) in limitedBooks" :key="item.bookurl" @click="goBookHome(item)">
					<BookList :imgurl="item.imgurl" :title="item.bookname" :info="getInfo(item)" :info1="getInfo1(item)"
						:tags="item.tags">
					</BookList>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "BookClass",
		props: {
			Ftitle: {
				type: String,
			},
			config: {
				required: true, // prop 必传
			},
			len: {
				type: Number,
				default: 5, // 设置 len 的默认值
			},
		},
		data() {
			return {
				
			};
		},
		mounted() {

		},
		computed: {
			limitedBooks() {
				return this.config.list.slice(0, this.len);
			}
		},
		methods: {
			getInfo(item) {
				return "作者：" + item.author
			},
			getInfo1(item) {
				if (item.intro) {
					return item.intro
				}
				return "更新：" + item.createdAt
			},
			goBookHome(book) {
				// encodeURIComponent 对字符串中的某些特殊字符进行转义，以便可以安全地包含在 URL 中 这样可以传递大对象
				// 使用decodeURIComponent转码
				const e = encodeURIComponent(JSON.stringify(book));
				uni.navigateTo({
					url: `/pages/bookHomepage/bookHomepage?book=${e}`
				})
			},
			goBookClassShow() {
				const e = encodeURIComponent(JSON.stringify(this.config));
				uni.navigateTo({
					url: `/pages/bookClassShow/bookClassShow?title=${this.Ftitle + "·" + this.config.title}&book=${e}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.zoo {
		margin: 8px;
		padding-top: 8px;
		background-color: #fff;
		border-radius: 8px;

		.title {
			width: 100%;
			height: 32px;
			padding: 0 16px;
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