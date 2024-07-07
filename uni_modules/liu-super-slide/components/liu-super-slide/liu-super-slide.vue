<template>
	<view>
		<view class="card-list" v-if="showListArr.length>0">
			<image v-if="bgUrl" class="swiper-img" :src='bgUrl'></image>
			<p class="card-info" :class="item.class<5?'card' + item.class:item.class%2==0?'card3':'card2'"
				v-for="(item, index) in showListArr" :key="index" @click.stop="click(item.class,item,true)">
				<image class="item-img" :src="item.picUrl"></image>
				<view class="item-name">{{item.title}}</view>
			</p>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			//轮播数据源
			swiperList: {
				type: Array,
				default: [],
			},
			//背景图片
			bgUrl: {
				type: String,
				default: ''
			},
			//是否自动轮播
			autoplay: {
				type: Boolean,
				default: true
			},
			//轮播自动切换时间间隔
			interval: {
				type: Number,
				default: 5000
			},
			//点击轮播是否有触感振动(自动轮播不生效)
			vibrate: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				timer: null,
				showListArr: []
			};
		},
		watch: {
			swiperList: {
				deep: true,
				immediate: true,
				handler(newArr) {
					let newList = JSON.parse(JSON.stringify(newArr))
					if (newList.length == 0) return
					this.$nextTick(() => {
						newList.forEach((res, index) => {
							res.class = index
						})
						this.showListArr = JSON.parse(JSON.stringify(newList))
						if (this.autoplay) this.autoPlayFun()
					})
				},
			}
		},
		methods: {
			autoPlayFun() {
				this.timer = setInterval(() => {
					this.getMenu()
				}, this.interval)
			},
			getMenu() {
				let list = this.showListArr.filter(res => res.class == 1)
				this.click(1, list[0], false)
			},
			click(index, mess, clickState) {
				if(clickState) this.$emit('click', mess)
				if (this.autoplay && clickState) return
				if (clickState && this.vibrate && !this.autoplay) uni.vibrateShort()
				if (clickState) {
					this.getMenu()
					return
				}
				for (let i = 0; i < this.showListArr.length; i++) {
					const item = this.showListArr[i]
					if (item.class > index) {
						item.class--
					} else if (item.class === index) {
						item.class = 0
					} else if (item.class === 0) {
						item.class = this.showListArr.length - 1
					}
				}
				this.$emit('change', mess)
			},
		},
		destroyed() {
			clearInterval(this.timer)
		}
	};
</script>

<style scoped>
	.card-list {
		width: 100%;
		height: 360rpx;
		position: relative;
	}

	.swiper-img {
		position: absolute;
		width: 94%;
		height: 250rpx;
		left: 0;
		right: 0;
		margin: auto;
		border-radius: 16rpx;
		opacity: 0.7;
	}

	.card-list p {
		border-radius: 8rpx;
		position: absolute;
		z-index: 99;
		transition: all 1s cubic-bezier(0.36, 0, 0.64, 1);
	}

	.card-info {
		width: 240rpx;
		height: 180rpx;
		overflow: hidden;
		border-radius: 8rpx;
	}

	.item-img {
		width: 100%;
		height: 100%;
	}

	.item-name {
		position: absolute;
		font-size: 30rpx;
		line-height: 30rpx;
		color: #FFFFFF;
		text-shadow: 0px 4rpx 8rpx #000000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card0 {
		transform: scale(1.5, 1.5);
		left: 255rpx;
		bottom: 90rpx;
		z-index: 9999 !important;
	}

	.card0 .item-name {
		width: 100%;
		top: 75rpx;
	}

	.card1 {
		left: 50rpx;
		bottom: 60rpx;
	}

	.card1 .item-name {
		width: 40rpx;
		height: 100%;
		top: 0rpx;
		left: 10rpx;
	}

	.card2 {
		left: 120rpx;
		bottom: 20rpx;
		z-index: 999 !important;
	}

	.card2 .item-name {
		width: 40rpx;
		height: 100%;
		top: 0rpx;
		left: 10rpx;
	}

	.card3 {
		left: 390rpx;
		bottom: 20rpx;
		z-index: 999 !important;
	}

	.card3 .item-name {
		width: 40rpx;
		height: 100%;
		top: 0rpx;
		right: 10rpx;
	}

	.card4 {
		left: 460rpx;
		bottom: 60rpx;
	}

	.card4 .item-name {
		width: 40rpx;
		height: 100%;
		top: 0rpx;
		right: 10rpx;
	}
</style>