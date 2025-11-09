<template>
	<view class="content b-t">
		<hx-navbar left-text="Dirección de entrega" backTabbarUrl="/pages/user/center/center" :backgroundColor="[241,241,241]"></hx-navbar>
		<view class="bb15">
			
		</view>
		<view class="list-box">
			<view class="list b-b" v-for="(item, index) in addressList" :key="index" >
				<view class="wrapper">
					<view class="address-box">
						<text v-if="item.default" class="tag">default</text>
						<text class="address">{{item.addressName}} </text>
					</view>
					<view class="u-box">
						<text class="name">{{item.name}}</text>
						<text class="mobile">{{item.mobile}}</text>
					</view>
				</view>
				<text class="hxicon-edit" @click.stop="addAddress('edit', item)"></text>
			</view>
		</view>
		
		<view class="add-btn" @click="addAddress('add')">
			<text>Agregar nueva dirección</text>
		</view>
	</view>
</template>

<script>
import {
  mapState
} from 'vuex';
import {userAddressLists} from "../../../common/vmeitime-http/user";
	export default {
		data() {
			return {
				source: 0,
				addressList: [
				]
			}
		},
    onShow: function () {
      uni.showLoading({
        title: 'Cargando...'
      });
      if (!this.hasLogin) {
        uni.reLaunch({
          url: '/pages/user/login/login'
        });
        return;
      }
      let that = this;
      //获取会员详细信息
      that.addressList = [];
      this.$api.user.userAddressLists().then(function (e) {
        let info = e.data.data;
        if (info.length > 0) {
          for (var i = 0; i < info.length; i++) {
            let v = {}
            v.name = info[i]['user_tname'];
            v.mobile = info[i]['user_phone'];
            v.addressName = info[i]['address_text'];
            v.address_id = info[i]['address_id'];
            v.default = info[i]['address_default'] == 1 ? true : false;
            that.addressList.push(v);

          }
        }
        uni.hideLoading();
      }).catch(function (err) {
        console.log(err);
      });
    },
		onLoad(option){
			this.source = option.source;
		},
    computed: {
      ...mapState(['hasLogin','userData'])
    },
		methods: {
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/user/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
				console.log(data, type);
			}
		}
	}
</script>

<style lang='scss'>
	.bb15{
		padding-bottom: 30upx;
	}
	.content{
		position: relative;
	}
	.list-box{
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 15px;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 14px 15px;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffc107;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-edit{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
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
