<template>
	<view class="content" v-if="isShow">
		<hx-navbar title="Dirección de entrega" backTabbarUrl="/pages/user/center/center" :backgroundColor="[241,241,241]"></hx-navbar>
		<view class="bb15">
			
		</view>
		<view class="list-box">
			<view class="row b-b">
				<text class="tit">Receiver</text>
				<input class="input" type="text" v-model="addressData.name" placeholder="Real name" placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">Phone number</text>
				<input class="input"  v-model="addressData.mobile" placeholder="Phone number" placeholder-class="placeholder" />
			</view>
			<view class="row b-b" v-if="1==2">
				<text class="tit">地址</text>
				<text @click="chooseLocation" class="input">
					{{addressData.addressName}}
				</text>
				<text class="hxicon-locationfill"></text>
			</view>
			<view class="row b-b"> 
				<text class="tit">Detailed address</text>
				<input class="input" type="text" v-model="addressData.address" placeholder="Detailed address" placeholder-class="placeholder" />
			</view>
			
			<view class="row default-row">
				<text class="tit">Set as default</text>
				<switch :checked="addressData.default" color="#ffc107" @change="switchChange" />
			</view>
			</view>
		<view class="add-btn" @click="confirm">
			<text>Save</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressData: {
          id:0,
					name: '',
					mobile: '',
					addressName: '在地图选择',
					address: '',
					area: '',
					default: false
				},
        isShow:false,
			}
		},
		onLoad(option){
			let title = 'Agregar dirección de envío';
			if(option.type==='edit'){
				title = 'Editar dirección de envío'
        let data=JSON.parse(option.data);
        console.log(data);
        this.addressData.name=data.name
        this.addressData.mobile=data.mobile
        this.addressData.address=data.addressName
        this.addressData.default=data.default
        this.addressData.id=data.address_id
			}
      this.isShow=true;
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e){
				this.addressData.default = e.detail.value;
			},
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						this.addressData.addressName = data.name;
						this.addressData.address = data.name;
					}
				})
			},
      //提交
      confirm: function () {
        let that = this;
        let data = {};
        data.name = this.addressData.name.trim();
        data.mobile = this.addressData.mobile.trim();
        data.address = this.addressData.address.trim();
        data.default = this.addressData.default;
        if (data.name == '') {
          this.$msg('Por favor, ingrese el nombre del destinatario');
          return;
        }
        if (data.mobile == '') {
          this.$msg('Número de teléfono requerido（');
          return;
        }
        if (!data.address) {
          this.$msg('La dirección no puede estar vacía');
          return;
        }
        if (this.manageType == 'add') {
          this.$api.user.userAddressAdd(data).then(function (e) {
            that.$msg('success');
            setTimeout(function () {
              uni.reLaunch({
                url: '/pages/user/address/address',
              });
            }, 2000);
          }).catch(function (error) {
            console.log(error);
          });
          return;
        }
        data.id= this.addressData.id;
        this.$api.user.userAddressChange(data).then(function (e) {
          that.$msg('success');
          setTimeout(function () {
            uni.reLaunch({
              url: '/pages/user/address/address',
            });
          }, 2000);
        }).catch(function (error) {
          console.log(error);
        });
      },
		}
	}
</script>

<style lang="scss">
	.bb15{
		background: #f1f1f1;
		padding-top: 40upx;
	}
	.list-box{
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 15px;
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-locationfill{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		position: fixed;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		overflow: hidden;
		bottom: 15px;
		left: 15px;
		right: 15px;
		height: 45px;
		font-size: 16px;
		font-weight: bold;
		color: #333;
		background: linear-gradient(45deg, #ffd900, #ffc107);		
	}
</style>
