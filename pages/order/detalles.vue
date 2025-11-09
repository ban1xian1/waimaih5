<template>
  <view v-if="is_show">
    <hx-navbar
        :border="false"
        :centerSlidiSwitch="true"
        :rightSlidiSwitch="false"
        :fixed="true"
        :backgroundColor="[255,193,7]"
        :pageScroll.sync="scrollData">
      <view style="text-align: center;width: 100%;">
        <text>Detalles del pedido</text>
      </view>
      <view slot="centerAfter" style="text-align: center;width: 100%;">
        <text>Detalles del pedido </text>
      </view>
    </hx-navbar>
    <view class="head tab-right-active">
      <view class="tab-box" v-if="tabIndex>0">
        <view class="item left" :class="{'active':tabIndex == 1}"  @click="tabIndex = 1">
          <view class="tit-box">
            <text>Entrega</text>
          </view>
        </view>

      </view>
      <view class="container head-bottom" :class="{'selectOne': tabIndex == 1,'selectTow':tabIndex == 2}">
        <view class="tab" v-if="tabIndex == 2">
        </view>
        <view class="tab" v-else>
          <view class="t-top">
            <view class="t-top-box" style="display: flex;justify-content: space-between;" >

              <block>
                <view style="width: 90%">
                  <view style="display: flex;justify-content: space-between;">
                    <text>Receptor：{{order.receiver_name}}</text>
                    <text>{{maskString(order.receiver_phone)}}</text>
                  </view>
                  <view>Dirección de entrega：{{order.receiver_address}}</view>
                </view>
              </block>
            </view>
          </view>
          <view class="t-bb"></view>

        </view>
      </view>
    </view>
    <view class="b-r m-t container p12">
      <view class="store">
        <view class="name ">
          <text>{{order.shop.name}}</text>

        </view>
        <view class="p-bb b-b"></view>
        <view class="goods-box" >
          <block v-for="(goods,i) in order.order_item" :key="i" v-if="order.order_item">
            <view class="goods-item" >
              <view class="left">
                <image :src="goods.image" mode="aspectFit"></image>
              </view>
              <view class="right">
                <view class="row1">
                  <view class="tit">
                    <text>{{goods.product_name}}</text>
                  </view>
                  <view class="price">
                    <text class="fh"></text><text>{{goods.price}}</text>
                  </view>
                </view>
                <view class="row3">
                  <text>x{{goods.num}}</text>
                  <text style="margin-left: 50px;" v-if="parseFloat(goods.packing_fee)>0">Costo de embalaje del producto:{{goods.packing_fee}}</text>
                </view>
              </view>
            </view>
          </block>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong">
          <view class="right">
            <text>Tarifa de envío</text>
          </view>
          <view class="left">
            <text class="fh"></text><text>{{order.packing_fee}}</text>
          </view>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong">
          <view class="right">
            <text>Costo de entrega</text>
            <!--            配送费用-->
          </view>
          <view class="left">
            <text class="fh"></text><text>{{order.delivery_fee}}</text>
          </view>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong">
          <view class="right">
            <text>Precio total</text>
            <!--            配送费用-->
          </view>
          <view class="left">
            <text class="fh"></text><text>{{order.pay_amount}}</text>
          </view>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong">
          <view class="right">
            <text>Comentario</text>
            <!--            配送费用-->
          </view>
          <view class="left">
            <text class="fh"></text><text>{{order.remark}}</text>
          </view>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong">
          <view class="right">
            <text>Hora de creación</text>
            <!--            配送费用-->
          </view>
          <view class="left">
            <text class="fh"></text><text>{{order.create_time_date}}</text>
          </view>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong" >
          <view class="right" >
            <text style="color: #888">Métodos de pago：</text>
          </view>
          <view class="left">
            <text class="fh" style="color: #888"></text>
            <text style="color: #888">Balance </text>
          </view>
        </view>
      </view>
    </view>
    <view class="body-end"></view>

  </view>
</template>

