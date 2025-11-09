<template>
  <view class="container" v-if="isShow">
    <hx-navbar
        :status-bar="true"
        :back="false"
        barPlaceholder="hidden"
        :fixed="true"
        :title.sync="pageTitle"
        :color="['#ffffff','#666666']"
        transparent="auto"
        :background-color="[255,255,255]"
        @click-left="navTo(userSettingUrl)">
      <view  slot="left" >
        <view style="margin-left: 26upx;font-size: 22px;">
          <i class="hxicon-settings"></i>
        </view>
      </view>
      <view  slot="right" >
        <view style="margin-right: 16upx;font-size: 22px;">
          <i class="hxicon-mark"></i>
        </view>
      </view>
    </hx-navbar>
    <view class="user-section ">
      <image class="bg" src="/static/img/user/user-bg.jpg"></image>
      <view class="user-info-box">
        <view class="portrait-box" @click="userBash">
          <image class="portrait" :src="memberInfo.face || defaultFace"></image>
        </view>
        <view class="info-box" @click="userBash">
          <text class="username">{{memberInfo.nickname || ''}}</text>
        </view>
      </view>
      <view class="vip-card-box" v-if="1==2">
        <image class="card-bg" src="/static/img/user/vip-card-bg.png" mode=""></image>
        <view class="b-btn">
          立即开通
        </view>
        <view class="tit">
          <text class="hxicon-iLinkapp-"></text>
          DCloud会员
        </view>
        <text class="e-m">DCloud Union</text>
        <text class="e-b">开通会员开发无bug 一测就上线</text>
      </view>
    </view>

    <view
        class="cover-container"
        :style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
        @touchstart="coverTouchstart"
        @touchmove="coverTouchmove"
        @touchend="coverTouchend"
    >
      <image class="arc" src="/static/img/user/arc.png"></image>

      <view class="tj-sction">
        <view class="tj-item" @click="moneyLog">
          <text class="num">{{memberInfo.user_money}}</text>
          <text>Balance</text>
        </view>
<!--        @click="navTo('/pages/user/coupon/coupon')"-->
        <view  class="tj-item" >
          <text class="num">0</text>
          <text>Cupones</text>
<!--         优惠卷 -->
        </view>
        <view class="tj-item" @click="gojf">
          <text class="num">{{memberInfo.user_point}}</text>
          <text>Gana puntos </text>
        </view>
      </view>
      <!-- 订单 -->
      <view class="order-section">
        <view  class="order-item"  @click="goOrder(1)" url="/pages/order/order?state=1" >
          <text class="hxicon-pay"></text>
          <text>Esperar a pagar</text>
<!--          待付款-->
        </view >
        <view  class="order-item" @click="goOrder(2)" url="/pages/order/order?state=2" >
          <text class="hxicon-deliver"></text>
          <text>Esperando recibir</text>
        </view >
        <view  class="order-item" @click="goOrder(3)"  url="/pages/order/order?state=3" >
          <text class="hxicon-comment"></text>
          <text>Esperando comentarios</text>
        </view >
        <view  class="order-item" @click="goOrder(4)"  url="/pages/order/order?state=4" >
          <text class="bx_refund"></text>
          <text>Gestión reembolsos </text>
<!--          退款/售后-->
        </view >
        <view  class="order-item" @click="goOrder(0)"  url="/pages/order/order?state=0" >
          <text class="hxicon-form"></text>
          <text>Todos los pedidos</text>
        </view >
      </view>
      <!-- 热门商品 -->
      <view class="history-section icon">
        <view class="sec-header">
          <text class="hxicon-lishijilu"></text>
          <text>Productos populares</text>
        </view>
        <scroll-view scroll-x class="h-list">
          <image   v-for="(item,i) in product" :key="i" @click="navTo(`/pages/product/product?id=${item.id}`)" :src="item.image" mode="aspectFill"></image>
        </scroll-view>

        <list-cell icon="bx_money2" iconColor="#e07472" title="Recargar"  @eventClick="getRecharge" ></list-cell>
        <list-cell icon="bx_money3" iconColor="#ff0000" title="Retirar"  @eventClick="navTo('/pages/user/withdrawal/index')" ></list-cell>
