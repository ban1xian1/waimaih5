<template>
	<view>
		<view class="head" v-if="1==2">
			<view class="status"></view>
			<view class="search" @click="goSearch">
				<i class="hxicon-search"></i>
				<text class="tit">搜索我的订单</text>
			</view>
		</view>
		<view class="tabs-box">
			<view class="hx-tabs">
				<view class="hx-tabs-item" v-for="(item,i) in tabs" :key="i" :class="{'hx-tabs-active': swiperCurrent == i}" @click="swiperChange(i)" :style="{transition: transtionTime + 'ms'}">
					<text>{{item.name}}</text>
				</view>
				<view class="hx-tabs-slider-box" :style="{width: (100/tabs.length) + '%',transition: transtionTime + 'ms',left:swiperCurrentSliderLeft + '%'}">
					<view class="hx-tabs-slider"></view>
				</view>
			</view>
		</view>
		<view class="main" :style="{height: mainHeight}" >
			<swiper
			id="mainSwiper"
			style="height: 100%;"
			:current="swiperCurrent"
			:duration="transtionTime"
			>
				<swiper-item class="swiper-item" >
					<view class="scroll-items">
							<scroll-view
							style="height: 100%;width: 100%;"
							scroll-with-animation
							:scroll-y="true"
							refresher-background="#eee"
							:refresher-enabled="reloadDown"
							:refresher-triggered="triggered"
							:refresher-threshold="100"
							@refresherrefresh="onRefresh"
              @scroll="onScroll"
							@refresherrestore="onRestore" >
								<view class="nullOrder" v-if="list&& list.length === 0">
									<image src="../../static/img/order_icon.png" mode=""></image>
									<text class="tit">No hay pedidos</text>
<!--                  暂无订单-->
								</view>
								<block v-for="(order,j) in list" :key="j" v-else>
								<view class="order-item" v-if="order">
									<view class="item-top" @click="goshop(order)">
										<image :src="order.shop_info.image" mode=""></image>
										<view class="tit">
											<text>{{order.shop_info.name}}</text>
											<text v-if="order.community">({{order.community}})</text>
											<i class="hxicon-right"></i>
										</view>
										<view class="right" v-if="order.order_status == 1"><text>Esperar a pagar</text></view>
										<view class="right" v-else-if="order.order_status == 2"><text>Pendiente de aceptación</text></view>
										<view class="right" v-else-if="order.order_status == 3"><text>Pedido aceptado</text></view>
										<view class="right" v-else-if="order.order_status == 4"><text>En reparto</text></view>
										<view class="right" v-else-if="order.order_status == 5"><text>Entregado</text></view>
										<view class="right" v-else-if="order.order_status == 6"><text>Completado</text></view>
										<view class="right" v-else-if="order.order_status == 7"><text>Cancelado</text></view>
									</view>
									<view class="item-center" @click="goDetaller(order)">
										<image :src="order.item[0].image" mode=""></image>
										<view class="right">
											<view class="row" v-if="order.item[0].product_name">
												<text>{{order.item[0].product_name}}</text>
											</view>
											<view class="row">
												<text>Hora de pedido：{{order.create_time}}</text>
											</view>
											<view class="row">
												<text>Total：{{order.pay_amount}}</text>
											</view>
										</view>
									</view>
									<view class="item-bottom">
										<view class="left"></view>
<!--                    取消订单-->
                    <view class="btn" v-if="order.pay_status === 1 && order.order_status!=7" @click="cancel(order)">Cancelar orden</view>
<!--                    支付订单-->
                    <view class="btn bg-yellow" v-if="order.pay_status === 1 && order.order_status!=7" @click="goPay(order.order_no)">Pago de inmediato</view>
                    <view class="btn" v-if="order.pay_status === 1 && order.order_status==7" >{{getOrderStatus(order.order_status)}}</view>
