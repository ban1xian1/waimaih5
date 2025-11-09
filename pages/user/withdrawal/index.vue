<template>
  <view>
    <view class="custom-navbar">
      <!-- 左上角返回按钮 -->
      <view class="nav-left" @click="goBack">
        <uni-icons :type="left" size="28"  />
      </view>
      <!-- 中间标题 -->
      <view class="nav-title">Solicitar retiro</view>
      <view class="navbar-right btn_right" @click="jump_his">
        <text>Retiros</text>
      </view>
    </view>
    <view class="fenhong_box">
      <view class="fenhong_box_ch">Balance</view>
      <view class="fenhong_box_ch" style="font-size: 20px;">{{user_money}}</view>
      <view class="fenhong_box_ch">Congelar：{{user_money_frozen}}</view>
    </view>
    <view class="cu-list menu sm-border margin-top">
      <view class="hist">
        <view style="width: 100%!important;">
          <input
              v-model="qk_money"
              type="number"
              placeholder="Por favor ingrese la cantidad"
              class="input-center"
          />
        </view>
      </view>
      <view class="hist">
        <view class="left">
          Cuenta bancaria:
        </view>
        <view class="right" @click="showPicker=true">
          {{ xzinfo.userbank_name }}-{{ xzinfo.userbank_num }}
          <i class="hxicon-right icon1" style="float: right;color: #6a737d"></i>
        </view>
      </view>
      <view class="hist">
        <view class="left">
          Contraseña:
        </view>
        <view class="right">
          <input
              v-model="pay_password"
              type="password"
              placeholder="Por favor ingrese la contraseña de pago"
          />
        </view>
      </view>

    </view>
    <view class="btn" @click="submit">
      <text>Entregar</text>
    </view>
    <view v-if="showPicker" class="picker-mask" @click="showPicker=false">
      <view class="picker-popup">
        <scroll-view class="picker-body" scroll-y>
          <view
              v-for="(item, idx) in options"
              :key="item.id"
              @click="selectItem(idx)"
              :class="{active: index === idx}"
              class="picker-item"
          >
            {{ item.userbank_name }}-{{ item.userbank_num }}
          </view>
        </scroll-view>
      </view>
    </view>

  </view>




</template>

<script>
import UniIcons from "../../../components/uni-icons/uni-icons.vue";

import {
  mapState
} from 'vuex';
import {qk} from "../../../common/vmeitime-http/user";

export default {
  components: { UniIcons},
  data() {
    return {
      left: 'left-nav',
      user_money:0,
      user_money_frozen:0,
      lists:[],
      index:0,
      cancelText: 'Cancelar',
      confirmText: 'Aceptar',
      showPicker: false,
      options:[],
      xzinfo:{},
      qk_money:'',
      pay_password:'',
      is_going:false

    }
  },
  computed: {
    ...mapState(['hasLogin','userData'])
  },
  onShow(){
    let that=this;
    if(!this.hasLogin){
      uni.reLaunch({
        url: '/pages/user/login/login'
      });
      return;
    }
    this.$api.user.userDetalles().then(function (e){
      let info=e.data.data;
      that.user_money=info.user_money;
      that.user_money_frozen=info.user_money_frozen;
      that.options=info.bank;
      if(that.options.length==0){
        uni.reLaunch({
          url:'/pages/user/bank/index'
        })
      }
      that.xzinfo=info.bank[0]
      console.log(info);
    }).catch(function (err){
      console.log(err);
    });
  },
  methods: {
    goBack() {
      uni.reLaunch({
        url:'/pages/user/center/center'
      })
    },
    jump_his(){
      uni.navigateTo({
        url: '/pages/user/withdrawal/list',
      });
    },
    change(e) {
      console.log(e);
    },
    selectItem(item) {
      this.showPicker=false;
      this.index=item
      this.xzinfo=this.options[item]
      console.log(item)
    },
    submit(){
      let that=this;
      let data={};
      data.money=this.qk_money;
      data.bank_id=this.xzinfo.userbank_id
      data.pay_password=this.pay_password;
      uni.showLoading()
      if(this.is_going===true){
        return;
      }
      this.is_going=true;
      this.$api.user.qk(data).then(function (e){
        uni.hideLoading();
        if(e.data.code!=1){
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: e.data.msg
          });
          that.is_going=false;
          return;
        }
        uni.showToast({
          icon: 'success',
          position: 'bottom',
          title:'Éxito',
        });
        setTimeout(()=>{
          uni.reLaunch({
            url:'/pages/user/center/center'
          })
        },2000)
      }).catch(function (err){
        console.log(err);
        that.is_going=false;
      });
      return;
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  display: flex;
  align-items: center;
  height: 44px;
  padding-top: env(safe-area-inset-top); /* 适配 iOS 顶部安全区 */
  background-color: #ffffff; /* 白色背景 */
  border-bottom: 1px solid #eee;
  position: relative;
}

.nav-left {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: #000;
}
.fenhong_box{
  width: 100%;
  background-color: #f75927;
  display: flex;
  flex-direction: column;
  color: white;
  padding: 15px 20px;
  font-size: 15px;

}
.fenhong_box_ch{
  width: 100%;
  text-align: center;
  padding-bottom: 5px;
  padding-top: 5px;
}
.hist{
  background-color: white;
  display: flex;
  padding:10px;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  border-bottom: 1px solid #eee;
}.left{
   width: 30%;
 }
.right{
  margin-left: 5px;
  width: 65%;

}
.input-center {
  text-align: center !important;
}
.btn{
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
.btn_right{

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  margin-right:5px;
  height: 32px;
  font-weight: bold;
  color: #333;
  padding: 0 5px;
  background: linear-gradient(45deg, #ffd900, #ffc107);
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