<!--     地址   -->
        <list-cell icon="hxicon-locationfill" iconColor="#5fcda2" title="Dirección de entrega" @eventClick="navTo('/pages/user/address/address')"></list-cell>
        <list-cell icon="hxicon-round_pay_fill" iconColor="#9789f7" title="invitar a amigos"  @eventClick="navTo(`/pages/user/invitar/index`)"></list-cell>
<!--        <list-cell icon="hxicon-message_fill_light" iconColor="#ee883b" title="晒单" tips="晒单抢红包"></list-cell>-->
<!--        <list-cell icon="hxicon-round_favor_fill" iconColor="#54b4ef" title="我的收藏"></list-cell>-->
        <list-cell icon="hxicon-settings" iconColor="#e07472" title="Ajustes" border="" @eventClick="navTo('/pages/user/setting/setting')"></list-cell>
      </view>
    </view>
  </view>
</template>
<script>
import hxNavbar from "@/components/hx-navbar/hx-navbar.vue"

import listCell from '@/components/mix-list-cell';
import {
  mapState
} from 'vuex';
import {userDetalles} from "../../../common/vmeitime-http/user";
let startY = 0, moveY = 0, pageAtTop = true;
export default {
  components: {
    listCell,
    hxNavbar
  },
  data(){
    return {
      pageTitle:"Mí",
      coverTransform: 'translateY(0px)',
      coverTransition: '0s',
      moving: false,
      defaultFace: '/static/img/user/missing-face.png',
      userSettingUrl: '/pages/user/setting/setting',
      memberInfo: {
        face: '',
        nickname: "",
        user_money:0,
        user_point:0,
      },
      isShow:false,
      product:[],
    }
  },
  onLoad(){
  },
  onReady() {

  },
  onShow(){
    let that=this;
    uni.showLoading({
      title: 'Cargando…',  // 文字内容
      mask: true           // 是否显示透明遮罩，防止触摸穿透
    })
    if(!this.hasLogin){
      uni.reLaunch({
        url: '/pages/user/login/login'
      });
      return;
    }
    //获取会员详细信息
    this.$api.user.userDetalles().then(function (e){
      uni.hideLoading();
      let info=e.data.data;
      that.memberInfo.nickname=info.user_name;
      that.memberInfo.user_money=info.user_money;
      that.memberInfo.user_point=info.user_point
      that.isShow=true;
      that.product=info.product;
      console.log( that.product);

    }).catch(function (err){
      console.log(err);
    });
    return;;


    if(member){
      this.memberInfo = {
        face: member.facke,
        nickname: member.nickname
      }
    }else{
      this.memberInfo = {
        face: '',
        nickname: ''
      }
    }

  },
  computed: {
    ...mapState(['hasLogin','userData'])
  },
  methods: {
    //个人信息
    userBash(){
      return false;
      if(this.userData){
        this.navTo('/pages/user/bash/bash')
      }else{
        uni.navigateTo({
          url: '/pages/user/login/login'
        });
      }
    },
    goOrder(type){
      uni.setStorageSync('orderState', type);
      uni.switchTab({
        url: '/pages/order/order'
      });
    },


    /**
     *  会员卡下拉和回弹
     *  1.关闭bounce避免ios端下拉冲突
     *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
     *    transition设置0.1秒延迟，让css来过渡这段空窗期
     *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
     */
    coverTouchstart(e){
      if(pageAtTop === false){
        return;
      }
      this.coverTransition = 'transform .1s linear';
      startY = e.touches[0].clientY;
    },
    coverTouchmove(e){
      moveY = e.touches[0].clientY;
      let moveDistance = moveY - startY;
      if(moveDistance < 0){
        this.moving = false;
        return;
      }
      this.moving = true;
      if(moveDistance >= 80 && moveDistance < 100){
        moveDistance = 80;
      }

      if(moveDistance > 0 && moveDistance <= 80){
        this.coverTransform = `translateY(${moveDistance}px)`;
      }
    },
    coverTouchend(){
      if(this.moving === false){
        return;
      }
      this.moving = false;
      this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
      this.coverTransform = 'translateY(0px)';
    },
    moneyLog(){
      uni.navigateTo({
        url: '/pages/user/moneylog/index',
      });
    },
    gojf(){
      uni.navigateTo({
        url: '/pages/user/jf/index',
      });
    },
    getRecharge(){
      uni.showModal({
        title: 'Aviso', //提示
        content: 'Contact the mall manager to get the recharge method', //服务器错误
        confirmColor: '#3CC51F',
        confirmText:'Confirmar',
        showCancel: false,
        success: function (msg) {
          if (msg.confirm) {

          }
        }
      });
    }

  }
}
</script>
<style lang='scss'>
.bx_refund{
  margin-bottom: 18upx;
}
%flex-center {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
%section {
  display:flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 10upx;
}

.user-section{
  height: 520upx;
  padding: 100upx 30upx 0;
  position:relative;

  .bg{
    position:absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);


  }
}
.user-info-box{
  height: 180upx;
  display:flex;
  align-items:center;
  position:relative;
  z-index: 1;
  .portrait{
    width: 128upx;
    height: 128upx;
    /* border:5upx solid #fff; */
    border-radius: 50%;
    box-shadow: 0 0px 12px #848484;
  }
  .username{
    font-size: $font-lg + 4upx;
    color: $font-color-dark;
    margin-left: 20upx;
    font-weight: bold;
  }
}