<!--申请退款-->
                    <view class="btn" v-if="order.pay_status === 2 &&  order.refund_status ===0 " @click="refund(order)">Solicitar reembolso</view>
                    <view class="btn" v-if="order.pay_status === 2 &&  order.refund_status ===0 && order.order_status==5" @click="goStore(order.id)">点收货</view>
                    <view class="btn" v-if="order.pay_status === 2 &&  order.refund_status ===0 && order.order_status!=5">{{getOrderStatus(order.order_status)}}</view>
                    <view class="btn" v-if="order.pay_status === 2 &&  order.refund_status ===1" >{{getRefundStatus(order.refund_status)}}</view>
                    <view class="btn" v-if="order.pay_status === 3 " >{{getRefundStatus(order.refund_status)}}</view>
                    <view class="btn" v-if="order.pay_status === 4 " >{{getRefundStatus(order.refund_status)}}</view>
									</view>
								</view>
								</block>
							</scroll-view>
					</view>
				</swiper-item>
			</swiper>
		</view>
    <uni-popup ref="popup" type="center">
      <view class="popup-box">
        <text class="popup-title">Por favor, introduzca el motivo del reembolso</text>
        <input class="popup-input" v-model="inputValue"   placeholder="" />

        <view class="popup-btns">
          <button @click="closePopup">Cancelar</button>
          <button @click="confirmInput"> Confirmar </button>
        </view>
      </view>
    </uni-popup>

	</view>
</template>

