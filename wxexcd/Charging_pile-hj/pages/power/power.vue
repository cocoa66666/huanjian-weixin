<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map id="myMap" show-location style="width: 100%; height: 100vh;" :latitude="latitude" :longitude="longitude"
				 :markers="markers" :scale="scale" @markertap='showPowerDetail' @callouttap='showPowerDetail' @touchmove="mask"
				 @touchend="getData" @tap="mask">
				</map>
			</view>
		</view>
		<view class="search">
			<image class="serach_img" src="../../static/img/sousuo3x.png"></image>
			<input @tap="getInput" :v-model="inputValue" @input="onKeyInput" class="search_ipt" placeholder="请输入你想要去的地点"
			 placeholder-class="search_pla" value=""></input>
		</view>
		<view class="search_content" v-if="inputValue!=''&&mask1==1">
			<view @tap="moveToSelect(item.location.lat,item.location.lng)" class="search_content_word" v-for="(item,index) in selectRes"
			 :key='index'>{{item.title}}</view>
		</view>
		<image v-if="egCode == '' || egCode == undefined || egCode == null" class="search_scan" src="../../static/img/saoma23x.png"
		 @tap="scan"></image>
		<image v-if="egCode != '' && egCode != undefined && egCode != null" class="search_scan" src="../../static/img/saoma23x.png"
		 @tap="warn"></image>
		<image class="search_img" src="../../static/img/daiyuan3x.png" @tap="moveToNow"></image>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js';
	// 引入SDK核心类
	import QQMapWX from '../../static/js/qqmap-wx-jssdk.js';
	var qqmapsdk = new QQMapWX({
		key: utlis.key // 必填
	});
	export default {
		data() {
			return {
				title: 'map',
				latitude: '', //目的地纬度
				longitude: '', //目的地经度 
				latitudeFinal: '', //目的地纬度
				longitudeFinal: '', //目的地经度 
				polyline: [], //路线
				scale: 12, //缩放级别
				latFrom: '',
				lngFrom: '',
				latTo: '',
				lngTo: '',
				circles: [],
				electricStationList: '',

				markers: [],
				inputValue: '',
				selectRes: '',
				mask1: 0,
				egCode: '1'
			}
		},
		onLoad() {
			let self = this;
			// 获取现在位置
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
						// 授权失败
						uni.showModal({
							title: '"联城联充"需要获取你的地理位置',
							content: '你的位置将用于电站展示',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting({
										success: (res) => {
											uni.getLocation({
												type: 'gcj02', //返回可以用于uni.openLocation的经纬度
												success: function(res) {
													self.latitude = res.latitude;
													self.longitude = res.longitude;
													self.getData()
												},
												fail: () => {
													uni.showModal({
														// title: '提示',
														content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
														showCancel: false,
														success: function(res) {
															if (res.confirm) {
																self.latitude = 30.525865;
																self.longitude = 114.306052;
																self.getData()
															}
														}
													})
												}
											})
										}
									})
								}
								if (res.cancel) {
									uni.getLocation({
										type: 'gcj02', //返回可以用于uni.openLocation的经纬度
										success: function(res) {
											self.latitude = res.latitude;
											self.longitude = res.longitude;
											self.getData()
										},
										fail: () => {
											uni.showModal({
												// title: '提示',
												content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
												showCancel: false,
												success: function(res) {
													if (res.confirm) {
														self.latitude = 30.525865;
														self.longitude = 114.306052;
														self.getData()
													}
												}
											})
										}
									})
								}
							}
						})
					} else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
						uni.getLocation({
							type: 'gcj02', //返回可以用于uni.openLocation的经纬度
							success: function(res) {
								self.latitude = res.latitude;
								self.longitude = res.longitude;
								self.getData()
							},
							fail: () => {
								uni.showModal({
									// title: '提示',
									content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											self.latitude = 30.525865;
											self.longitude = 114.306052;
											self.getData()
										}
									}
								})
							}
						})
					} else { //授权后默认加载
						uni.getLocation({
							type: 'gcj02', //返回可以用于uni.openLocation的经纬度
							success: function(res) {
								self.latitude = res.latitude;
								self.longitude = res.longitude;
								self.getData()
							},
							fail: () => {
								uni.showModal({
									// title: '提示',
									content: '获取用户位置失败，请开启定位功能，已为您定位到武汉',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											self.latitude = 30.525865;
											self.longitude = 114.306052;
											self.getData()
										}
									}
								})
							}
						})
					}
				}
			});
		},
		onShow() {
			let self = this;
			let egCode = uni.getStorageSync('egCode')
			this.egCode = egCode;
		},
		methods: {
			mask() {
				this.mask1 = 0
			},
			selectResult() {
				let self = this;
				uni.request({
					url: "https://apis.map.qq.com/ws/place/v1/suggestion",
					data: {
						keyword: self.inputValue,
						// region: '武汉',
						// location: '30.49984,114.34253',
						get_subpois: 1,
						page_size: 10,
						key: 'G6HBZ-47UW4-W47U6-DXVNE-HSYDQ-EAFF3'
					},
					success: (res) => {
						//返回搜索结果
						self.selectRes = res.data.data
					}
				})
			},
			// 回到当前位置
			moveToNow() {
				var map = uni.createMapContext('myMap');
				map.moveToLocation();
				//获取当前缩放等级
				// map.getScale({
				// 	success:(res)=>{
				// 		console.log(res)
				// 	}
				// })
				// // 获取地图中心位置
				// map.getCenterLocation({
				// 	success(res) {
				// 		console.log(res)
				// 	}
				// });
			},
			// 前往搜索位置
			moveToSelect(a, b) {
				console.log(a, b)
				this.mask1 = 0
				var map = uni.createMapContext('myMap');
				map.moveToLocation({
					latitude: a,
					longitude: b
				});
				this.getData();
			},
			showPowerDetail(e) {
				console.log(e)
				uni.navigateTo({
					url: '/pages/powerDetail/powerDetail' + e.markerId
				})
			},
			onKeyInput: function(event) {
				let self = this;
				this.mask1 = 1
				this.inputValue = event.target.value
				this.selectResult()
			},
			getInput: function(event) {
				let self = this;
				this.mask1 = 1
				this.selectResult()
			},
			warn() {
				uni.navigateTo({
					url: '/pages/charging/charging'
				})
			},
			// 扫码充电
			scan() {
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						let data = {
							custName: uni.getStorageSync('custName'),
							ewmUrl: res.result
						}
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						// 扫码成功开始充电
						utlis.http("POST", 'appChargeStartQRCodeHj', data, function(
							res) {
							if (res.status == "success") {
								uni.setStorageSync('egCode', res.egCode)
								uni.setStorageSync('stationId', res.stationId)
								uni.setStorageSync('connectorID', res.connectorID)
								uni.hideLoading()
								uni.showToast({
									title: res.msg,
									duration: 3000,
									mask: true,
									icon: 'success'
								})
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/charging/charging'
									})
								}, 3000)
							} else {
								uni.hideLoading()
								uni.showToast({
									title: res.msg,
									duration: 3000,
									mask: true,
									icon: 'none'
								})
							}
						})
					}
				})
			},
			// 获取电站分布
			getData() {
				let self = this;
				let data = {}
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask: true
				// })
				utlis.http("POST", 'appElectricStationHj', data, function(res) {
					if (res.status == "success") {
						self.electricStationList = res.electricStationList
						self.markers = [];
						res.electricStationList.forEach(item => {
							let marker = {
								latitude: item.lat,
								longitude: item.lng,
								iconPath: '/static/img/dibiao_icon3x.png',
								width: 30,
								height: 30,
								id: '?id=' + item.esId + '&stationId=' + item.stationId + '&addr=' + item.addr + '&esName=' + item.esName +
									'&lat=' + item.lat + '&lng=' + item.lng,
								iconAppendStr: item.esName,
								iconAppendStrColor: "#55C87D",
								callout: {
									content: item.esName,
									fontize: 16,
									textAlign: 'center',
									bgColor: "#55C87D",
									color: "#fff",
									padding: 10,
									display: "ALWAYS",
									borderRadius: 5,
								}
							}
							self.markers.push(marker)
						})
						// uni.hideLoading()
					} else {
						// uni.hideLoading()
					}
				})
			},
		}
	}
