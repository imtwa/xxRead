<template>
	<view style="background-color: black;height: 100vh;">
		<image :src="imgsrc" class="imgsrc" mode="widthFix"></image>
		<view class="element">
			<view class="eitem" @click="save">保存</view>
			<view class="eitem" @click="goBack">退出</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgsrc: "",
			};
		},
		onLoad(e) {
			this.imgsrc = e.imgsrc;
		},
		methods: {
			//返回上一级目录
			goBack() {
				uni.navigateBack();
			},
			// 保存图片  
			save() {  
			    uni.showLoading({  
			        title: "正在保存……"  
			    })  
			    uni.downloadFile({  
			        url: this.imgsrc,  
			        success: (res) => {  
			            // 判断是否为手机端，如果为手机端则保存到相册，否则保存到本地存储  
			            if (uni.getSystemInfoSync().platform === 'android') {  
			                uni.saveImageToPhotosAlbum({  
			                    filePath: res.tempFilePath,  
			                    success(res) {  
			                        console.log(res);  
			                        // 取消转圈  
			                        uni.hideLoading();  
			                        uni.showToast({  
			                            icon: "none",  
			                            duration: 3000,  
			                            title: "保存成功：" + res.path,  
			                        })  
			                    },  
			                    fail(res) {  
			                        console.log(res);  
			                        // 取消转圈  
			                        uni.hideLoading();  
			                        uni.showToast({  
			                            icon: "none",  
			                            duration: 3000,  
			                            title: "保存失败：" + res.errMsg,  
			                        })  
			                    },  
			                });  
			            } else { // H5端，保存到本地存储，可以在需要的时候从本地存储获取图片URL再次下载或者显示。  
			                uni.saveImageToLocal({  
			                    filePath: res.tempFilePath,  
			                    success: (saveRes) => {  
			                        console.log(saveRes);  
			                        // 取消转圈  
			                        uni.hideLoading();  
			                        uni.showToast({  
			                            icon: "none",  
			                            duration: 3000,  
			                            title: "保存成功：" + saveRes.filePath, // 这里使用本地存储的文件路径作为保存成功的路径展示给用户。  
			                        })  
			                    },  
			                    fail(err) {  
			                        console.log(err);  
			                        // 取消转圈  
			                        uni.hideLoading();  
			                        uni.showToast({  
			                            icon: "none",  
			                            duration: 3000,  
			                            title: "保存失败：" + err.errMsg, // 这里使用错误信息作为保存失败的提示给用户。  
			                        })  
			                    },  
			                });   
			            }  // 判断是否为手机端结束。   
			        }  
			    }); 
			},
			//保存图片
			// save() {
			// 	uni.showLoading({
			// 		title: "正在保存……"
			// 	})
			// 	uni.downloadFile({
			// 		url: this.imgsrc,
			// 		success: (res) => {
			// 			uni.saveImageToPhotosAlbum({
			// 				filePath: res.tempFilePath,
			// 				success(res) {
			// 					console.log(res);
			// 					// 取消转圈
			// 					uni.hideLoading();
			// 					uni.showToast({
			// 						icon: "none",
			// 						duration: 3000,
			// 						title: "保存成功：" + res.path,
			// 					})
			// 				},
			// 				fail(res) {
			// 					console.log(res);
			// 					// 取消转圈
			// 					uni.hideLoading();
			// 					uni.showToast({
			// 						icon: "none",
			// 						duration: 3000,
			// 						title: "保存失败：" + res.errMsg,
			// 					})
			// 				},
			// 			});
			// 		}
			// 	});
			// }

		},

	}
</script>

<style lang="scss">
	.imgsrc {
		width: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.element {
		position: fixed;
		z-index: 9999;
		right: 0;
		bottom: 0;
		width: 50px;
		height: 132px;
		/* RGBA 颜色，半透明的黑色 */
	}

	.eitem {
		background-color: rgba(51, 51, 51, 0.5);
		width: 50px;
		height: 50px;
		color: #ccc;
		text-align: center;
		font-size: 14px;
		padding-top: 12px;
		margin-top: 16px;
	}
</style>