<template>
  <view v-if="isShow">
    <view class="head-box">
      <view class="navbar"></view>
      <view class="container">
        <view class="left">
          <view class="logo">
            <image :src="logoImage" mode="aspectFit"></image>
          </view>
        </view>
        <view v-if="1==2" class="right" :style="'padding-right: ' + MPPR + 'px'">
          <view class="address-box">
            <i class="hxicon-locationfill"></i>
            <text>幸福花园</text>
            <i class="hxicon-right"></i>
          </view>
          <view class="notice">
            <i class="hxicon-notice"></i>
          </view>
        </view>

      </view>
    </view>
    <view class="search-box" :class="{'QZBG':GDHEAD}" :style="GDHEAD ? 'padding-right: ' + MPPR + 'px' : ''">
      <!-- <view class="navbar" ></view> -->
      <view class="ctn">
        <view class="hx-search-box" @click="goSearch(null)">
          <uni-icons type="search" size="22" color="#666666" />
          <text>Buscar restaurantes, platos o tiendas</text>
        </view>
      </view>
    </view>
    <view class="container">
      <view class="hot-box">
        <text class="item" v-for="(item,i) in hos_list"  @click="jumpProduct(item)" :key="i">{{item.name}}</text>
      </view>
    </view>
    <view class="container menu-box" >
      <view class="item-box" @click="goSearch(item.glb_name)" v-for="(item,i) in menuList"  :key="i">
        <image :src="item.image" mode=""></image>
        <view class="tit">
          <text>{{item.glb_name}}</text>
        </view>
      </view>
    </view>
    <view class="bannerimg-box">
      <swiper  circular duration="400" interval="2000" autoplay >
        <swiper-item class="swiper-item bannerImg" v-for="(item,index) in bannerData" :key="index">
          <!-- 图片尺寸为 750*250 -->
          <image  :src="item.image" class="loaded swiper-item-image" mode="widthFix"></image>
        </swiper-item>
      </swiper>
    </view>
    <mescroll-body ref="mescrollRef"  :up="upOptions" :down="downOption" @down="downCallback" @up="upCallback">
      <view class="container margin-top sort-box">
        <view class="item-box" v-for="(item,i) in sortList" :key="i">
          <view style="font-size: 20px;" class="tit" :class="{'active': sortIndex == i}">
            <text>{{item.tit}}</text>
          </view>
        </view>
      </view>
      <view class=" store-box" v-if="storeList">
        <view class=" item-box" v-for="(store,i) in storeList" :key="i">
          <view class="container top-box">
            <view class="left ccccccc" @click="toStore(store,null)">
              <image :src="store.image" style="width: 60px!important;height: 60px!important;" mode="aspectFill" lazy-load ></image>
            </view>
            <view class="right" @click="toStore(store,null)">

              <text class="tit" >{{store.name}}</text>
              <view class="row justify-content">
                <view class="row-left">
                  <i class="hxicon-favorfill "></i>
                  <text class="t1">{{store.score}}</text>
                  <text class="t2">Ventas mensuales:{{store.monthly_sales}}</text>
                </view>
                <view class="row-right">
                  <i class="hxicon-locationfill"></i>
                  <text>{{store.distance}}500</text>
                </view>
              </view>
              <view class="row">
                <text >Pedido mínimo:${{store.min_order_amount}}</text>
                <text class="t2" v-if="store.delivery_fee > 0">Entrega:${{store.delivery_fee}} </text>
                <text class="t2" v-else>Entrega gratuita</text>
              </view>
              <!-- <view class="row">

              </view> -->
            </view>
          </view>
          <scroll-view scroll-x  class="bottom-box">
            <view class="bottom-box-container">
              <view class="goods-box" v-for="(goods,j) in store.goods" :key="j" @click="goProduct(goods.id)">
                <view class="img-box">
                  <image  :src="goods.image" mode="scaleToFill" lazy-load ></image>
                  <view class="tag">
                     POP
                  </view>
                </view>
                <view class="tit"  @mouseenter="showFull = true" @mouseleave="showFull = false" style="width: 160px!important;">
                  {{goods.name}}
                  <view v-if="showFull" class="tooltip">{{ text }}</view>
                </view>
                <view class="price-box">
                  <text class="txt1"></text>
                  <text class="txt2">{{goods.real_price}}</text>
                  <text class="txt3">{{goods.price}}</text>
                </view>
              </view>
            </view>

          </scroll-view>
        </view>
      </view>
    </mescroll-body>
    <view class="foot" v-if="showFoot">
      <text>Más tiendas se están incorporando, ¡no te lo pierdas!</text>
    </view>
    <view class="footzw"></view>
  </view>

