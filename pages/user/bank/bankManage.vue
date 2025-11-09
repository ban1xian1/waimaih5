<template>
  <view class="content" v-if="isShow">
    <hx-navbar title="Agregar cuenta Nequi" backTabbarUrl="/pages/user/center/center" :backgroundColor="[241,241,241]"></hx-navbar>
    <view class="bb15">

    </view>
    <view class="list-box">
      <view class="row b-b">
        <text class="tit">Banco</text>
        <input class="input" type="text" v-model="Data.userbank_name" placeholder="" placeholder-class="placeholder" />
      </view>
      <view class="row b-b">
        <text class="tit">Nombre</text>
        <input class="input"  v-model="Data.userbank_tname" placeholder="" placeholder-class="placeholder" />
      </view>
      <view class="row b-b">
        <text class="tit">Cuenta</text>
        <input class="input" type="text" v-model="Data.userbank_num" placeholder="" placeholder-class="placeholder" />
      </view>
      <view class="row b-b">
        <text class="tit">Teléfono</text>
        <input class="input" type="text" v-model="Data.userbank_address" placeholder="" placeholder-class="placeholder" />
      </view>
    </view>
    <view class="add-btn" @click="confirm">
      <text>Save</text>
    </view>
  </view>
</template>

<script>
import {userBankAdd} from "../../../common/vmeitime-http/user";

export default {
  data() {
    return {
      Data: {
        id:0,
        userbank_name: 'Nequi',
        userbank_tname: '',
        userbank_num: '',
        userbank_address: '',
      },
      isShow:false,
    }
  },
  onLoad(option){
    let title = 'shop';
    this.isShow=true;
    this.manageType = option.type;

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
      data.userbank_name = this.Data.userbank_name.trim();
      data.userbank_tname = this.Data.userbank_tname.trim();
      data.userbank_num = this.Data.userbank_num.trim();
      data.userbank_address = this.Data.userbank_address.trim();
      if (data.userbank_name == '') {
        this.$msg('El campo del banco es obligatorio');
        return;
      }
      if (data.userbank_tname == '') {
        this.$msg('El campo de nombre es obligatorio');
        return;
      }
      if (!data.userbank_num) {
        this.$msg('El campo de cuenta es obligatorio');
        return;
      }
      if (!data.userbank_address) {
        this.$msg('El campo de teléfono es obligatorio');
        return;
      }
      this.$api.user.userBankAdd(data).then(function (e) {
        that.$msg('success');
        setTimeout(function () {
          uni.reLaunch({
            url: '/pages/user/bank/index',
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
    width: 100px!important;
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
