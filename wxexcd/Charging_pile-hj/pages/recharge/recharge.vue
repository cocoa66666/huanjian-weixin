<template>
	<view class="content">
		<view class="title">
			充值
		</view>
		<view class="mySurplus">
			<view class="mySurplus_sub" :class="type==1?'mySurplus_active':''" data-type="1" data-price="10" @tap="clickCharge">10元</view>
		</view>
		<view class="mySurplus2">
			<view class="mySurplus_sub" :class="type==2?'mySurplus_active':''" data-type="2" data-price="50" @tap="clickCharge">50元</view>
		</view>
		<view class="mySurplus3">
			<view class="mySurplus_sub" :class="type==3?'mySurplus_active':''" data-type="3" data-price="100" @tap="clickCharge">100元</view>
		</view>
		<view class="mySurplus4">
			<view v-if="type!=4" class="mySurplus_sub" :class="type==4?'mySurplus_active':''" data-type="4" @tap="clickCharge">其他金额</view>
			<input type="digit" v-if="type==4" @input="onKeyInput" class="mySurplus_sub" :class="type==4?'mySurplus_active':''"
			 data-type="4" focus="true" value=""></input>
		</view>
		<view class="charge_button">
			<view class="charge_button_left"><span style="font-size: 40rpx;">{{price}}</span>元</view>
			<view class="charge_button_right" @tap="chargeOver">充值</view>
		</view>
	</view>
</template>

<script>
	import utlis from '../../static/js/utlis.js'
	export default {
		data() {
			return {
				type: 1,
				price: 10
			}
		},
		methods: {
			clickCharge(e) {
				this.type = e.target.dataset.type;
				this.price = e.target.dataset.price;
				if (e.target.dataset.type == 4) {
					this.price = 0
				}
			},
			onKeyInput: function(event) {
				this.price = event.target.value
			},
			chargeOver() {
				let self = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						console.log(res);
						let data = {
							chargeAmt: self.price, //0.01
							chargeType: 10,
							custName: uni.getStorageSync('custName'),
							payType: 4000,
							wxCode: res.code,
							userSource: 1
						}
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						utlis.http("POST", 'topupWallet', data, function(res) {
							if (res.status == "success") {
								console.log(res)
								uni.hideLoading()
								// 仅作为示例，非真实参数信息。
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.wx2Json.timestamp,
									nonceStr: res.wx2Json.noncestr,
									package: res.wx2Json.package,
									signType: 'MD5',
									paySign: res.wx2Json.sign,
									success: function(res) {
										uni.showToast({
											title: '支付成功！',
											duration: 2000,
											mask: true,
											icon: 'success'
										})
										console.log('success:' + JSON.stringify(res));
									},
									fail: function(err) {
										uni.showToast({
											title: '支付失败！',
											duration: 2000,
											mask: true,
											icon: 'none'
										})
										console.log('fail:' + JSON.stringify(err));
									}
								})
							} else {
								uni.hideLoading()
								uni.showToast({
									title: res.msg,
									duration: 2000,
									mask: true,
									icon: 'none'
								})
							}
						})
					}
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(243, 243, 243, 1);
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.title {
		position: absolute;
		top: 48rpx;
		left: 30rpx;
		width: 200rpx;
		height: 66rpx;
		color: rgba(0, 0, 0, 1);
		font-size: 48rpx;
		font-weight: 550;
		letter-spacing: 3rpx;
	}

	.mySurplus_active {
		width: 306rpx;
		height: 120rpx;
		background: #4FB874;
		color: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 10rpx 0 rgba(79, 184, 116, 0.5);
	}

	.mySurplus {
		position: absolute;
		top: 144rpx;
		left: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus2 {
		position: absolute;
		top: 144rpx;
		right: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus3 {
		position: absolute;
		top: 304rpx;
		left: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus4 {
		position: absolute;
		top: 304rpx;
		right: 44rpx;
		width: 306rpx;
		height: 120rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		font-size: 34rpx;
		color: #333333;
		box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, 0.2);
	}

	.mySurplus_sub {
		text-align: center;
		line-height: 120rpx;
	}

	.charge_button {
		width: 100%;
		height: 100rpx;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.charge_button_left {
		width: 490rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 30rpx;
		background: #FFFFFF;
	}

	.charge_button_right {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 260rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 30rpx;
		background: #333333;
		color: #4FB874;
	}
</style>
