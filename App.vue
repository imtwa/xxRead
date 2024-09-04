<script>
	import store from "./store/index.js"
	import iconv from 'iconv-lite';
	import getNetwork from "@/api/getNetwork/getNetwork.js";

	export default {
		onLaunch: function() {
			console.log('App Launch')
			//在初始化的时候读取缓存数据
			this.$store.commit('getBookShelfFromStorage')
			// 检查更新
			// this.$store.commit('updateBookshelf')
			// this.updateBookshelf();
			// 查看使用的内存
			// uni.getStorageInfo({
			// 	success: function(res) {
			// 		console.log(res.keys);
			// 		console.log(res.currentSize);
			// 		console.log(res.limitSize);
			// 	}
			// });

		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			//在页面进入后台时将数据缓存
			this.$store.commit('setBookShelfFromStorage')
			// console.log('App Hide')
		},
		methods: {
			/**
			 * 检查更新
			 * */
			async updateBookshelf() {
				for (let i = 0; i < this.$store.state.bookShelf.length; i++) {
					let book = this.$store.state.bookShelf[i]
					const newbook = await this.$getNetwork.homePage(book);

					// 新获取的目录更多了===更新了
					if (newbook.chapters.length > book.chapters.length) {
						// 要用一个变量中转一下，否则报错没有book.chapters.push这个函数
						let chapter = book.chapters;
						for (let k = book.chapters.length; k < newbook.chapters.length; k++) {
							chapter.push(newbook.chapters[k]);
						}
						book.chapters = chapter;
						// 标记为已经更新
						book.isUpdated = true;
						book.readAll = newbook.chapters.length;

						this.$store.commit("modifyBook", book)
					}
				}
			},
		},

	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";

	/*每个页面公共css */
	view {
		box-sizing: border-box;
	}
</style>