</template>

<script>
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
var  newthis;

//引入测试数据
import testData from "@/common/testdata.js";
import allrequest, {productHotTag, tag} from "../../common/vmeitime-http/request";
const screenHeight = uni.getSystemInfoSync().screenHeight;
export default {
  mixins: [MescrollMixin],
  components:{
    MescrollBody
  },
  onPageScroll(e){
    let that= this;
   // console.log(e.scrollTop);
    if(e.scrollTop>10){
      let view = uni.createSelectorQuery().select(".search-box");
      view.fields({
        rect: true
      }, res => {
        if(res.top == 0){
          that.GDHEAD = 1;
        }else{
          that.GDHEAD = 0;
        }
      }).exec();
    }

  },
  data() {
    return {
      showFull:false,
      MPPR: 0,
      GDHEAD: 0,
      //显示没有更多商户
      showFoot: 0,
      downOption: {
        auto: true, //是否在初始化后,自动执行downCallback; 默认true
        textLoading: "Actualizando…", //下拉刷新
        textInOffset: "",
        textOutOffset: "",

      },
      upOptions: {
        auto: false,
        page: { num: 1, size: 10 }
      },
      menuList: [
      ],
      sortIndex: 0,
      sortList: [{tit:'Comercios cercanos'}], //附近商家
      //}, {tit:'销量'}, {tit:'速度'}, {tit:'配送费'}
      //filterTagList: [{tit:'支持预定'}, {tit:'销量'}, {tit:'速度'}, {tit:'配送费'}]
      storeList: [],
      pageNum:1,
      bannerData:[
      ],
      hos_list:[

      ],
      isShow:false,
      logoImage:'',
    }
  },
  onShow(){
    let config=uni.getStorageSync('webConfig');
    this.logoImage=config?.site_logo;
  },
  onLoad() {
    let that = this;
    // #ifdef MP
    //小程序下空出胶囊距离
    let m = uni.getMenuButtonBoundingClientRect();
    that.MPPR = m.width + 8
    // #endif
    newthis=this;
    that.getData();
  },
  mounted() {
    let that = this;
  },
  methods: {
    jumpProduct(item){
      uni.navigateTo({
        url: '/pages/product/product?id='+item.products_id
      });
      return;

    },
    goProduct(id){
      uni.navigateTo({
        url: '/pages/product/product?id='+id
      });
      return;

    },
    /*下拉刷新的回调 */
    downCallback(mescroll) {
      let that = this; //下拉刷新
      //that.getDtaa();
      this.pageNum = 1
      this.storeList = []
      // 使用上拉回调拉取第一页数据
      this.upCallback(mescroll)
      this.$refs.mescrollRef.mescroll.endSuccess()
    },
    upCallback(mescroll) {  //滚动刷新
      let that = this;
      Promise.all([
        that.$api.allrequest.shopList({page:that.pageNum})
      ]).then(([shopList]) => {
        let list=shopList.data.data.list;
        const newData = []
        if(list.length>0){
          for (let i = 0; i < list.length; i++){
            newData.push(list[i]);
          }
        }
        that.storeList=that.storeList.concat(newData)
        that.pageNum++
        let hasNext = (this.storeList.length < shopList.data.data.count)
        if (mescroll && typeof mescroll.endSuccess === "function") {
          mescroll.endSuccess(newData.length,hasNext)
        } else if (that.$refs.mescrollRef && typeof that.$refs.mescrollRef.endSuccess === "function") {
          that.$refs.mescrollRef.endSuccess( newData.length,hasNext)
        }
      }).catch(err => {
        uni.hideLoading();
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: 'Error del servidor！'
        });
      });
    },
    toStore(store,goodsID){
      let store_id = store.id
      let parameter = `?sid=${store_id}`

      if(goodsID != null){
        parameter += `&gid=${goodsID}`
      }
      uni.navigateTo({
        url: '/pages/store/index' + parameter
      })
    },
    //搜索
    goSearch(item){
      if(item!=null){
        uni.navigateTo({
          url: '/pages/search/search?value='+item
        })
        return;
      }
      uni.navigateTo({
        url: '/pages/search/search'
      })

    },
    getData(){
      uni.showLoading({
        title: 'Cargando…',  // 文字内容
        mask: true           // 是否显示透明遮罩，防止触摸穿透
      })
      Promise.all([
        newthis.$api.allrequest.tag(),
        newthis.$api.allrequest.bannerList(),
        newthis.$api.allrequest.productHotTag(),
      ]).then(([tag,banner,prodcutTag]) => {
        Object.assign(newthis.menuList,tag.data.data);
        Object.assign(newthis.bannerData,banner.data.data)
        Object.assign(newthis.hos_list,prodcutTag.data.data)
        console.log(newthis.hos_list);
        newthis.isShow=true;
        uni.hideLoading();
      }).catch(err => {
        console.error('请求出错', err);
        uni.hideLoading();
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: 'error！'
        });
      });

    }
  }
}
</script>

