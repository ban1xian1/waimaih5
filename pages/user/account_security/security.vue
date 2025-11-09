<template>
	<view>
		<hx-navbar left-text="Ajustes de seguridad" defaultBackUrl="/pages/user/setting/setting"></hx-navbar>
	
		<view class="cu-list menu sm-border margin-top">
			

			<navigator class="cu-item arrow " url="update_password" open-type="navigate">
				<view class="content">
					<text class="text-black">Configuración de contraseña</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm"></text>
				</view>
			</navigator>
      <navigator class="cu-item arrow " url="update_pay_password" open-type="navigate">
        <view class="content">
          <text class="text-black">Establecer contraseña de pago</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm"></text>
        </view>
      </navigator>
		</view>
	</view>
	
</template>

<script>
	import {
	    mapState 
	} from 'vuex';
	export default {
		data() {
			return {
				mobile: '',
			}
		},
		onReady() {
			
		},
    computed: {
      ...mapState(['hasLogin','userData'])
    },
		mounted() {
			// if(Object.keys(this.userData).length != 0){
			// 	let str =this.userData.member.mobile;
			// 	this.mobile = str.replace(/(\d{3})(\d{6})(\d{2})/g,'$1******$3');
			// }
		},
    onShow(){
      if(!this.hasLogin){
        uni.reLaunch({
          url: '/pages/user/login/login'
        });
        return;
      }
    },
		methods: {
			
		}
	}
</script>

<style>

</style>
