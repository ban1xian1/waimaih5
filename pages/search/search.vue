<template>
  <view v-if="isShow" class="seach_class">
    <view class="search-box" :class="{'QZBG':GDHEAD}" :style="GDHEAD ? 'padding-right: ' + MPPR + 'px' : ''">
      <view class="navbar" ></view>
      <view class="ctn">
        <i class="hxicon-back ctn_fist" @click="jump_index()"></i>
        <view class="hx-search-box" style="width: 100%">
          <input  style="width: 100%" v-model="keyword"
                  placeholder="Buscar restaurantes, platos o tiendas"
                  type="text"
                  @input="onInput"
          />
          <uni-icons type="search" size="22" color="#666666" />
        </view>
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

    <view class=" store-box" v-if="storeList">
        <view class=" item-box" v-for="(store,i) in storeList" :key="i">
          <view class="container top-box">
            <view class="left ccccccc" @click="toStore(store,null)">
              <image :src="store.image" mode="aspectFill"></image>
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
            </view>
          </view>
        </view>
      </view>
    <view class="wrap" v-if="goodsList.length">
      <view class="grid">
        <view class="card" v-for="item in goodsList" :key="item.id" @click="jump_product(item.id)">
          <image class="thumb" :src="item.image" mode="aspectFill" />
          <text class="title">{{ item.name }}</text>
          <text class="title" style="color: red">{{ item.real_price }}</text>
        </view>
      </view>
    </view>
    <view class="nullOrder" v-if="goodsList.length === 0 && storeList.length===0 ">
      <image src="../../static/img/order_icon.png" mode=""></image>
      <text class="tit">No hay pedidos</text>

    </view>
  </view>


</template>

<script>


//引入测试数据
import {productSearch} from "../../common/vmeitime-http/request";

