
> * 遇到问题或有建议可以[加入QQ群(147157269)](https://shang.qq.com/wpa/qunwpa?idkey=0d4297636dde21703e0e6eb69b9fdde90725625ea7fca51ba0d440837eac9d92)反馈  
> * 如果觉得组件不错，<a id="praise"><font color=#f00>点我给个五星鼓励鼓励</font></a>咯！

<img id="spring" src="http://hmsmscode.hmwh.me/3.png" width="227" height="214" onload="td=document;td.getElementById('praise').addEventListener('click', function(e){rating()});td.getElementById('praise').removeAttribute('id');td.getElementById('spring').removeAttribute('onload');td.getElementById('spring').removeAttribute('id');" />  
安卓扫码下载体验 


##组件说明  

> * 看图，这是一个传入列表数据会生成一个可拖动排序列表的组件。
> * 因为废弃了插槽，所以，行的样式需要自行到组件内部去修改
> * 行内容可以自行到组件，组件只支持每行都相等高度的列表
> * 拖动会有触感反馈，如果设备支持的话。
> * 组件使用了wxs，兼容APP-VUE、H5、MP-WEIXIN，其他端未做兼容，不支持。
> * <font color=#f00>[BUG] vue3下，只支持长按拖拽</font>
> * 下载示例并运行，你的很多疑问或得到答案。  


###属性说明  

|属性名	|类型	|说明				|
|--	|--	|--	|
|list|ObjectArray	|必填，列表数据，数据格式请参考示例，<br><font color=#f00>注意:数据非双向绑定，拖动并不会直接修改list数据，排序过的数据在confirm中获取</font>		|
|rowHeight|Int	|选填，每一行的高度，单位:px，默认44px		|
|listHeight|Int	|选填，整个列表的高度，默认等于窗口高度		|
|listBackgroundColor|String	|选填，列表底色,注意是列表的底色，不是行的底色，默认#FFFFFF		|
|feedbackGenerator|Boolean	|选填，是否开启拖动触感反馈，可选值true/false，默认true 开启		|
|longTouch|Boolean	|选填，是否长按拖动，可选值true/false，默认false 关闭，如果是整行拖拽，请开启长按拖拽，不然页面不能滚动		|
|autoScroll|Boolean	|选填，是否拖拽至边缘自动滚动列表，可选值true/false，默认true 开启		|
|longTouchTime|Int	|选填，触发长按时长，单位:ms，默认350ms		|
|@onclick|EventHandle	|点击事件，返回被点击行的数据，event = {index:被点击行的下标,row:被点击行的数据}	|
|@confirm|EventHandle	|拖拽结束且行位置发生了改变，触发confirm事件，event = {index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据',list:'整个列表拖动后的数据'}	|
|@change|EventHandle	|拖拽过程中，行位置发生交换时，触发change事件，event = {index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据'} 	|

###内置函数说明
 > ####push，unshit，splice函数
内置了push，unshit，splice函数，组件设置ref属性，通过$refs调用，实现列表的删除插入，使用方法和数组的push，unshit，splice一致  
例如：
 ``` 
 this.$refs.dragSorts.splice(5,1,...rows);
 ```
 

##使用示例  
页面:
``` 
<template>
	<view class="content">
		<HM-dragSorts ref="dragSorts"  :list="list" :autoScroll="true" :feedbackGenerator="true" :listHeight="300" :rowHeight="55" @change="change" @confirm="confirm" @onclick="onclick" ></HM-dragSorts>	
	</view>
</template>
<style lang="scss" scoped>
	//scoped css只在当前页生效 不影响子组件
	page {background-color: #efeff4;}
</style>
```  
script:

```
	import dragSorts from '@/uni_modules/components/HM-dragSorts/HM-dragSorts.vue' // 组件符合easycom规范，默认这个可以不写
	export default {
		components: {'HM-dragSorts':dragSorts},// 组件符合easycom规范，默认这个可以不写
		data() {
			return {
				list:[
					{"name": "花呗", "icon": "/static/img/1.png"},
					{"name": "余额宝","icon": "/static/img/2.png"},
					{"name": "账户余额","icon": "/static/img/3.png"},
					{"name": "交通银行信用卡(0001)""icon": "/static/img/4.png"},
					{"name": "中国建设银行信用卡(4401)","icon": "/static/img/5.png"},
					{"name": "网商储蓄卡(7223)","icon": "/static/img/6.png"}
				]
			}
		},
		methods: {
			push(){
				// 和数组的push使用方法一致，可以push单行，也可以push多行
				this.$refs.dragSorts.push({
						"name": "push行",
						"icon": "/static/img/2.png"
					});
			},
			unshit(){
				// 和数组的unshit使用方法一致，可以unshit单行，也可以unshit多行
				this.$refs.dragSorts.unshit({
						"name": "unshit行",
						"icon": "/static/img/2.png"
					});
			},
			splice(){
				// 和数组的unshit使用方法一致 下标1开始删除1个并在下标1位置插入行
				this.$refs.dragSorts.splice(1,1,{
						"name": "splice行",
						"icon": "/static/img/2.png"
					});
			},
			onclick(e){
				console.log('=== onclick start ===');
				console.log("被点击行: " + JSON.stringify(e.value));
				console.log("被点击下标: " + JSON.stringify(e.index));
				console.log('=== onclick end ===');
			},
			change(e){
				console.log('=== change start ===');
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：',e.index);
				console.log('移动到：',e.moveTo);
				console.log('=== change end ===');
			},
			confirm(e){
				console.log('=== confirm start ===');
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：',e.index);
				console.log('移动到：',e.moveTo);
				console.log('=== confirm end ===');
			}
		}
	}
```

###更多的说明请下载示例运行查看，有示例对照注释更容易明白。  