<script>
import {
  mapState
} from 'vuex';
import {orderDetails, shopCartDetalles, userAddressLists} from "../../common/vmeitime-http/user";
import UniPopup from "../../components/uni-popup/uni-popup.vue";
export default {
  components: {UniPopup},
  data() {
    return {
      scrollData: {},
      //门店信息
      storeData:{},
      //购物车
      shoppCart:[],
      //头部选项卡 参数为 0不显示选项卡,1,2
      tabIndex:1,
      //收获地址
      addressData: [],
      //手机隐私
      ysStatus: true,
      //结算价
      totalPrice: 0,
      //已优惠价
      totalYhPrice: 0,
      //商品数量
      totalNumber: 0,
      remark: "",
      shop_id:0,
      inputValue: '',
      is_show:false,
      order_no:0,
      order:{},
    }
  },
  computed: {
    ...mapState(['hasLogin','userData'])
  },
  onShow(){
    this.address_show=this.address_show=false
    let that = this
    //读取会员最新地址
    uni.showLoading({
      title: 'Cargando…',  // 文字内容
      mask: true           // 是否显示透明遮罩，防止触摸穿透
    })
    that.$api.user.orderDetails({order_no:this.order_no}).then(function (e){
      that.order=e.data.data;
      that.is_show=true;
      uni.hideLoading();
    }).catch(function (e){

    })

  },
  onLoad(option){
    if(!this.hasLogin){
      uni.reLaunch({
        url: '/pages/user/login/login'
      });
      return;
    }
    this.order_no=option.order_no
  },
  onPageScroll(e){
    this.scrollData = e;
  },
  methods: {
    selectItem(index){
      this.addressData=this.addressDataAll[index];
      this.changeAddressShow=false;

    },
    privacyStatusChange(e){
      this.ysStatus = e.target.value
    },
    changeNota(){
      this.$refs.popup.open()
    },
    closePopup() {
      this.$refs.popup.close()
    },
    confirmInput() {
      this.remark=this.inputValue;
      this.closePopup()
    },
    maskString(str, frontLen = 3, endLen = 3) {
      if (!str) return '';
      const len = str.length;
      if (len <= frontLen + endLen) return str;

      const mask = '*'.repeat(len - frontLen - endLen);
      return str.slice(0, frontLen) + mask + str.slice(len - endLen);
    },
    //提交订单
    submit(){
      let that = this
      //向后台发送 data 进行真实合计，生成订单，并返回订单信息
      //模拟请求数据
      uni.showLoading({
        title: 'Generación de pedidos mediante reglas....'
      });
      //获取带店铺id 和地址id
      let shop_id=this.storeData.id;
      let address_id=this.addressData.address_id;
      let remark=this.remark;
      this.$api.user.orderAdd({shop_id:shop_id,address_id:address_id,remark:remark}).then(function (e){
        if(e.data.code!=1){
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: e.data.msg||'error'
          });
          return;
        }
        uni.showLoading({
          title: 'Redirigiendo al pago....'
        });
        setTimeout(()=>{
          uni.hideLoading()
          uni.redirectTo({
            url: '/pages/order/pay?order=' + e.data.data.order_no
          });
        },1000)

      }).catch(function (e){
        console.log(e);
      })


      //假设返回了订单信息，跳转至支付页面

    }
  }
}
</script>

<style lang="scss">

.b-r{
  border-radius: 6px;
}
.m-t{
  margin-top: 6px;
}