</script>

<style>
	.search {
		position: fixed;
		top: 40rpx;
		left: 95rpx;
		width: 560rpx;
		height: 70rpx;
		background: #C1EFD1;
		border: 2rpx solid #4FB773;
		border-radius: 35rpx;
	}

	.serach_img {
		position: absolute;
		top: 20rpx;
		left: 36rpx;
		width: 30rpx;
		height: 30rpx;
	}

	.search_ipt {
		position: absolute;
		top: 10rpx;
		left: 78rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #4FB773;
		background: rgb(193, 239, 209);
	}

	.search_pla {
		font-size: 28rpx;
		color: #4FB773;
	}

	.search_img {
		width: 110rpx;
		height: 110rpx;
		position: fixed;
		right: 30rpx;
		bottom: 72rpx;
	}

	.search_scan {
		width: 110rpx;
		height: 110rpx;
		position: fixed;
		right: 30rpx;
		bottom: 212rpx;
	}

	.search_content {
		width: 560rpx;
		height: 560rpx;
		background: #FFFFFF;
		position: fixed;
		overflow: hidden;
		top: 120rpx;
		left: 95rpx;
		z-index: 1;
		border-radius: 35rpx;
		border: 2rpx solid #4FB773;
	}

	.search_content_word {
		margin-left: 36rpx;
		color: #666666;
		font-size: 28rpx;
		height: 70rpx;
		line-height: 70rpx;
		overflow: hidden;
		white-space: nowrap;
		width: 500rpx;
		box-sizing: border-box;
		padding-left: -6rpx;
		border-bottom: 2rpx solid #E5E5E5;
	}
</style>
