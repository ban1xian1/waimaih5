<template>
	<view>
		<hx-navbar left-text="Ajustes" backTabbarUrl="/pages/user/center/center"></hx-navbar>
		
		<view class="cu-list menu sm-border margin-top">
			
			<navigator class="cu-item arrow " url="../account_security/security" open-type="navigate">
				<view class="content">
					<text class="text-black">Ajustes de seguridad</text>
<!--          安全设置-->
				</view>
				<view class="action">
					<text class="text-grey text-sm"></text>
				</view>
			</navigator>
			<view class="cu-item arrow" @click="banklist">
<!--        银行卡管理-->
				<view class="content">
					<text class="text-black">Cuenta bancaria</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm"></text>
				</view>
			</view>
<!--			<view class="cu-item arrow">-->
<!--				<view class="content">-->
<!--					<text class="text-black">隐私</text>-->
<!--				</view>-->
<!--				<view class="action">-->
<!--					<text class="text-grey text-sm"></text>-->
<!--				</view>-->
<!--			</view>-->
			
			<navigator class="cu-item arrow margin-top" url="../../base/about" open-type="navigate">
				<view class="content">
					<text class="text-black">Acerca de nosotros</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">版本号 {{version}}</text>
				</view>
			</navigator>
<!--			<navigator class="cu-item arrow" url="../../base/help_feedback" open-type="navigate">-->
<!--				<view class="content">-->
<!--					<text class="text-black">帮助与反馈</text>-->
<!--				</view>-->
<!--				<view class="action">-->
<!--					<text class="text-grey text-sm"></text>-->
<!--				</view>-->
<!--			</navigator>-->
			
			<!-- <view class="cu-item margin-top">
				<view class="content" style="text-align: center;">
					<text class="text-black">切换账号</text>
				</view>
			</view> -->
			<view class="cu-item margin-top" @click="logOut">
				<view class="content" style="text-align: center;">
					<text class="text-grey" style="color: #ffc107">Cerrar sesión</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var that;
  import {
    mapState
  } from 'vuex';
	export default {
		data() {
			return {
				version: this.$conf.version
			}
		},
		onLoad(){
			var that = this;
		},
    onShow(){
      if(!this.hasLogin){
        uni.reLaunch({
          url: '/pages/user/login/login'
        });
        return;
      }
    },
		mounted() {
			that= this;
		},
    computed: {
      ...mapState(['hasLogin','userData'])
    },
		methods: {
			logOut(){
				that.$store.dispatch("logout");
				//that.$api.user.logout();
				
				that.back();
			},
			back(){
				uni.redirectTo({
				    url: '/pages/user/login/login'
				});
			},
      banklist(){
        uni.reLaunch({
          url: '/pages/user/bank/index'
        });
      }
		}
	}
</script>

<style scoped>
.action{
  display: none;
}

</style>
