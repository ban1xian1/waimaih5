<template>
  <view v-if="address_show&&cart_show">
    <hx-navbar
        :border="false"
        :centerSlidiSwitch="true"
        :rightSlidiSwitch="false"
        :fixed="true"
        :backgroundColor="[255,193,7]"
        :pageScroll.sync="scrollData">
      <view style="text-align: center;width: 100%;">
        <text>Agregar pedido</text>
      </view>
      <view slot="centerAfter" style="text-align: center;width: 100%;">
        <text>Agregar pedido </text>
      </view>
    </hx-navbar>
    <view class="head tab-right-active">
      <view class="tab-box" v-if="tabIndex>0">
        <view class="item left" :class="{'active':tabIndex == 1}"  @click="tabIndex = 1">
          <view class="tit-box">
            <text>Entrega</text>
          </view>
        </view>
        <!--				<view class="item right" :class="{'active':tabIndex == 2}"  @click="tabIndex=2">-->
        <!--					<view class="tit-box">-->
        <!--						<text>到店自取</text>-->
        <!--					</view>-->
        <!--				</view>-->
      </view>
      <view class="container head-bottom" :class="{'selectOne': tabIndex == 1,'selectTow':tabIndex == 2}">
        <view class="tab" v-if="tabIndex == 2">
        </view>
        <view class="tab" v-else>
          <view class="t-top">
            <view class="t-top-box" style="display: flex;justify-content: space-between;"  @click="changeAddressShow=true">

              <block>
                <view style="width: 90%">
                  <view style="display: flex;justify-content: space-between;">
                    <text>Receptor：{{addressData.user_tname}}</text>
                    <text>{{maskString(addressData.user_phone)}}</text>
                  </view>
                  <view>Dirección de entrega：{{addressData.address_text}}</view>
                </view>
                <view style="display: flex;justify-content: center;align-items: center; height: 100%;min-height: 50px;     ">
                  <i class="hxicon-right icon1"></i>
                </view>

              </block>
            </view>
          </view>
          <view class="t-bb"></view>
          <view class="t-bottom">
            <view class="row1">
              <view class="left">
                <text>Aviso importante</text>
              </view>
              <view class="right" v-if="1==2">
                <text>未选择(必选)</text>
                <i class="hxicon-right"></i>
              </view>
            </view>
            <view class="row2">
              <text>Actualice la dirección con el punto exacto de recogida para reducir el contacto.</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="b-r m-t container p12">
      <view class="store">
        <view class="name ">
          <text>{{storeData.name}}</text>
          <!-- 标志性位置 ，社区  如：白羊区店，玫瑰园小区 -->
          <text v-if="storeData.community">({{storeData.community}})</text>
        </view>
        <view class="p-bb b-b"></view>
        <view class="goods-box" >
          <block v-for="(goods,i) in shoppCart" :key="i" v-if="shoppCart">
            <view class="goods-item" >
              <view class="left">
                <image :src="goods.image" mode="aspectFit"></image>
              </view>
              <view class="right">
                <view class="row1">
                  <view class="tit">
                    <text class="zk" v-if="goods.price && Number(goods.real_price) < Number(goods.price)">SALE</text>
                    <text>{{goods.name}}</text>

                  </view>
                  <view class="old-price" v-if="goods.price">
                    <text class="fh"></text><text class="lt">{{goods.price}}</text>
                  </view>
                  <view class="price">
                    <text class="fh"></text><text>{{goods.real_price}}</text>
                  </view>
                </view>
                <view class="row2">
                  <text>{{goods.jy_describe}}</text>
                </view>
                <view class="row3">
                  <text>x{{goods.num}}</text>
                  <text style="margin-left: 50px;" v-if="parseFloat(goods.package_fee)>0">Costo de embalaje del producto:{{goods.package_fee}}</text>
                </view>
              </view>
            </view>
          </block>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong">
          <view class="right">
            <text>Tarifa de envío</text>
