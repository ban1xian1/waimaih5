<template>
  <view>
    <view class="custom-navbar">
      <!-- 左上角返回按钮 -->
      <view class="nav-left" @click="goBack">
        <uni-icons :type="left" size="28"  />
      </view>
      <!-- 中间标题 -->
      <view class="nav-title">Detalles del fondo</view>
    </view>
    <view class="fenhong_box">
      <view class="fenhong_box_ch">Balance</view>
      <view class="fenhong_box_ch" style="font-size: 20px;">{{user_money}}</view>
      <view class="fenhong_box_ch">Congelar：{{user_money_frozen}}</view>
    </view>
    <view class="cu-list menu sm-border margin-top">
      <view class="hist" v-for="(item, index) in lists" :key="index + 'b'">
        <view class="left">
          <view>
            {{item.ts}}
          </view>
          <view>
            {{item.moneylog_atime}}
          </view>
        </view>
        <view class="right" :class="item.moneylog>0?'right_green':'right_red'">
          {{item.moneylog}}
        </view>
      </view>

    </view>

  </view>


</template>

<script>
import UniIcons from "../../../components/uni-icons/uni-icons.vue";

import {
  mapState
} from 'vuex';
export default {
  components: {UniIcons},
  data() {
    return {
      left: 'left-nav',
      user_money:0,
      user_money_frozen:0,
      lists:[],
      page:1,
      isgoing:false,
      count:0,
      time:'',
    }
  },
  computed: {
    ...mapState(['hasLogin','userData'])
  },
  onPageScroll(e){
    let that= this;
    uni.createSelectorQuery().select('.sm-border') // 你的页面最外层容器
        .boundingClientRect(rect => {
          uni.getSystemInfo({
            success: info => {
              const windowHeight = info.windowHeight; // 屏幕可视区域高度
              const pageHeight = rect.height;         // 页面总高度
              const distanceToBottom = pageHeight - e.scrollTop - windowHeight;
              if (distanceToBottom < 300&&that.isgoing===false) {
                clearTimeout(that.timer)
                that.timer = setTimeout(() => {
                  that.page=that.page+1;
                  that.getdata();
                }, 400) // 400ms 延迟
              }
            }
          });
        })
        .exec();
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
    }).catch(function (err){
      console.log(err);
    });
    this.lists=[];
    this.page=1;
    this.getdata()
  },
  methods: {
    goBack() {
      uni.reLaunch({
        url:'/pages/user/center/center'
      })
    },
    getdata(){
      let that=this;
      if(this.isgoing===true){
        return;
      }
      this.isgoing=true;
      this.$api.user.userMoneylogLists({page:that.page}).then(function (e){
        let info=e.data.data;
        that.count=info.count;
        let list=info.list;
        if(list.length===0){
          return;
        }
        for (let i=0;i<list.length;i++){
          that.lists.push(list[i]);
        }
        that.isgoing=false;
      }).catch(function (err){
        console.log(err);
      });
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
  padding: 0 17px;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  border-bottom: 1px solid #eee;
}
.left{
  display: flex;
  gap: 10px!important;
  flex-direction: column;

}
.right_green{
  color: green;
}
.right_red{
  color: red;
}
</style>
