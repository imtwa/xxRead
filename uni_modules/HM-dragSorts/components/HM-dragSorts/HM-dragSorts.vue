<template>
	<view>
		<u-navbar left-text="返回" title="书源管理" :placeholder="true" :border="false" rightIcon="more-dot-fill"
			@leftClick="leftClick" @rightClick="rightClick">
		</u-navbar>
		<u-action-sheet :actions="actionsList" :closeOnClickOverlay="true" :closeOnClickAction="true" cancelText="取消"
			description="设置搜索书源 当前顺序为搜索结果顺序" round="30rpx" :show="show" @select="selectClick"
			@close="close"></u-action-sheet>

		<view class="HM-drag-sort" :style="{'height': ListHeight+'px','background-color': listBackgroundColor}">
			<!-- 拖拽中显示的行 -->
			<view class="rowBox-shadow" id="shadowRowBox">
				<view class="hm-row-shadow move" id="shadowRow">
					<view class="modules">
						<!-- 内容  -->
						<view class="row-content">
							<view class="row" :style="{'height': rowHeight+'px'}">
								<!-- <image v-if="shadowRow.icon" class="icon" :src="shadowRow.icon"></image> -->
								<view class="checkbox">
									<view :class="{ 'checkbox-void':!shadowRow.isSelect,'checked':shadowRow.isSelect }">
									</view>
								</view>
								<text class="text">{{shadowRow.name}}</text>
							</view>
						</view>
						<!-- 拖拽图标 -->
						<view class="drag-content">
							<view class="drag-icon" :style="{'height': rowHeight+'px'}">
								<text class="iconfont icon-drag"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 拖拽列表 -->
			<scroll-view class="color scroll-view" :id="'scrollView_'+guid" :scroll-y="true"
				:style="{'height': ListHeight+'px'}" :scroll-top="scrollViewTop" @scroll="drag.scroll"
				:scroll-with-animation="scrollAnimation">
				<view class="list">
					<view v-for="(row,index) in dragList" :key="row.HMDrag_id" class="rowBox ani">
						<!-- 注意,这里的style只有在行首次渲染出来才有效,后面拖动列表,style会被wxs修改,这里的style就不会再生效了 -->
						<view class="hm-row"
							:style="{'transform': 'translate3d(0,' + (row.HMDrag_sort-index)*100 + '%,-1px)'}"
							:data-sort="row.HMDrag_sort" :data-id="row.HMDrag_id" :id="row.HMDrag_id">
							<view class="modules">
								<!-- 内容  -->
								<view class="row-content" @click="toggleCheck(row)">
									<view class="row" @tap="triggerClick(row.HMDrag_sort, row)"
										:style="{'height': rowHeight+'px'}">
										<!-- image v-if="row.icon" class="icon" :src="row.icon"></image> -->
										<view class="checkbox">
											<view :class="{ 'checkbox-void':!row.isSelect,'checked':row.isSelect }">
											</view>
										</view>
										<text class="text">{{row.name}}
											<!-- <spen v-if="row.bookSourceComment">
											({{row.bookSourceComment}})
										</spen> -->
										</text>
									</view>
								</view>
								<!-- 拖拽图标 -->
								<view class="drag-content" :data-id="row.HMDrag_id" @touchstart="drag.touchstart"
									@touchmove="drag.touchmove" @touchend="drag.touchend">
									<view class="drag-icon" :style="{'height': rowHeight+'px'}">
										<text class="iconfont icon-drag"></text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 数据跳板 -->
			<view id="dataView" style="display: none !important;" :data-guid="guid" :prop="wxsDataStr"
				:change:prop="drag.receiveData">触发wxs跳板,请勿删除</view>
			<!-- #ifdef APP-VUE || H5 -->
			<view style="display: none !important;" :prop="scrollCommand" :change:prop="renderjs.runCommand">
				触发renderjs跳板,请勿删除</view>
				<!-- #endif -->
		</view>
	</view>