<!--            打包费用-->
          </view>
          <view class="left">
            <text class="fh"></text><text>{{storeData.base_package_fee}}</text>
          </view>
        </view>
        <view class="p-bb b-b"></view>
        <view class="flex-rl peisong">
          <view class="right">
            <text>Costo de entrega</text>
<!--            配送费用-->
          </view>
          <view class="left">
            <text class="fh"></text><text>{{storeData.delivery_fee}}</text>
          </view>
        </view>
        <view class="p-bb b-b"></view>
        <view class="zhekou-box" v-if="1==2">
          <block v-for="(item,i) in couponData" :key="i">
            <view class="zhekou">
              <view class="flex-rl  row1">
                <view class="left">
                  <i class="hxicon" :class="item.icon"></i>
                  <text class="tit">{{item.tit}}</text>
                </view>
                <view class="right">
                  <view class="tag1">
                    <text>{{item.content}}</text>
                  </view>
                </view>
              </view>
              <!-- 备注 -->
              <view class="row2" v-if="item.remark">
                {{item.remark}}
              </view>
            </view>
          </block>
        </view>

        <view class="flex-rl totalbox" >
          <view class="left">
            <text>Reglas de descuento</text>
            <i class="hxicon-question"></i>
          </view>
          <view class="right">
            <view class="yh">
              <text class="txt">Ahorro</text>
              <text class="fh"></text>
              <text class="num">{{totalYhPrice}}</text>
            </view>
            <view class="total">
              <text class="txt">Subtotal</text>
              <text class="fh"></text>
              <text class="num">{{totalPrice}}</text>
            </view>
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
            <i class="hxicon-right"></i>
          </view>
        </view>
      </view>
    </view>
    <view class="b-r m-t container p12">
      <view class="privacy">
        <view class="flex-rl row1 ">
          <view class="left">
            <i class=" hxicon-cardboardfill icon1"></i>
            <text class="txt">Protección de número</text>
            <i class=" hxicon-question icon2"></i>
          </view>
          <view class="right">
            <switch :checked="ysStatus" @change="privacyStatusChange" color="#ffc107"/>
          </view>
        </view>
        <view class="row2">
          Su número real estará oculto para comerciantes y repartidores, protegiendo su privacidad.
        </view>
        <view class="row3" v-if="ysStatus">
          Las llamadas con protección de número pueden ser grabadas para garantizar la calidad del servicio.
        </view>
      </view>
    </view>
    <view class="b-r m-t container p12 other-box">
      <view class="flex-rl row" @click="changeNota(remark)">
        <view class="left">
          <text>Nota</text>
        </view>
        <view class="right">
          <text v-if="remark">{{remark}}</text>
          <text v-if="!remark">Clic para nota</text>
          <i class="hxicon-right"></i>
        </view>
      </view>
    </view>
    <view class="body-end"></view>

    <view class="foot">
      <view class="left">
        <view class="price">
          <text class="fh"></text>
          <text class="txt">{{totalPrice}}</text>
        </view>
        <view class="discount" v-if="totalYhPrice">
          <text>Ahorro:{{totalYhPrice}}</text>
        </view>
      </view>
      <!--			<view class="center">-->
      <!--				<text>找人付</text>-->
      <!--			</view>-->
      <view class="right" @click="submit">
        <text>Agregar pedido</text>
      </view>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="popup-box">
        <text class="popup-title">Ingrese nota</text>
        <input class="popup-input" v-model="inputValue"  placeholder="Ingrese nota..." />

        <view class="popup-btns">
          <button @click="closePopup">Cancelar</button>
          <button @click="confirmInput"> Confirmar </button>
        </view>
      </view>
    </uni-popup>
    <view v-if="changeAddressShow" class="picker-mask" @click="changeAddressShow=false">
      <view class="picker-popup">
        <scroll-view class="picker-body" scroll-y>
          <view
              v-for="(item, idx) in addressDataAll"
              :key="item.id"
              @click="selectItem(idx)"
              :class="{active: index === idx}"
              class="picker-item"
          >
            {{item.user_tname}}-{{maskString(item.user_phone)}}-{{item.address_text}}
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  mapState
} from 'vuex';
import {shopCartDetalles, userAddressLists} from "../../common/vmeitime-http/user";
import UniPopup from "../../components/uni-popup/uni-popup.vue";
export default {
  components: {UniPopup},
  data() {
    return {
      scrollData: {},
      //购物车缓存 Storage 名称
      shoppingCartStorageName: 'shopping_cart',
      //门店信息
      storeData:{},
      //购物车
      shoppCart:[],
      //头部选项卡 参数为 0不显示选项卡,1,2
      tabIndex:1,
      //收获地址
      addressData: [],
      addressDataAll:[],
      //手机隐私
      ysStatus: true,

      //优惠券
      couponData: [{
        id:"ASD2020410003",
        icon: "icon-ticket_money_fill",
        //标题
        tit: "门店新客立减",
        //说明
        content: "15元商家券",
        //备注
        remark: "满减券和商品折扣可同享",
        //面额
        value: 15
      },{
        id:"ASD2020410001",
        icon: "icon-ticket_money_fill",
        tit: "商家抵用立减",
        content: "-￥50",
        //面额
        value: 50
      }],

      //结算价
      totalPrice: 0,
      //已优惠价
      totalYhPrice: 0,
      //商品数量
      totalNumber: 0,
      remark: "",
      shop_id:0,
      inputValue: '',
      address_show:false,
      cart_show:false,
      changeAddressShow:false,
      index:0,
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
    that.$api.user.userAddressLists().then(function (e){
      if(e.data.code!=1){
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: e.data.msg||'error'
        });
        setTimeout(function (){
          uni.reLaunch({
            url: '/pages/user/center/center',
          });
        },2000)
        return;
      }
      if(e.data.data.length==0){
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: 'Por favor, añada primero la dirección de entrega'
        });
        setTimeout(function (){
          uni.reLaunch({
            url: '/pages/user/center/center',
          });
        },2000)
      }
     that.address_show=true;
     that.addressData=e.data.data[0];
     that.addressDataAll=e.data.data;

     console.log(that.addressData);
    }).catch(function (e){
      console.log(e);
    })
    that.$api.user.shopCartDetalles({shop_id:this.shop_id}).then(function (e){
      if(e.data.code!=1){
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: e.data.msg||'error'
        });
        setTimeout(function (){
          uni.reLaunch({
            url: '/pages/user/center/center',
          });
        },2000)
        return;
      }
      uni.hideLoading();
      that.cart_show=true;
      that.storeData=e.data.data.shop;
      that.shoppCart=e.data.data.list;
      let totalPrice = 0
      let totalNumber = 0
      let totalOldPrice = 0
      let cj = 0
      let op = 0
      let p = 0
      let num = 0
      for(var i in that.shoppCart){
        p = Number(that.shoppCart[i].real_price);
        op = Number(that.shoppCart[i].price);
        num = Number(that.shoppCart[i].num)
        totalNumber += num
        totalPrice += p * num
        if(op > p){
          cj +=  (op - p) * num
        }
        //判断商品打包费用
        if(Number(that.shoppCart[i].package_fee)>0){
          totalPrice+=num*Number(that.shoppCart[i].package_fee);
        }
      }
      //加上店铺打包费和配送费

      totalPrice+=Number(that.storeData.base_package_fee)
      totalPrice+=Number(that.storeData.delivery_fee)
      that.totalPrice = totalPrice
      that.totalYhPrice = cj
    }).catch(function (e){
      console.log(e);
      return true;
    })
  },
  onLoad(option){
    if(!this.hasLogin){
      uni.reLaunch({
        url: '/pages/user/login/login'
      });
      return;
    }
    this.shop_id=option.sid||0;
    return true;
  },
  onPageScroll(e){
    this.scrollData = e;
  },
  methods: {
    selectItem(index){
      this.addressData=this.addressDataAll[index];
      this.changeAddressShow=false;
      this.index=index;
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