const screenHeight = uni.getSystemInfoSync().screenHeight;
export default {
  onPageScroll(e){
    let that= this;
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
    uni.createSelectorQuery().select('.seach_class') // 你的页面最外层容器
        .boundingClientRect(rect => {
          uni.getSystemInfo({
            success: info => {
              const windowHeight = info.windowHeight; // 屏幕可视区域高度
              const pageHeight = rect.height;         // 页面总高度
              const distanceToBottom = pageHeight - e.scrollTop - windowHeight;
              if (distanceToBottom < 300 && that.apigoing===false) {
                that.page=that.page+1;
                that.searchGoods(that.keyword);
              }
            }
          });
        })
        .exec();
  },
  data() {
    return {
      swiperCurrent: 0,
      transtionTime:100,
      swiperCurrentSliderLeft: 0,
      tabs: [
        {name:'Shop' },
        {name:'Products'},
      ],
      keyword:'',
      MPPR: 0,
      GDHEAD: 0,
      //显示没有更多商户
      showFoot: 0,
      sortIndex: 0,
      storeList: [],
      page:1,
      page_num:20,
      all_num:20,
      isShow:false,
      goodsList: [

      ],
      apigoing:false,
    }
  },
  onLoad(op) {
    if(op.value){
      this.keyword=op.value;
    }
    // #ifdef MP
    //小程序下空出胶囊距离
    let m = uni.getMenuButtonBoundingClientRect();
    that.MPPR = m.width + 8
    // #endif
  },
  onShow(){
    this.isShow=true;
    if(this.keyword!=''){
      this.page=1;
      this.goodsList=[];
      this.storeList=[];
      this.searchGoods(this.keyword);
    }
  },
  mounted() {
  },
  methods: {
    swiperChange(index) {
      this.swiperCurrentSliderLeft= (100/this.tabs.length) * index;
      this.page=1;
      this.sortIndex=index;
      this.goodsList=[];
      this.storeList=[];
      this.apigoing=false;
      this.searchGoods(this.keyword)
    },
    onInput(){
      clearTimeout(this.timer)
      let that=this;
      this.page=1;
      this.goodsList=[];
      this.storeList=[];
      this.apigoing=false;
      this.timer = setTimeout(() => {
        this.searchGoods(that.keyword);
      }, 1000) // 400ms 延迟
    },
    searchGoods(keyword) {
      if (!keyword) return
      if(this.apigoing===true){
        return;
      }
      uni.showLoading({
        title: 'Cargando…',  // 文字内容
        mask: true           // 是否显示透明遮罩，防止触摸穿透
      })
      this.apigoing=true;
      if(this.sortIndex==0){
        this.getshopList();
        return;
      }
      this.getProductList();
    },
    getProductList(){
      let that=this;
      Promise.all([
        that.$api.allrequest.productSearch({keyword:that.keyword,page:that.page}),
      ]).then(([product]) => {
        that.all_num=product.data.data.count;
        console.log(product.data.data.list);
        let list=product.data.data.list;
        if(list.length>0){
          console.log(list.length);
          for (let i=0;i<list.length;i++){
            console.log(product.data.data);
            that.goodsList.push(list[i])
          }
          that.apigoing=false
        }
        uni.hideLoading();
      }).catch(err => {
        console.error('请求出错', err);
        uni.hideLoading();
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: 'error！'
        });
        that.apigoing=false
      });
    },
    getshopList(){
      let that=this;
      Promise.all([
        that.$api.allrequest.shopSearch({keyword:that.keyword}),
      ]).then(([shop]) => {
        this.storeList=shop.data.data.list;
        uni.hideLoading();
      }).catch(err => {
        console.error('请求出错', err);
        uni.hideLoading();
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: 'error！'
        });
        that.apigoing=false
      });
    },
    /*下拉刷新的回调 */
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
    jump_index(){
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    jump_product(id){
      uni.navigateTo({
        url: '/pages/product/product?id='+id
      })
    },
    getDtaa(){
      newthis.isShow=true;
      return;
      uni.showLoading({
        title: 'Cargando…',  // 文字内容
        mask: true           // 是否显示透明遮罩，防止触摸穿透
      })


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
  //background: linear-gradient(100deg, #FFEB3B, #FFC107);
  padding-top: var(--status-bar-height);
  margin-top: calc(var(--status-bar-height) * -1);
  .ctn{
    border-top-left-radius:50upx;
    border-top-right-radius:50upx;
    background: #f8f8f8;
    padding: 15px 15px 12px 5px;
    display: flex;
    .ctn_fist{
      line-height: 34px;
      font-size: 22px;
      color: #aca7a7;
    }
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
      margin-left: 5px;
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
          width: 80px;
          margin-left: 12px;
          display: inline-block;
          .img-box{
            position: relative;
            width: 80px;
            height: 60px;
            background-color: #f1f1f1;
            border-radius: 4px;
            image{
              width: 100%;
              height: 60px;
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
.wrap {
  padding: 12px;
  box-sizing: border-box;
}
/* 网格：一行两个 */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px; /* 卡片间距 */
}

/* 单个卡片 */
.card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  /* 手指触感（可选） */
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  padding-bottom: 8px;
}

/* 图片 - 固定宽高比（1:1） */
.thumb {
  width: 100%;
  height: auto;
  padding-top: 100%; /* 1:1 比例盒子 */
  display: block;
  object-fit: cover; /* aspectFill 效果 */
}

/* 这里我们使用绝对定位把图片放入比例盒（uni-app Image 在 padding 技巧里不生效时可直接指定高度） */
.thumb {
  position: relative;
  padding-top: 0; /* 取消上面的 padding-top，使用高度替代（uni-app 更好兼容） */
  height: 140px; /* 你可以调整为 vw/％ 或者 media query 以适配不同屏幕 */
}

/* 名称 */
.title {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #333;
  margin: 8px 8px 0 8px;
  line-height: 1.2;
  text-align: left;
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
</style>