</template>
<script src="./drag.wxs" module="drag" lang="wxs"></script>
<script module="renderjs" lang="renderjs">
	// APP or H5端 renderjs 实现拖拽中的自动滚动列表
	export default {
		data() {
			return {
				e: null,
				ScrollView: null,
			}
		},
		methods: {
			runCommand(e) {
				if (e == null) {
					return
				}
				this.e = e;
				this.getScrollView(document.getElementById('scrollView_' + this.e.guid))
				window.cancelAnimationFrame(this.AnimationFrameID);
				this.AnimationFrameID = window.requestAnimationFrame(this.Animation);
				if (e.command == "stop") {
					window.cancelAnimationFrame(this.AnimationFrameID);
					return;
				}
			},
			Animation() {
				if (this.e.command == "stop") {
					window.cancelAnimationFrame(this.AnimationFrameID);
					return;
				}
				// 计算最大滚动高度
				let maxScrollTop = this.e.rowLength * this.e.rowHeight - this.e.ListHeight;
				if (this.e.command == "up") {
					this.ScrollView.scrollTop -= 3
				} else if (this.e.command == "down") {
					this.ScrollView.scrollTop += 3;
				}
				if (this.ScrollView.scrollTop < 0) {
					this.ScrollView.scrollTop = 0;
					window.cancelAnimationFrame(this.AnimationFrameID);
				}
				if (this.ScrollView.scrollTop > maxScrollTop) {
					this.ScrollView.scrollTop = maxScrollTop;
					window.cancelAnimationFrame(this.AnimationFrameID);
				}
				this.AnimationFrameID = window.requestAnimationFrame(this.Animation);
			},
			getScrollView(DOM) {

				if (this.ScrollView != null) {
					return this.ScrollView;
				}
				let styleStr = DOM.getAttribute('style');

				if (DOM.className == 'uni-scroll-view' && styleStr != null && styleStr.indexOf('overflow') > -1 && styleStr
					.indexOf(
						'auto') > -1) {
					this.ScrollView = DOM;
					return DOM;
				} else {
					this.getScrollView(DOM.firstChild);
				}
			}
		}
	}