<script>
	import UniPopup from "../../components/uni-popup/uni-popup.vue";

  var sysInfo = uni.getSystemInfoSync();
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
	//引入测试数据
	import testData from "@/common/testdata.js";
  import {
    mapState
  } from 'vuex';
	export default {
    components: {UniPopup},
		data() {
			return {
        inputValue:'',
				mainHeight: 0,
				statusBarHeight,
				tabs: [
					{name:'Todos', data:[], api:'',load: false},
					{name:'Esperar a pagar', data:[], api:'', load: false},
          //   待付款
					{name:'Esperando recibir', data:[], api:'', load: false},
          //   待收货
					{name:'Esperando comentarios', data:[], api:'', load: false},
					{name:'Readquirir', data:[], api:'', load: false}, //退款
				],
        scrollViewHeight:0, //页面高度

				swiperCurrent: 0,
				transtionTime:100,
				swiperCurrentSliderLeft: 0,
				orderData: [
					//1,2,3,4,5,6,7,8,9,10
				],
				triggered: true,
				//下拉刷新
				reloadDown: false,

        type:0,
        list:[],
        refundOrder:[],
        //滚动加载设定
        apigoing:false,
        page:1,
        page_num:10,
        timer:'',

			}
		},
    computed: {
      ...mapState(['hasLogin','userData'])
    },
		onLoad(option) {
      let that=this;
      if(!this.hasLogin){
        uni.reLaunch({
          url: '/pages/user/login/login'
        });
        return;
      }
			this.mainHeight = sysInfo.screenHeight - statusBarHeight - 50 - 60 - 50 + 'px';
			this._freshing = false;

		},
    onShow(){
      uni.showLoading();
      const state = uni.getStorageSync('orderState');
      uni.removeStorageSync('orderState');
      if(state!==undefined || typeof state !='undefined' ){
        this.type=state;
      }
      this.page=1;
      this.list=[];
      this.apigoing=false;
      this.swiperChange(this.type)

    },
		mounted() {
      this.getScrollViewHeight();
		},
		methods: {
      getScrollViewHeight() {
        const query = uni.createSelectorQuery().in(this);
        query.select('#mainSwiper').boundingClientRect((rect) => {
          this.scrollViewHeight = rect.height;
        }).exec();
      },
      onScroll(e){
        let scrollTop, scrollHeight, clientHeight;

        if (process.env.UNI_PLATFORM === 'h5') {
          scrollTop = e.target.scrollTop;
          scrollHeight = e.target.scrollHeight;
          clientHeight = this.scrollViewHeight;
        } else {
          scrollTop = e.detail.scrollTop;
          scrollHeight = e.detail.scrollHeight;
          clientHeight = e.detail.clientHeight;
        }
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
        if (distanceToBottom < 300 && this.apigoing===false) {
          clearTimeout(this.timer)
          let  that=this;
          this.timer = setTimeout(() => {
            that.page=that.page+1;
            that.getdata();
          }, 400) // 400ms 延迟
        }
      },
      getRefundStatus(type){
        if(type==1){
          return 'Reembolso en trámite';
        }
        if(type==2){
          return 'Reembolsado';
        }
        if(type==3){
          return 'Reembolso denegado';
        }
        if(type==4){
          return 'Cancelar reembolso';
        }
      },
      getOrderStatus(type){
        if(type==1){
          return '未支付';
        }
        if(type==2){
          return 'Pendiente de aceptación';
        }
        if(type==3){
          return 'Pedido aceptado';
        }
        if(type==4){
          return 'En reparto';
        }
        if(type==5){
          return 'Entregado';
        }
        if(type==6){
          return 'Completado';
        }
        if(type==7){
          return 'Cancelado';
        }
      },
      getdata(type){
        let that=this;
        if(this.apigoing){
          console.log('going');
          return;
        }
        this.apigoing=true;
        this.$api.user.orderLists({page:this.page,page_num:this.page_num,type:this.type}).then(function (e){
          uni.hideLoading();
          if(e.data.code!=1){
            uni.showToast({
              icon: 'none',
              position: 'bottom',
              title: e.data.msg||'error'
            });
            return;
          }
          if(e.data.data.list.length==0){
            return;
          }
          for (let i=0;i<e.data.data.list.length;i++){
            that.list.push(e.data.data.list[i]);
          }
          that.apigoing=false;
        }).catch(function (e){
          console.log(e);
        })
      },
			swiperChange(index) {
				this.swiperCurrentSliderLeft= (100/this.tabs.length) * index;
        uni.showLoading();
        this.page=1;
        this.type= index;
        this.list=[];
        this.apigoing=false;
        this.getdata();
			},
			// 下拉刷新
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
				}, 1500)
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
				console.log("重置刷新");
			},
      cancel(itme){
        let that=this;
        uni.showModal({
        	title: '',
        	content: '¿Desea cancelar el pedido?',
        	confirmText: "Confirmar",
          cancelText:'Cancelar',
        	confirmColor: '#3CC51F',
        	success: function (msg) {
        		if (msg.confirm) {
              that.$api.user.orderCancel({id:itme.id,order_no:itme.order_no}).then(function (e){
                if(e.data.code!=1){
                  uni.showToast({
                    icon: 'none',
                    position: 'bottom',
                    title: e.data.msg||'error'
                  });
                  return;
                }
                that.swiperChange(that.type)
              }).catch(function (e){
                console.log(e);
              })
        			return true;
        		} else if (msg.cancel) {
        		}
        	}
        });
      },
			//去支付
			goPay(orderId){
				uni.navigateTo({
				    url: '/pages/order/pay?order=' + orderId
				});
			},
			//去门店
      goshop(item){
				uni.navigateTo({
				    url: '/pages/store/index?sid=' + item.shop_id
				});
			},
      goDetaller(item){
        uni.navigateTo({
          url: '/pages/order/detalles?order_no=' + item.order_no
        });
        console.log(item.id);
      },
      refund(order){
        this.refundOrder=order;
        this.inputValue='';
        this.$refs.popup.open()
      },
			//去订单详情
			goOrderInfo(orderId){
				uni.redirectTo({
				    url: '/pages/map/location?id=' + orderId
				});
			},
      submiRefund(){
        let that=this;
        this.$api.user.orderRefund({id:that.refundOrder.id,order_no:that.refundOrder.order_no,refund_reason:that.inputValue}).then(function (e){
          if(e.data.code!=1){
            uni.showToast({
              icon: 'none',
              position: 'bottom',
              title: e.data.msg||'error'
            });
            return;
          }
          that.swiperChange(that.type)

        }).catch(function (e){
          console.log(e);
        })
      },
      closePopup() {
        this.$refs.popup.close()
      },
      confirmInput() {
        this.inputValue;
        if(this.inputValue.trim()==''){
          return;
        }
        this.closePopup()
        this.submiRefund();
      },
			//搜索
			goSearch(){
				uni.navigateTo({
					url: '/pages/search/search?type=order'
				})
			}
		}
	}
</script>

