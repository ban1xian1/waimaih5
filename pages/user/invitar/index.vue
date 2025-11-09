<template>
  <view v-if="is_show">
    <hx-navbar  title="invitar a amigo" backTabbarUrl="/pages/user/center/center"></hx-navbar>

    <view class="qrcode-box">
      <canvas canvas-id="qrcode" id="qrcode_id" style="width:300px;height:300px;"></canvas>
    </view>
    <view class="qrcode_url">
      {{qrText}}
    </view>
    <view class="add-btn" @click="copyUrl">
      <text>Copiar enlace</text>
    </view>
  </view>
</template>

<script>
import {getCode, userDetalles} from "../../../common/vmeitime-http/user";

var that;
import {
  mapState
} from 'vuex';
import UQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js'
export default {
  data() {
    return {
      qrText: 'https://example.com',
      is_show:false
    }
  },
  onLoad(){
    var that = this;
  },
  onReady(){
    if(!this.hasLogin){
      uni.reLaunch({
        url: '/pages/user/login/login'
      });
      return;
    }
    this.setCode();
  },
  mounted() {
    that= this;
  },
  computed: {
    ...mapState(['hasLogin','userData'])
  },
  methods: {
    back(){
      uni.redirectTo({
        url: '/pages/user/login/login'
      });
    },
    getDomain(){
      let origin = window.location.origin || (window.location.protocol + '//' + window.location.hostname)
      return origin
    },
    setCode(){
      let that=this;
      that.$api.user.userDetalles().then(function (e){
        that.qrText=that.getDomain()+'#/pages/user/register/register?fromto='+e.data.data.invite_code;
        const qr = new UQRCode();
        qr.canvasId = 'qrcode'   // canvas-id
        qr.data = that.qrText    // 二维码内容
        qr.size = 300            // 二维码大小
        qr.canvasContext = uni.createCanvasContext('qrcode', that)
        qr.make()                // 生成二维码
        qr.drawCanvas()
        uni.canvasToTempFilePath({
          canvasId: 'qrcode',
          success: res => {
            that.is_show=true;
          },
          fail: err => {
            console.error('error', err)
          }
        }, that)

      }).catch(function (err){

      });
     that.is_show=true;
    },
    copyUrl() {
      let url=this.qrText
      uni.setClipboardData({
        data: url,
        success() {
          uni.showToast({
            title: 'Copia exitosa',
            icon: 'success'
          })
        }
      })
    }

  }
}
</script>

<style scoped>
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
#qrcode_id{
  margin: 0 auto;

}
.qrcode_url{
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}
.qrcode-box{
  padding: 15px;
}

</style>