</script>
<script>
	/**  
	 * 拖拽排序组件 HM-dragSort
	 * @description 拖拽排序组件 HM-dragSort
	 * @property {ObjectArray} list = [] 列表数据,数据格式[{"name": "花呗","icon": "/static/img/1.png",}]
	 * @property {Boolean} feedbackGenerator = [true|false] 是否拖动触感反馈  
	 * @property {Boolean} longTouch = [true|false] 是否长按拖动  
	 * @property {Boolean} autoScroll = [true|false] 是否拖拽至边缘自动滚动列表  
	 * @property {Number} longTouchTime = [] 选填,触发长按时长,单位:ms,默认350ms,不支持微信小程序 
	 * @property {Number} listHeight = 0 选填,可拖动列表整体的高度,单位:px,默认等于窗口高度 
	 * @property {Number} rowHeight = 44 选填,行高,单位:px,默认44px
	 * @property {String} listBackgroundColor  选填,列表底色,注意是列表的底色,不是行的底色,默认#FFFFFF
	 * @event {Function} change 行位置发生改变时触发事件 返回值:{index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据'}   
	 * @event {Function} confirm 拖拽结束且行位置发生了改变触发事件 返回值:{index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据',list:'整个列表拖动后的数据'}  
	 */
	export default {
		name: 'HM-dragSort',
		data() {
			return {
				guid: "",
				isAppH5: true, //是否APPH5 无需手动配置
				shadowRow: {}, // 存放被拖拽行数据
				// 列表数据
				dragList: [],
				ListHeight: this.listHeight, // scroll-view列表高度

				show: false,
				actionsList: [{
						name: '全部选择',
						color: '#000',
						fontSize: '16'
					},
					{
						name: '全部取消',
						color: '#000',
						fontSize: '16'
					}
				],

				// 控制滑动
				scrollViewTop: 0, // 滚动条位置
				scrollCommand: null, //传递renderjs数据
				isHoldTouch: false, //是否正在拖拽
				isScrolling: false, //是否正在滚动视图
				scrollAnimation: false, //滚动动画 在微信端开启
				scrollTimer: null, //定时器-控制滚动 微信小程序端使用 实现类似requestAnimationFrame效果
				wxsDataObj: [],
				wxsDataStr: "[]"
			}
		},
		// #ifdef VUE3
		emits: ['change', 'confirm'],
		// #endif
		props: {
			//是否开启拖动震动反馈
			feedbackGenerator: {
				value: Boolean,
				default: true
			},
			// 是否开启长按拖动
			longTouch: {
				value: Boolean,
				default: false
			},
			autoScroll: {
				value: Boolean,
				default: true
			},
			longTouchTime: {
				value: Number,
				default: 300
			},
			// 列表数据
			list: {
				value: Array,
				default: []
			},
			// 行高度 默认44行高
			rowHeight: {
				value: Number,
				default: 44
			},
			// 组件高度 默认windowHeight满屏
			listHeight: {
				value: Number,
				default: 0
			},
			listBackgroundColor: {
				value: String,
				default: "#fff"
			}
		},
		watch: {
			longTouch(val) {
				// #ifdef VUE3
				if (!val) {
					console.error('vue3目前仅支持长按拖拽!');
				}
				// #endif

				this.pushWxsData('longTouch', val);
			},
			longTouchTime(val) {
				this.pushWxsData('longTouchTime', val);
			},
			feedbackGenerator(val) {
				this.pushWxsData('feedbackGenerator', val);
			},
			autoScroll(val) {
				this.pushWxsData('autoScroll', val);
			},
			list: {
				handler(val) {
					this.initList(val); //数据变化重新初始化list
				},
				immediate: true,
				deep: true
			},
			listHeight: {
				handler(val) {
					this.ListHeight = val;
					this.pushWxsData('ListHeight', this.ListHeight);
				},
				immediate: true
			}
		},
		mounted() {
			this.guid = this.getGuid();

			const res = uni.getSystemInfoSync();
			// #ifdef MP-WEIXIN
			let state = this.compareVersion(res.hostVersion, '2.14.2');
			if (state < 0) {
				console.error('当前微信基础库:' + res.hostVersion + ',HM-dragSorts组件仅支持微信基础库2.14.2+,请切换基础库!');
			}
			this.scrollAnimation = true;
			this.isAppH5 = false;
			// #endif
			if (this.listHeight == 0) {
				this.ListHeight = res.windowHeight;
				// #ifdef VUE3
				// vue3 要减去导航栏和状态栏高度
				if (res.windowHeight == res.screenHeight) {
					this.ListHeight = res.windowHeight - 45 - res.statusBarHeight;
				}
				// #endif
			}
			this.pushWxsData('isAppH5', this.isAppH5);
			this.pushWxsData('ListHeight', this.ListHeight);
			this.pushWxsData('longTouch', this.longTouch);
		},
		methods: {
			leftClick() {
				uni.navigateBack()
			},
			rightClick() {
				this.show = true
			},
			close() {
				this.show = false
			},
			selectClick(e) {
				if (e.name === "全部选择") {
					for (let i = 0; i < this.dragList.length; i++) {
						this.dragList[i].isSelect = true;
					}

				} else if (e.name === "全部取消") {
					for (let i = 0; i < this.dragList.length; i++) {
						this.dragList[i].isSelect = false;
					}
				}
				
				let list = JSON.parse(JSON.stringify(this.dragList));
				let tmpList = [];
				for (let i = 0, len = list.length; i < len; i++) {
					// 检测清除临时id和sort
					delete list[i].HMDrag_id;
					delete list[i].HMDrag_sort;
					tmpList[i] = list[i];
				}
				this.$emit('toggleCheck', {
					list: tmpList
				});

			},
			toggleCheck(item) {
				const index = this.dragList.indexOf(item);
				//改变选中
				if (index >= 0) {
					this.dragList[index].isSelect = !this.dragList[index].isSelect
				}

				let list = JSON.parse(JSON.stringify(this.dragList));
				let tmpList = [];
				for (let i = 0, len = list.length; i < len; i++) {
					// 检测清除临时id和sort
					delete list[i].HMDrag_id;
					delete list[i].HMDrag_sort;
					tmpList[i] = list[i];
				}
				this.$emit('toggleCheck', {
					list: tmpList
				});

			},
			getGuid() {
				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
				return (S4() + S4() + "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4());
			},

			initList() {
				let tmpList = JSON.parse(JSON.stringify(this.list));
				for (let i = 0, len = tmpList.length; i < len; i++) {
					// 组件内赋予临时id和sort
					if (!tmpList[i].hasOwnProperty('HMDrag_id')) {
						tmpList[i].HMDrag_id = 'HMDragId_' + this.getGuid();
					}
					tmpList[i].HMDrag_sort = i;
				}
				if (this.dragList.length > 0) {
					setTimeout(() => {
						this.dragList.splice(0, this.dragList.length, ...tmpList);
					}, 50)
				} else {
					this.dragList = JSON.parse(JSON.stringify(tmpList));
				}
				this.pushWxsData('lastInitTime', (new Date()).valueOf());
			},
			loadShadowRow(e) {
				this.shadowRow = this.getMoveRow(e.rowSort);
			},

			//兼容微信小程序震动
			vibrate() {
				uni.vibrateShort()
			},
			// 控制自动滚动视图
			pageScroll(e) {
				// 滚动 up-上滚动 down-下滚动
				if (e.command == "up" || e.command == "down") {
					if (!this.isHoldTouch) {
						this.isHoldTouch = true;
						this.scrollViewTop = e.scrollTop;
					}
					if (this.isScrolling) {
						return;
					};
					this.isScrolling = true;

					if (this.isAppH5) {
						// APP端和H5端 执行renderjs的滚动
						e.ListHeight = this.ListHeight;
						e.rowHeight = this.rowHeight;
						e.rowLength = this.dragList.length;
						this.scrollCommand = e;
						return;
					}

					// 微信小程序执行以下逻辑
					this.scrollTimer != null && clearInterval(this.scrollTimer);
					let maxHeight = this.rowHeight * this.dragList.length + 1 - this.ListHeight;
					let runTick = true;
					// 逻辑层传递到视图层需要时间，可能会出现滚动不流畅现象
					this.scrollTimer = setInterval(() => {
						if (!runTick) {
							return;
						}
						this.runScroll(e.command, maxHeight);
						runTick = false;
						this.$nextTick(function() {
							runTick = true;
						})
					}, 16.6)
				}
				// 停止滚动
				if (e.command == "stop") {
					// #ifdef APP-PLUS || H5
					// 停止指定传递到renderjs
					this.scrollCommand = e;
					// #endif
					this.isScrolling && this.stopScroll();
				}
			},
			// 微信端的滚动
			runScroll(command, maxHeight) {
				if (command == "up") {
					this.scrollViewTop -= 5
				}
				if (command == "down") {
					this.scrollViewTop += 5;
				}
				if (this.scrollViewTop < 0) {
					this.scrollViewTop = 0;
					clearInterval(this.scrollTimer);
				}
				if (this.scrollViewTop > maxHeight) {
					this.scrollViewTop = maxHeight;
					clearInterval(this.scrollTimer);
				}
			},
			//停止滚动
			stopScroll() {
				this.scrollTimer != null && clearInterval(this.scrollTimer);
				this.isScrolling = false;
				this.scrollingtop = 0;
			},
			// 
			getMoveRow(HMDrag_sort) {
				for (var i = 0, len = this.dragList.length; i < len; i++) {
					if (this.dragList[i].HMDrag_sort == HMDrag_sort) {
						return JSON.parse(JSON.stringify(this.dragList[i]));
					}
				}
			},
			// 
			triggerClick(index, row) {
				var tmpRow = JSON.parse(JSON.stringify(row));
				// 清除临时id和sort
				delete tmpRow.HMDrag_id;
				delete tmpRow.HMDrag_sort;
				this.$emit('onclick', {
					index: index,
					row: JSON.parse(JSON.stringify(tmpRow))
				});
			},
			change(e) {
				e.moveRow = this.getMoveRow(e.index);
				// 清除组件临时赋予的id
				delete e.moveRow.HMDrag_id;
				delete e.moveRow.HMDrag_sort;
				this.$emit('change', e);
			},
			sort(e) {
				this.stopScroll();
				this.isHoldTouch = false;
				let moveRow = this.getMoveRow(e.index);
				// 检测清除临时id和sort
				delete moveRow.HMDrag_id;
				delete moveRow.HMDrag_sort;

				let list = JSON.parse(JSON.stringify(this.dragList));
				let tmpList = [];
				for (let i = 0, len = list.length; i < len; i++) {
					// 检测清除临时id和sort
					delete list[i].HMDrag_id;
					delete list[i].HMDrag_sort;
					let index = e.sortArray[i];
					this.dragList[i].HMDrag_sort = index;
					tmpList[index] = list[i];
				}
				// 触发组件confirm 并传递数据
				this.$emit('confirm', {
					list: tmpList,
					index: e.index,
					moveTo: e.offset,
					moveRow: moveRow
				});

			},
			getNowList() {
				let list = JSON.parse(JSON.stringify(this.dragList));
				let tmpList = [];
				for (let i = 0, len = list.length; i < len; i++) {
					let tmpSotr = list[i].HMDrag_sort;
					tmpList[tmpSotr] = list[i];
					// 检测清除临时id和sort
					delete tmpList[tmpSotr].HMDrag_id;
					delete tmpList[tmpSotr].HMDrag_sort;
				}
				return tmpList;
			},
			splice() {
				let deleteIndex = arguments[0];
				let deleteLength = arguments[1];
				let len = arguments.length;
				let waitPushList = [];
				for (let i = 2; i < len; i++) {
					var newRow = arguments[i]
					newRow.HMDrag_id = 'HMDragId_' + this.getGuid();
					newRow.HMDrag_sort = deleteIndex + i - 2;
					waitPushList.push(newRow);
				}
				let minDeleteSort = deleteIndex;
				let maxDeleteSort = deleteLength > 0 ? deleteIndex + deleteLength - 1 : deleteIndex;
				let offsetSort = waitPushList.length - deleteLength;
				let deleteIndexArray = [];

				for (let i = this.dragList.length - 1; i >= 0; i--) {
					let row = this.dragList[i];
					let rowSort = row.HMDrag_sort;
					// 跳过
					if (rowSort < minDeleteSort) {
						continue;
					}
					// 删除
					if (deleteLength > 0 && rowSort >= minDeleteSort && rowSort <= maxDeleteSort) {
						this.dragList.splice(i, 1);
						continue;
					}
					if (offsetSort != 0 && rowSort >= maxDeleteSort) {
						let newSort = rowSort + offsetSort;
						this.dragList[i].HMDrag_sort = newSort;

					}
				}
				this.dragList.push(...waitPushList);
				this.pushNewSort();

				let list = JSON.parse(JSON.stringify(this.dragList));
				let tmpList = this.getNowList();
				return tmpList;
			},
			push() {
				let len = arguments.length;
				let waitPushList = [];
				let startSotr = this.dragList.length;
				for (let i = 0; i < len; i++) {
					var newRow = arguments[i]
					newRow.HMDrag_id = 'HMDragId_' + this.getGuid();
					newRow.HMDrag_sort = startSotr + i;
					waitPushList.push(newRow);
				}
				this.dragList.push(...waitPushList);
				this.pushNewSort();
				let tmpList = this.getNowList();
				return tmpList;
			},
			unshit() {
				let len = arguments.length;
				let waitPushList = [];
				for (let i = 0; i < len; i++) {
					var newRow = arguments[i]
					newRow.HMDrag_id = 'HMDragId_' + this.getGuid();
					newRow.HMDrag_sort = i;
					waitPushList.push(newRow);
				}
				for (let i = this.dragList.length - 1; i >= 0; i--) {
					let row = this.dragList[i];
					let rowSort = row.HMDrag_sort;
					let newSort = rowSort + len;
					this.dragList[i].HMDrag_sort = newSort;
				}
				this.dragList.push(...waitPushList);
				this.pushNewSort();
				let tmpList = this.getNowList();
				return tmpList;
			},
			pushNewSort() {
				let sortArray = [];
				for (let i = 0, len = this.dragList.length; i < len; i++) {
					sortArray.push(this.dragList[i].HMDrag_sort);
				}
				this.pushWxsData('sortArray', sortArray);
				this.pushWxsData('lastInitTime', (new Date()).valueOf());
			},
			pushWxsData(key = null, val = null) {
				this.wxsDataObj.splice(0, 8, ['guid', this.guid],
					['listLength', this.dragList.length],
					['ListHeight', this.ListHeight],
					['isAppH5', this.isAppH5],
					['longTouch', this.longTouch],
					['longTouchTime', this.longTouchTime],
					['feedbackGenerator', this.feedbackGenerator],
					['autoScroll', this.autoScroll]);
				let index = -1;
				let sotrArrayIndex = -1;
				for (let i = 0; i < this.wxsDataObj.length; i++) {
					if (this.wxsDataObj[i][0] == key) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					this.wxsDataObj[index][1] = val;
					if (key == 'sortArray') {
						sotrArrayIndex = index;
					}
				} else {
					this.wxsDataObj.push([key, val]);
					if (key == 'sortArray') {
						sotrArrayIndex = this.wxsDataObj.length - 1;
					}
				}

				if (this.guid == "") {
					return;
				}
				this.wxsDataStr = JSON.stringify(this.wxsDataObj);
			},
			compareVersion(v1, v2) {
				v1 = v1.split('.')
				v2 = v2.split('.')
				const len = Math.max(v1.length, v2.length)

				while (v1.length < len) {
					v1.push('0')
				}
				while (v2.length < len) {
					v2.push('0')
				}
				for (let i = 0; i < len; i++) {
					const num1 = parseInt(v1[i])
					const num2 = parseInt(v2[i])

					if (num1 > num2) {
						return 1
					} else if (num1 < num2) {
						return -1
					}
				}
				return 0
			}

		}
	}
</script>

<style lang="scss" scoped>
	//默认
	$row-background-color: #fff;
	$border-color :#c8c7cb;
	$shadow-color-moveing :rgba(0, 0, 0, 0.5);
	//Dark模式
	$Dark-row-background-color: #000;
	$Dark-border-color :#3d3d40;
	$Dark-shadow-color-moveing :rgba(0, 0, 0, 0.5);

	//字体图标 拖拽图标
	@font-face {
		font-family: "HM-DS-font";
		src: url('data:font/truetype;charset=utf-8;base64,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') format('truetype');
	}

	.iconfont {
		font-family: "HM-DS-font" !important;
		font-style: normal;

		&.icon-drag {
			&:before {
				content: "\e6e4";
			}
		}

	}

	// 定义颜色 start
	//默认颜色
	.color,
	.rowBox-shadow {
		&.scroll-view {
			border-bottom: 1rpx $border-color solid;
			border-top: 1rpx $border-color solid;
		}

		.hm-row-shadow,
		.hm-row {
			.modules {
				.row-content {
					.row {
						border-bottom: solid 1rpx $border-color;
						background-color: $row-background-color;
					}
				}

				.drag-content {
					.drag-icon {
						border-bottom: solid 1rpx $border-color;
						background-color: $row-background-color;
					}
				}
			}

			&.move {
				box-shadow: 0 1px 5px $shadow-color-moveing;
			}
		}

	}

	// 暗黑模式
	@media (prefers-color-scheme: dark) {

		//Dark模式
		.color .rowBox-shadow {
			&.scroll-view {
				border-bottom: 1rpx $Dark-border-color solid;
				border-top: 1rpx $Dark-border-color solid;
			}

			.hm-row-shadow,
			.hm-row {
				.modules {
					.row-content {
						.row {
							border-bottom: solid 1rpx $Dark-border-color;
							background-color: $Dark-row-background-color;
						}
					}

					.drag-content {
						.drag-icon {
							border-bottom: solid 1rpx $Dark-border-color;
							background-color: $Dark-row-background-color;
						}
					}
				}

				&.move {
					box-shadow: 0 1px 5px $Dark-shadow-color-moveing;
				}
			}
		}
	}

	// 定义颜色 end 
	.HM-drag-sort {
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;

		.scroll-view {
			box-sizing: border-box;
		}

		.rowBox,
		.rowBox-shadow {
			width: 100%;

			.hm-row-shadow,
			.hm-row {
				display: flex;
				flex-direction: row;
				width: 100%;

				.modules {
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					box-sizing: border-box;

					.row-content {
						width: 100%;
						flex-shrink: 1;

						.row {
							display: flex;
							align-items: center;
							padding-left: 12px;

							box-sizing: border-box;

							.icon {
								width: 30px;
								height: 30px;
								border-radius: 6px;
								margin-right: 13px;
							}

							.text {
								font-size: 13px;
							}
						}
					}

					.drag-content {
						flex-shrink: 0;

						.drag-icon {
							width: 50px;
							display: flex;
							justify-content: center;
							align-items: center;
							box-sizing: border-box;

							.iconfont {
								font-size: 22px;
								color: #c7c7cb;
							}
						}
					}
				}
			}

			.hm-row-shadow {

				&.move {
					opacity: 0.8;

					view {
						border-bottom-width: 0;
					}
				}
			}

			.hm-row {
				opacity: 1;

				&.hide {
					opacity: 0;
				}

				&.ani {
					transition: transform 0.2s;
					-webkit-transition: transform 0.2s;
				}
			}

			&:last-child {
				.hm-row {
					view {
						border-bottom-width: 0;
					}
				}
			}
		}

		.rowBox-shadow {
			position: absolute;
			z-index: 100;
			display: none;

			&.show {
				display: flex !important;
			}

			&.hide {
				display: none !important;
			}
		}

		.list {
			display: flex;
			flex-direction: column;
			// transform-style:preserve-3d;
		}
	}

	.checkbox {
		height: 20px;
		width: 20px;
		vertical-align: -0.8rem;
		color: #fff;
		cursor: pointer;
		display: inline-block;
		margin: .4rem;
		outline: none;
	}

	.checkbox-void {
		width: 100%;
		height: 100%;
		border: 2px solid #ffc107;
		transition: all .15s ease-out 0s;
	}

	.checkbox-void::before {
		display: block;
		position: relative;
		content: "";
		width: 100%;
		height: 100%;
		border-radius: 50%;
		animation: expand-fade 1s forwards;
	}

	@keyframes expand-fade {
		0% {
			transform: scale(1);
			background-color: #ffc107;
			opacity: 1;
		}

		45% {
			transform: scale(2.5);
			background-color: #ffc107;
			opacity: 0.5;
		}

		100% {
			transform: scale(2.5);
			opacity: 0;
		}
	}

	.checked {
		height: 100%;
		width: 100%;
		background: #ffc107;
		transition: all .15s ease-out 0s;
	}

	.checked:before,
	.checked:after {
		display: block;
		position: relative;
		content: "";
		// transform: translate(-50%, -50%);
		background: #fff;
		transform-origin: 0 0;
	}

	.checked:before {
		top: 50%;
		left: 20%;
		width: 30%;
		height: 10%;
		transform: rotate(45deg);
		animation: line-before .15s ease-out forwards;
	}

	.checked:after {
		// left: 58%;
		// top: 5%;
		opacity: 0;
		top: 65%;
		left: 30%;
		width: 70%;
		height: 10%;
		transform: rotate(-45deg);
		animation: line-after .3s ease-out forwards;
		// animation-delay: .2s;
	}

	@keyframes line-before {
		0% {
			width: 0%;
		}

		100% {
			width: 30%;
		}
	}

	@keyframes line-after {
		0% {
			opacity: 1;
			width: 0%;
		}

		100% {
			opacity: 1;
			width: 70%;
		}
	}
</style>