<style lang="scss">
.head{

	background: linear-gradient(100deg, #FFEB3B, #FFC107);
	padding-bottom: 10px;
	padding-top: 10px;
	.status{
		height: var(--status-bar-height);
	}
	.search{
		height: 40px;
		background-color: #fff;
		border-radius: 10px;
		margin: 0 15px;
		display: flex;
		align-items: center;
		padding: 0 15px;
		font-size: 14px;
		color: #888;
		i{
			font-weight: bold;
			font-size: 16px;
		}
		.tit{
			margin-left: 6px;
		}
	}
}
.tabs-box{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	position: sticky;
	//top: calc(44px + var(--status-bar-height));
	z-index: 10;
	background-color: white;
	height: 50px;
	padding-bottom: 10px;

	.hx-tabs{
		position: relative;
		display: flex;
		height:100%;
		width: 100%;
		justify-content: space-evenly;
		&-item{
			display: flex;
			flex: 1;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 70px;
			color:#666666;
			text{
				font-size: 16px;
			}

		}
		&-active{
			color:#333333;
			font-weight: bold;
		}
		&-slider-box{
			position: absolute;
			display: flex;
			justify-content: center;
			bottom: 0;
			width: 20%;
		}
		&-slider{
			display: flex;
			background: #f6d200;
			width: 30px;
			height: 3px;
		}
	}
}
.main{
	position: relative;
	background-color: #ffffff;
	#mainSwiper{
		background-color: #eeeeee;
		height: 100%;
		width: 100%;
		.bannerimg-box{
			border-bottom-left-radius:10upx;
			border-bottom-right-radius:10upx;
			padding: 15px 24rpx 7px;
			swiper{
				height: 233rpx;
				width: 699rpx;
			}
			.swiper-item {

				display: flex;
				justify-content: center;
				align-content: center;
				overflow: hidden;

				width: 100%;
				height: 100%;
				image {
					border-radius: 8px;
					width: 100%;
				}
			}
		}
		.nullOrder{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 40px auto;
			image{
				width: 283px;
				height: 200px;
			}
			.tit{
				display: flex;
				flex-direction: column;
				font-size: 16px;
				font-weight: bold;
				color: #555;
				margin-top: 6px;

			}
		}
		.scroll-items{
			height: 100%;
			.order-item{
				display: flex;
				flex-direction: column;
				background-color: #fff;
				margin: 8px 15px;
				border-radius: 10px;
				padding: 0 15px;
				.item-top{
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 12px 0;
					border-bottom: 1px solid #f5f5f5;
					image{
						border-radius: 50%;
						width: 24px;
						height: 24px;
					}
					.tit{
						flex: 1;
						margin-left: 6px;
						font-size: 16px;
						font-weight: bold;
						color: #333;
						padding-right: 40px;
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						flex-direction: row;

					}
					.right{
						font-size: 14px;
						color: #666;
					}
				}
				.item-center{
					display: flex;
					flex-direction: row;
					margin-top: 12px;
					color: #666;
					font-size: 14px;
					image{
						border-radius: 6px;
						height: 60px;
						width: 60px;
					}
					.right{
						flex: 1;
						margin-left: 10px;
					}
				}
				.item-bottom{
					display: flex;
					flex-direction: row;
					margin-top: 12px;
					margin-bottom: 15px;
					.left{
						flex: 1;
					}
					.btn{
						padding: 7px 14px;
						border: 1px solid #cdcdcd;
						font-size: 14px;
						color: #555;
						border-radius: 10px;
						transition: all 0.2s;
						background: #fff;
					}
					.btn:active{
						color: #888;
						background: #f1f1f1;
					}
					.bg-yellow{
						background: linear-gradient(100deg, #FFEB3B, #FFC107);
						border-color: #ffe635;
						font-weight: bold;
					}
					.bg-yellow:active{
						background: linear-gradient(100deg, #e8d536, #dda809);
					}
				}
			}
		}
		// position: sticky;
		//top: calc(50px + 44px + var(--status-bar-height));

	}


}
.popup-box {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  width:600rpx;
}
.popup-title {
  font-size: 32rpx;
  margin-bottom: 20rpx;
}
.popup-input {
  border: 1px solid #ccc;
  padding: 16rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  height: 80rpx;
}
.popup-btns {
  display: flex;
  justify-content: space-between;
}
</style>
