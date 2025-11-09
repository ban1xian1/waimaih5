<template>
  <view>
    <view class="custom-navbar">
      <view class="nav-left" @click="goBack">
        <uni-icons :type="left" size="28"  />
      </view>
      <view class="nav-title">Historial retiros</view>
    </view>
    <view class="cu-list menu sm-border margin-top">
      <view class="hist" v-for="(item, index) in lists" :key="index + 'b'">
        <view class="hist_top">
          <view>Método de retiro</view>
          <view>Tarjeta bancaria</view>
        </view>
        <view class="hist_content">
          <view class="left" style="width: 45%">
            <view>
              Time
            </view>
            <view>
              {{item.cashout_atime_date}}
            </view>
          </view>
          <view class="left" style="width: 40%">
            <view>
              Monto
            </view>
            <view>
              {{item.cashout_money}}
            </view>
          </view>
          <view class="left" style="width: 15%">
            <view>
              Estado
            </view>
            <view :class="item.cashout_state==1?'right_green':(item.cashout_state==2?'right_red':'')">
            {{getchstatus(item.cashout_state)}}
            </view>
          </view>
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
import {jfLists, quList} from "../../../common/vmeitime-http/user";
export default {
  components: {UniIcons},
  onPageScroll(e){
    let that= this;
    uni.createSelectorQuery().select('.margin-top') // 你的页面最外层容器
        .boundingClientRect(rect => {
          uni.getSystemInfo({
            success: info => {
              const windowHeight = info.windowHeight; // 屏幕可视区域高度
              const pageHeight = rect.height;         // 页面总高度
              console.log(pageHeight,e.scrollTop,windowHeight);

              const distanceToBottom = pageHeight - e.scrollTop - windowHeight;
              if (distanceToBottom < 300) {
                clearTimeout(that.timer)
                that.timer = setTimeout(() => {
                  that.page=that.page+1;
                  console.log(that.page);
                  that.getdata();
                }, 400) // 400ms 延迟
              }
            }
          });
        })
        .exec();
  },
  data() {
    return {
      left: 'left-nav',
      lists:[],
      page:1,
      page_num:10,
      timer:'',
      apigoing:false,
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
    this.lists=[];
    this.page=1;
    this.apigoing=false;
    //获取会员详细信息
    this.getdata();

  },
  methods: {
    getchstatus(type){

      type=Number(type);
      if(type===1) return 'Éxito';
      if(type===2) return 'Fallo';
      return 'Pendiente';
    },
    goBack() {
      uni.redirectTo({
        url:'/pages/user/withdrawal/index'
      })
    },
    getdata(){
      let that=this;
      if(this.apigoing){
        return;
      }
      this.apigoing=true;
      this.$api.user.quList({page:that.page}).then(function (e){

        let newlist=e.data.data.list;
        if(newlist.length===0){
          return;
        }
        for (let i=0;i<newlist.length;i++){
          that.lists.push(newlist[i]);
        }
        that.apigoing=false;
      }).catch(function (err){
        console.log(err);
      });
    },
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
  padding: 5px 17px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 10px!important;
}
.left{
  display: flex;
  gap: 10px!important;
  flex-direction: column;
  text-align: left;

}
.right_green{
  color: green;
}
.right_red{
  color: red;
}
.hist_top{
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0.75rem  0;
}
.hist_content{
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.content{
  flex: 1;
}
</style>