.p-bb{
  margin: 16px 0;
  height: 1px;
  //background:  #E4E7ED;
}
.flex-rl{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.container{
  margin-left: 12px;
  margin-right: 12px;
  background-color: #ffffff;
}
.p12{
  padding: 12px;
}
.head{
  background: linear-gradient(to bottom, #ffc107, #f1f1f1);

  padding-top: 20px;

  .tab-box{
    position: relative;
    height: 40px;
    margin: 0 12px;
    .item{
      position: absolute;
      top: 0;
      bottom: 0;
      height: 40px;
      text-align: center;
      font-size: 14px;

      width: 50%;
      .tit-box{
        position: relative;
        height: 36px;
        line-height: 36px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        background-color: rgba(#ffffff, .6);
        width: 100%;
      }
    }
    .item:first-child{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-end;
      left: 0;
    }
    .item:last-child{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      right: 0;
    }
    .active{
      height: 40px;
      width: 51%;
      font-weight: bold;
      .tit-box{
        height: 40px;
        line-height: 40px;
        background-color:rgba(#ffffff, 1);
      }

    }
    .left .tit-box{
      margin-left: 12px;
      margin-right: -12px;
      padding-right: 12px;
    }
    .right .tit-box{
      margin-right: 12px;
      margin-left: -12px;
      padding-left: 12px;
    }
    .left.active .tit-box{
      margin: 0;
    }
    .right.active .tit-box{
      margin: 0;
    }
    .left.active .tit-box:after{
      content: '';
      position: absolute;
      right: -12px;
      bottom: 0;
      border-top: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 36px solid #ffffff;
    }
    .right.active .tit-box:after{
      content: '';
      position: absolute;
      left: -12px;
      bottom: 0;
      border-top: 12px solid transparent;
      border-left: 12px solid transparent;
      border-bottom: 36px solid #ffffff;
    }
  }
  .head-bottom{
    overflow: hidden;
    background: #ffffff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    .tab{

      .t-top{

        &-box{
          margin: 0;
          padding: 12px;
          .txt1{
            font-size: 18px;
            color: #888;
          }
          .icon1{
            margin-left: 8px;
            color: #bbb;
          }
        }
        &-box:active{
          background-color: #f5f5f5;
        }
      }
      .t-bb{
        margin: 0 12px;
        height: 0.5px;
        background-color:  #E4E7ED;
      }
      .t-bottom{
        padding: 12px;
        .row1{
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          //padding: 12px 0 0;
          .left{
            font-size: 14px;
            font-weight: bold;
          }
          .right{
            font-size: 14px;
            color: #ff9800;
            i{
              margin-left: 8px;
              color: #bbb;
            }
          }
        }
        .row2{
          margin-top: 6px;
          font-size: 12px;
          color: #ff9800;
        }
      }
    }
  }
  .head-bottom.selectOne{
    border-top-left-radius: 0;
    border-top-right-radius: px;
  }
  .head-bottom.selectTow{
    border-top-left-radius: 6px;
    border-top-right-radius: 0;
  }
}

.store{
  display: flex;
  flex-direction: column;

  .name{
    padding: 4px 0 0px;
    font-size: 14px;
  }
  .goods-box{
    .goods-item{
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      .left{
        width: 60px;
        height: 60px;
        image{
          border-radius: 4px;
          overflow: hidden;
          width: 100%;
          height: 100%;
          background-color: #f1f1f1;
        }
      }
      .right{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding-left: 14px;
        .row1{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .tit{
            font-size: 14px;
            color: #333333;
            font-weight: bold;
            flex: 1;
            flex-wrap: wrap;
            .zk{
              padding: 1px 3px;
              font-size: 10px;
              margin-right: 8px;
              border-radius: 4px;
              background-color: #F9221D;
              color: #ffffff;
            }
          }
          .old-price{
            padding-left: 12px;
            font-size: 14px;
            color: #888888;
            font-weight: bold;
            .lt{
              text-decoration: line-through;
            }
            .fh{
              font-size: 10px;
            }
          }
          .price{
            font-size: 16px;
            padding-left: 12px;
            color: #333333;
            font-weight: bold;
            .fh{
              font-size: 10px;
            }
          }
        }
        .row2{

        }
        .row3{
          font-size: 10px;
          color: #888888;
        }
      }
    }
    .goods-item:first-child{
      margin: 0;
    }
  }
  .peisong{
    .right{
      font-size: 14px;
      font-weight: bold;
    }
    .left{
      font-size: 16px;
      font-weight: bold;
      .fh{
        font-size: 10px;
      }
    }
  }
  .zhekou-box{
    .zhekou{
      display: flex;
      flex-direction: column;
      margin-top: 12px;
      .row1{
        align-items: center;
        .left{
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 20px;
          line-height: 20px;
          i{
            font-size: 16px;
            color: #ff5722;
          }
          .tit{
            font-weight: bold;
            margin-left: 6px;
            font-size: 14px;
            color: #333;
          }
        }
        .right{
          .tag1{
            font-weight: bold;
            font-size: 14px;
            color: #ff5722;
          }
        }
      }
      .row2{

        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #888;
      }

    }
    .zhekou:first-child{
      margin: 0;
    }
  }

  .totalbox{
    align-items: flex-end;
    .left{
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #888;
      [class*="hxicon-"]{
        color: #aaa;
        margin-left: 4px;
        font-size: 16px;
      }
    }
    .right{
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      .yh{
        color: #ff5722;
        .txt{

          color: #000;
          font-size: 15px;
        }
        .fh{
          font-weight: bold;
          margin-left: 3px;
          font-size: 13px;
        }
        .num{
          font-weight: bold;
          font-size: 18px;
        }
      }
      .total{
        margin-left: 16px;
        color: #333;
        .txt{
          font-size: 15px;
        }
        .fh{
          margin-left: 3px;
          font-size: 12px;
          font-weight: bold;
        }
        .num{
          font-weight: 900;
          font-size: 22px;
        }
      }
    }
  }
}

.privacy{
  display: flex;
  flex-direction: column;

  .row1{
    align-items: flex-end;
    .left{
      display: flex;
      flex-direction: row;
      align-items: center;
      .icon1{
        color: #444;
        font-size: 24px;
      }
      .icon2{
        color: #aaa;
        margin-left: 6px;
        font-size: 16px;
      }
      .txt{
        color: #333;
        margin-left: 6px;
        font-weight: bold;
        font-size: 14px;
      }
    }
    .right{

    }
  }
  .row2{
    margin-top: 4px;
    color: #888;
    font-size: 12px;
  }
  .row3{
    margin-top: 8px;
    font-size: 12px;
    color: #ff9800;
  }
}
.other-box{
  display: flex;
  flex-direction: column;
  .row{
    align-items: center;
    .left{
      font-size: 14px;
      color: #333;
      font-weight: bold;
      flex: 1;
    }
    .right{
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
      width: 80%;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      color: #aaa;
      [class*="hxicon-"]{
        position: relative;
        top: 2px;
        font-size: 14px;
      }
    }
  }
}
.body-end{
  height: 100px;
}
.foot{
  z-index: 11;
  position: fixed;
  display: flex;
  flex-direction: row;
  border-radius: 50px;
  overflow: hidden;
  bottom: 12px;
  left: 12px;
  right: 12px;
  height: 50px;

  .left{
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #222222;
    flex: 1;

    .price{
      display: flex;
      flex-direction: row;
      align-items: baseline;
      color: #fff;
      height: 25px;
      line-height: 25px;
      .fh{
        font-weight: bold;
        font-size: 12px;
      }
      .txt{

        font-size: 22px;
        font-weight: bold;
      }
    }
    .discount{
      margin-left: 2px;
      font-size: 10px;
      color: #bbb;
    }
  }
  .center{
    display: flex;
    align-items: center;
    background-color: #444;
    color: #FFC107;
    font-weight: bold;
    font-size: 16px;
    padding-left: 15px;
    padding-right: 15px;
    transition: all 0.3s;
  }
  .center:active{
    background-color: #666;
  }
  .right{
    display: flex;
    align-items: center;
    color: #222;
    font-weight: bold;
    font-size: 16px;
    padding-left: 15px;
    padding-right: 15px;
    transition: all 0.3s;
    background: linear-gradient(45deg, #FFEB3B, #FFC107);
  }
  .right:active{
    background: linear-gradient(45deg, #e0ce31, #e4ad06);
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
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 20;
}
.picker-popup {
  background: #fff;
  width: 100%;
}
.picker-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.btn-cancel {
  color: red;
}
.btn-confirm {
  color: green;
}
.picker-body {
  max-height: 300px;
  overflow-y: auto;
}
.picker-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.picker-item.active {
  background: #f0f0f0;
}
</style>