<style lang="scss">

page{
  background-color: #f8f8f8;
}
.b-b{
  position: relative;
}
.b-b:after,
.b-t:after {
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  height: 0;
  content: '';
  transform: scaleY(.5);
  border-bottom: 1px solid #E4E7ED;
}

.b-b:after {
  bottom: 0;
}
.b-t:after {
  top: 0;
}
.container{
  margin: 0 15px;
}
.margin-top{
  margin-top: 12px;
}
.head-box{
  padding: 14px 0;
  /* #ifdef MP */
  padding-top:2px;
  /* #endif */
  background: linear-gradient(100deg, #FFEB3B, #FFC107);
  position: relative;
  z-index: 3;
  .navbar{
    position: sticky;
    top: 0;
    height: var(--status-bar-height);
  }

  .container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 32px;
    align-items: center;
    .left{
      .logo{
        width: 32px;
        height: 32px;

        image{
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
      }
    }
    .right{
      display: flex;
      flex-direction: row;
      color: #333333;
      align-items: center;

      .address-box{
        font-size: 14px;
        margin-right: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        text{
          margin-left: 2px;
          margin-right: 4px;
        }
        .icon-right{
          position: relative;
          top: 2px;
        }
      }

      .notice{
        font-weight: bold;
        font-size: 18px;
      }
    }

  }

}
.search-box{
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(100deg, #FFEB3B, #FFC107);
  padding-top: var(--status-bar-height);
  margin-top: calc(var(--status-bar-height) * -1);
  .ctn{
    border-top-left-radius:50upx;
    border-top-right-radius:50upx;
    background: #f8f8f8;
    padding: 15px 15px 12px;

    .hx-search-box{
      border-radius: 40px;
      padding: 0 15px;
      height: 34px;
      display: flex;
      align-items: center;
      line-height: 44rpx;
      background-color: #eeeeee;
      flex:1;
      color: #888888;
      font-size: 14px;
    }
  }
}
.QZBG{
  background:#ffffff;
  box-shadow: 0 1px 6px #ccc;
  .navbar{
    height: var(--status-bar-height);
  }
  .ctn{
    background:#ffffff;
    /* #ifdef MP */
    padding-top:0px;
    /* #endif */
  }
}
.hot-box{

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  .item{
    margin-right: 12px;
    background-color: #EEEEEE;
    color: #666666;
    font-size: 12px;
    border-radius: 20px;
    padding: 2px 6px;
    margin-bottom: 8px;
  }
  .item:last-child{
    margin-right: 0;
  }
}
.bannerimg-box{
  border-bottom-left-radius:10upx;
  border-bottom-right-radius:10upx;
  padding: 24rpx;
  swiper{
    height: 400rpx!important;
    width: 100%;
  }
  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    .swiper-item-image{
      border-radius: 8px;
      height: 100%!important;
      width: 100%;
    }
    image {
      border-radius: 8px;
      height: 100%;
      width: 100%;

    }
  }

}

.menu-box{

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  border-radius: 8px;
  background: #ffffff;
  padding: 12px 8px;
  .item-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    image{
      width: 40px;
      height: 40px;
    }
    .tit{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      margin-top: 6px;
      color: #333333;
      padding: 2px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .active{
      color: #ffffff;
      background-color: #999999;
      border-radius: 60px;
    }
  }
}
.sort-box{
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  .item-box{

    margin-right: 16px;
    .tit{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #333333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .active{
      //color: #111111;
      font-weight: bold;
    }
  }
}
.store-box{
  margin-top: 20px;

  .item-box{
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
    padding-bottom: 18px;
    padding-top: 18px;
    background-color: #ffffff;
    .top-box{
      display: flex;
      flex-direction: row;
      .left{
        margin-right: 10px;


        image{
          width: 72px;
          height: 54px;
          border-radius: 6px;
        }
      }
      .right{
        flex: 1;
        .tit{
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .justify-content{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .row{
          font-size: 12px;
          color: #999999;
          margin-top: 4px;
          .row-left{
            display: flex;
            flex-direction: row;
            .t1,i{
              color: #ffca3e;
            }

          }
          .t2{
            margin-left: 12px;
          }
          .row-right{
            display: flex;
            flex-direction: row;
            i{
              margin-right: 4px;
            }
          }

        }
      }
    }
    .bottom-box{
      &-container{
        margin: 12px 0 0;
        padding-left: 82px;

        white-space: nowrap;
        .goods-box{

          margin-left: 12px;
          display: inline-block;
          .img-box{
            position: relative;
            width: 160px;
            height: 120px;
            background-color: #f1f1f1;
            border-radius: 4px;
            image{
              width: 100%;
              height: 120px;
            }
            .tag{
              position: absolute;
              bottom: 0;
              left: 0;
              background-color: #FF5722;
              color: #ffffff;
              padding: 2px 4px;
              font-size: 12px;
              border-radius: 4px;
            }
          }
          .tit{
            font-size: 14px;
            margin-top: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

          }
          .price-box{
            margin-top: 4px;
            .txt1{
              font-size: 10px;
              color: #FF5722;
            }
            .txt2{
              font-size: 16px;
              color: #FF5722;
            }
            .txt3{
              margin-left: 6px;
              font-size: 10px;
              color: #bbbbbb;
              text-decoration: line-through;
            }
          }
        }
        .goods-box:last-child{
          margin-right: 12px;
        }

      }

    }
  }
  .item-box:last-child{
    border-bottom: 0;
  }
}
.foot{
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 36px;
  margin-bottom: 50px;
  text{
    font-size: 14px;
    position: relative;
    z-index: 2;
    height: 20px;
    line-height: 20px;
    background-color: #f8f8f8;
    color: #cccccc;
    padding: 0 12px;
  }
}
.foot::before{
  content: "";
  z-index: 1;
  display: block;
  position: absolute;
  top: 50%;
  height: 0;
  width: 100%;
  transform: scaleY(0.5);
  border-bottom: 1px solid #E4E7ED;
}
.footzw{
  /* #ifdef H5*/
  height: 50px;
  /* #endif */
}
.tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 99;
  white-space: normal;
  background-color: #333;
  color: #fff;
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
  line-height: 1.5;
  width: max-content;
  max-width: 400rpx;
}
</style>