.vip-card-box{
  flex-direction: column;
  color: #f7d680;
  height: 240upx;
  background: linear-gradient(to right, rgba(0,0,0,.7), rgba(0,0,0,.8));
  border-radius: 16upx 16upx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20upx 24upx;
  .card-bg{
    position:absolute;
    top: 20upx;
    right: 0;
    width: 380upx;
    height: 260upx;
  }
  .b-btn{
    position: absolute;
    right: 20upx;
    top: 16upx;
    width: 132upx;
    height: 40upx;
    text-align: center;
    line-height: 40upx;
    font-size: 22upx;
    color: #36343c;
    border-radius: 20px;
    background: linear-gradient(to right, #f9e6af, #ffd465);
    z-index: 1;
  }
  .tit{
    font-size: $font-base+2upx;
    color: #f7d680;
    margin-bottom: 28upx;
    [class*="hxicon-"]{
      color: #f6e5a3;
      margin-right: 16upx;
    }
  }
  .e-b{
    font-size: $font-sm;
    color: #d8cba9;
    margin-top: 10upx;
  }
}
.cover-container{
  background: $page-color-base;
  margin-top: -150upx;
  padding: 0 30upx;
  position:relative;
  background: #f5f5f5;
  padding-bottom: 20upx;
  .arc{
    position:absolute;
    left: 0;
    top: -34upx;
    width: 100%;
    height: 36upx;
  }
}
.tj-sction{
  @extend %section;
  .tj-item{
    @extend %flex-center;
    flex-direction: column;
    height: 140upx;
    font-size: $font-sm;
    color: #75787d;
  }
  .num{
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 8upx;
  }
}
.order-section{
  @extend %section;
  padding: 28upx 0;
  margin-top: 20upx;
  .order-item{
    @extend %flex-center;
    width: 120upx;
    height: 120upx;
    border-radius: 10upx;
    font-size: $font-sm;
    color: $font-color-dark;
  }
  [class*="hxicon-"]{
    font-size: 48upx;
    margin-bottom: 18upx;
    color: #ffd21c;
  }
  .icon-shouhoutuikuan{
    font-size:44upx;
  }
}
.history-section{
  padding: 30upx 0 0;
  margin-top: 20upx;
  background: #fff;
  border-radius:10upx;
  .sec-header{
    display:flex;
    align-items: center;
    font-size: $font-base;
    color: $font-color-dark;
    line-height: 40upx;
    margin-left: 30upx;
    [class*="hxicon-"]{
      font-size: 44upx;
      color: #5eba8f;
      margin-right: 16upx;
      line-height: 40upx;
    }
  }
  .h-list{
    white-space: nowrap;
    padding: 30upx 30upx 0;
    image{
      display:inline-block;
      width: 160upx;
      height: 160upx;
      margin-right: 20upx;
      border-radius: 10upx;
    }
  }
}

</style>