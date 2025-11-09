<template>
  <view class="hx-store" @touchstart="touchStart" v-if="isShow">
    <hx-navbar
        :fixed="true"
        :color="['#ffffff','#888888']"
        barPlaceholder="hidden"
        transparent="auto"
        :back="false"
        :rightSlot="false"
        :background-color="[245,245,245]"
        :pageScroll.sync="pageScroll">
      <block slot="left">
        <view class="" style="margin-left: 6px; font-size: 22px;" @click="navBack">
          <i class="hxicon-back"></i>
        </view>

      </block>
      <view class="ctn">

        <view class="leftBox" style="font-size: 22px;">
          <i class="hxicon-favor" @click=""></i>
          <i class="hxicon-more"></i>

        </view>
        <view class="jrNull"></view>
      </view>
    </hx-navbar>



    <!-- 只需要绑定购物车位置即可 -->
    <flyInCart ref="inCart" :cartBasketRect="cartBasketRect"></flyInCart>
    <!-- 头部 -->
    <view class="header">
      <image class="header-bg" style="height: 220px;" :src="storeData.tg_image" mode=""></image>
      <view :class="showStoreBox ? 'header-bg-gray' : 'header-bg-black'"></view>
      <view class="header-top-Placeholder" ></view>
      <view class="container storeInfo hx-shadow" :style="{height:storeInfoBoxHeight + 'px'}">
        <image class="storeAvatar hx-shadow" :src="storeData.image" mode=""></image>
        <view class="hx-txt-18 hx-color-black hx-txt-weigth hx-mb-10 hidden-name">
          {{storeData.name}}
        </view>
        <view class="hx-txt-14 hx-color-black ">
         {{storeData.description}}
        </view>
        <!-- <view class="">
          后续再扩展优惠券，满减，折扣，活动等功能
        </view> -->
        <view class="shrink-box">
          <i class="hxicon" :class="showStoreBox ? 'icon-fold' : 'icon-unfold'" @click="showStoreBox = !showStoreBox"></i>
        </view>
      </view>
    </view>



    <!-- 主体 -->
    <view class="main" :style="{height: mainHeight}" >
      <!-- <view class="" :style="{display:showZz}" style="position: absolute;top: 0;bottom: 0;left: 0;width: 100%; background: #3F536E;z-index: 999;opacity: 0.5;">
        遮罩
      </view> -->
      <view class="tabs-box" :style="{'top': 'calc(44px + ' + statusBarHeight + 'px)','background-color':'rgba(245,245,245,'+ navSearchBgOpacity +')'}">
        <view class="" style="width: 210px; height: 100%;">

          <view class="hx-tabs">
            <view class="hx-tabs-item" v-for="(item,i) in tabs" :key="i" :class="{'hx-tabs-active': swiperCurrent == i}" @click="swiperChange(i)" :style="{transition: transtionTime + 'ms'}">
              <text>{{item.name}}</text>
            </view>
            <view class="hx-tabs-slider-box" :style="{transition: transtionTime + 'ms',left:swiperCurrentSliderLeft + 'px'}">
              <view class="hx-tabs-slider"></view>
            </view>
          </view>
        </view>
      </view>
      <swiper
          id="mainSwiper"
          style="height: 100%;"
          :current="swiperCurrent"
          :duration="transtionTime"
          @transition="transition"
          @animationfinish="animationfinish">
        <!-- 购物 -->
        <swiper-item class="swiper-item" >

          <view class="scroll-items">

            <view class="category-list">
              <!-- 左侧分类导航 -->
              <scroll-view  :scroll-top="menuScrollTop" :scroll-y="goodsBoxScroll" class="left" >

                <view v-for="item in categoryList" :key="item.id" class="row" :class="{active: item.id == menuCurrentId}" @click="showCategory(item)">
                  <view class="text">
                    {{item.name}}
                  </view>
                  <view class="row-number" v-if="item.number">
                    {{item.number}}
                  </view>
                </view>
              </scroll-view>
              <!-- 右侧子导航 -->
              <scroll-view scroll-with-animation :scroll-y="goodsBoxScroll" class="right"  @scroll="asideScroll" :scroll-top="tabScrollTop" >
                <view class="goodsListBox">


                  <view class="category" v-for="item in categoryList" :key="item.id" :id="'goodsBox'+item.id" >
                    <view class="s-item">{{item.name}}</view>
                    <view class="list"  >
                      <view class="box" v-for="(rowData,i) in goodsList" :key="rowData.id" v-if="check_product(item.id,rowData)">
                        <!-- 商品列表 -->
                        <!-- <m-store-pro @touchOnGoods="touchOnGoods" :rowData="box"></m-store-pro>
                         -->
                        <!-- 商品列表 -->
                        <view class="m-store-item">
                          <view class="m-img" @click="hrefGoodsInfo(rowData.id)">
                            <image lazy-load style="width: 100%;height: 100%;" :src="rowData.image" mode="aspectFit"></image>
                          </view>
                          <view class="m-text">
                            <view class="m-title text-ellipsis"   @click="hrefGoodsInfo(rowData.id)">
                              {{rowData.name}}
                            </view>

                            <view class="m-descripe" v-if="1==2">
                              {{rowData.jy_describe}}
                            </view>
                            <block v-if="rowData.form">
                              <view class="m-price-box">
                                <view class="symbol"></view>
                                <view class="m-price">{{rowData.form_child[0].price}}</view>
                                <view class="m-old-price" v-if="rowData.form_child[0].oldprice">
                                  <text>{{rowData.form_child[0].oldprice}}</text>
                                </view>
                              </view>
                            </block>
                            <block v-else>
                              <view class="m-price-box">
                                <view class="symbol"></view>
                                <view class="m-price">{{rowData.real_price}}</view>
                                <view class="m-old-price" v-if="rowData.price">
                                  <text>{{rowData.price}}</text>
                                </view>
                              </view>
                            </block>
                            <view class="m-distance" >
                              <block v-if="rowData.form">
                                <view class="miniBtn" @click="showForm(rowData)">
                                  <text>选规格</text>
                                  <!-- #ifdef APP-PLUS || H5 -->
                                  <view class="num" v-if="getCartGoodsNum(rowData)">{{getCartGoodsNum(rowData)}}</view>
                                  <!-- #endif -->
                                </view>
                              </block>
                              <block v-else>
                                <view :class="'addEle_' + i" class="jumpPosition"></view>
                                <hx-number-box  :value="rowData.number" :rowData="rowData" :clickTime="animaTime"  @lessChange="delChange"  @addChange="touchOnAddGoods('.addEle_' + i,rowData)"></hx-number-box>
                              </block>
                              <!-- <image @click="touchOnAddGoods('.addEle_' + i,rowData)" style="width:20px;height: 20px;" src="../../static/img/icon/shop_icon_buy.png" mode="aspectFit"></image>
                             -->
                            </view>
                          </view>

                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>

        </swiper-item>

        <!-- 评价 -->
        <swiper-item class="swiper-item" >
          <scroll-view scroll-y style="height: 100%;width: 100%;background-color: #ffffff;" @scroll="asideScroll" :scroll-y="goodsBoxScroll" >
            <view class="scroll-items evaluate-box" >
              <view class="evaluate-box-header">

              </view>
              <view class="evaluate-box-body">

              </view>
              <hx-comment :shop="storeData"   :score="storeData.score" :listData="commentList"></hx-comment>
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 商家 -->
        <swiper-item class="swiper-item" >
          <view class="scroll-items business-box">
            <view class="info-list hx-mt-15">
              <view class="info-list-container">
                <i class="hxicon-location"></i>
                <text>{{ storeData.address }}</text>
              </view>
            </view>

            <view class="info-list hx-mt-15 ">
              <view class="info-list-container hx-bb">
                <i class="hxicon-time"></i>
<!--                配送时间-->
                <text>Tiempo de entrega：{{ storeData.delivery_time }}minutos</text>
              </view>
            </view>
            <view class=" info-list">
              <view class="info-list-container" @click="goCall(storeData.telephone)">
                <i class="hxicon-phone"></i>
                <text style="flex: 1;">Teléfono del negocio:：{{ storeData.phone }}</text>
                <view class="right">
                  <text>Llamar</text><i class="hxicon-right"></i>
                </view>
              </view>
            </view>
            <view class="info-list hx-mt-15">
              <view class="info-list-container" @click="showStoreBoxFunc">
                <i class="hxicon-new" style="color:#ff3333"></i>
                <text style="flex: 1;">Promociones actuales del negocio</text>
                <view class="right">
                  <text>Ver detalles</text><i class="hxicon-right"></i>
                </view>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 购物车 -->
    <view class="foot"  @touchmove.stop.prevent="mpClear" :style="{height: footHeight}" v-if="showFoot">
      <view class="zz" @click="hideShoppingCar"></view>
      <view class="btn-box">
        <view class="btn-box-left" @click="contact">
          <view class="imgBox">
            <image src="../../static/store/contact.png" mode=""></image>
          </view>
          <text>Tienda</text>
        </view>
        <view class="btn-box-line"></view>
        <view class="btn-box-center" @click="showShoppingCar">
          <view class="cart" :animation="cartAnimationData">
            <view class="tag cartNum" v-if="goodsTotalNumber>0">{{goodsTotalNumber}}</view>
            <image :src="goodsTotalNumber ? '/static/store/cart.png' : '/static/store/cart2.png'" mode=""></image>
          </view>
          <view class="priceBox">
            <view class="hx-txt-18 hx-color-white" v-if="goodsTotalPrice>0">
              {{goodsTotalPrice}}
            </view>
            <view class="hx-txt-10 hx-color-gray">
              Costo de entrega:{{ storeData.delivery_fee}}
            </view>
          </view>
        </view>
        <view class="btn-box-right">
          <view class="jiesuan"  v-if="goodsTotalPrice>0 && goodsTotalPrice >= startingPrice" @click="jiesuan">
            Pagar ahora
          </view>
          <view class="pscj hx-txt-10 hx-color-gray" v-else>
            <text v-if="startingPrice>0">差￥{{-(goodsTotalPrice-startingPrice)}}起送</text>
          </view>

        </view>
      </view>
<!--      购物车-->
      <view class="cart-box" :style="{display: showCar ? 'flex' : 'none'}">
        <view class="box-container rebate-box" v-if="showDiscount">
          <text></text>
        </view>
        <view class="box-container operating-box">
          <view class="operating-box_right">

          </view>
          <view class="operating-box_left clear" @click="clearShoppingCart">
            <i class="hxicon-delete"></i>
            <text>Vaciar el carrito</text>
          </view>
        </view>
        <view class=" goods-box">
          <view class="" style="flex: 1;">
            <scroll-view scroll-y="true" class="goods-list-scroll" :scroll-top="carGoodsScrollTop">
              <view class="goods-list">
                <view class="box" v-for="(rowData,i) in shoppCart" :key="rowData.id" v-if="rowData.num>0">

                  <view class="m-store-item">
                    <view class="m-img">
                      <image style="width: 100%;height: 100%;" :src="getProductInfo(rowData,1)" mode="aspectFit"></image>
                    </view>
                    <view class="m-text">
                      <view class="m-title">
                        {{getProductInfo(rowData,2)}}
                      </view>
                      <view class="m-descripe">
                        {{getProductInfo(rowData,5)}}
                      </view>
                      <view class="m-price-box" >
                        <view class="symbol"></view>
                        <view class="m-price">  {{getProductInfo(rowData,3)}}</view>
                        <view class="m-old-price" v-if="getProductInfo(rowData,4)">
                          <text>{{getProductInfo(rowData,4)}}</text>
                        </view>
                      </view>
                      <view class="m-distance" >
                        <view :class="'addEle2_' + rowData.id" class="jumpPosition">
                        </view>
                        <hx-number-box   :value="rowData.num" :rowData="getProductInfo(rowData,6)" :clickTime="animaTime"  @lessChange="delChange"   @addChange="touchOnAddGoods('.addEle2_' + rowData.id,getProductInfo(rowData,6))"></hx-number-box>

                      </view>
                    </view>

                  </view>
                </view>
              </view>
            </scroll-view>
          </view>

        </view>
      </view>

    </view>


  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import hxNavbar from '@/components/hx-navbar/hx-navbar.vue';
import jumpBall from '@/components/hx-jump-ball/hx-jump-ball.vue';
import hxNumberBox from "@/components/uni-number-box/uni-number-box.vue";
import hxComment from "@/components/hx-comment/hx-comment.vue";
//  加入购物车动画组件
import flyInCart from '@/components/flyInCart.vue'
//引入测试数据
import testData from "@/common/testdata.js";
import {shopDetalles} from "../../common/vmeitime-http/request";

var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
import {
  mapState
} from 'vuex';
import {cartAdd, cartDelAll, cartList} from "../../common/vmeitime-http/user";
export default {
  components: {
    jumpBall,
    hxNavbar,
    uniIcons,
    hxNumberBox,
    hxComment,
    flyInCart
  },
  computed: {
    ...mapState(['hasLogin','userData'])
  },
  data() {
    return {
      isShow:false,
      pageScroll:{},
      //商家信息
      storeData: [],
      //商品列表
      goodsList: [],
      //商品分类信息列表
      categoryList: [],
      //评论列表
      commentList: [],
      navSearchWidth: 3,
      navSearchBgOpacity: 0,
      navSearchColor: '#ffffff',
      navHeadHeight: 44,
      //默认禁止商品栏滚动
      goodsBoxScroll: false,
      statusBarHeight,
      //动画时间
      animaTime: 300,
      //商家盒子高度
      storeInfoBoxHeight: 100,
      //展开门店信息容器
      showStoreBox: false,

      num:1,
      element: [],
      cartAnimation: {},
      cartAnimationData: {},

      //tabs
      tabs: [
        {name:'Comprar'}, //购物
        {name:'Valorar'}, //评价
        {name:'Tienda'}, //商家信息
      ],
      swiperCurrent: 0,
      dx: 0,
      swiperCurrentSliderLeft: 0,
      transtionTime:100,

      //所有购物车
      shoppingCartAll:[],
      //显示购物车
      showFoot:true,

      //配送费
      shippingDees: 0,
      //配送起步价
      startingPrice:0,

      //购物车商品价格合计
      goodsTotalPrice: 0,
      //购物车商品数量合计
      goodsTotalNumber: 0,
      //当前门店购物车
      shoppCart: [],
      //foot 高度
      footHeight: '0',
      //显示购物车
      showCar: false,
      //购物车中商品滚动条位置
      carGoodsScrollTop: 0,
      //购物车缓存 Storage 名称
      shoppingCartStorageName: 'shopping_cart',
      sizeCalcState: false,
      tabScrollTop: 0,
      mainHeight: 0,
      menuCurrentId:1,
      //购物车显示折扣
      showDiscount:true,
      //手指触摸滑动
      touchData:{},
      //页面滚动条距离顶部的距离
      pageScrollTop: 0,

      menuScrollTop: 0,

      //多规格当前产品
      currentGoodsData: {},
      //显示规格容器
      showFormBox: false,
      //显示规格动画
      formAnimationData:{},

      //购物车位置数据
      cartBasketRect:{},

      navStatus: true,
      isBack:true,
      get_id:0,
    }
  },
  async onLoad(option) {
    const that = this;
    let id=option.sid||0;
    this.get_id=id;
  },
  onReady() {
    const that = this
    let sysInfo = uni.getSystemInfoSync();
    //屏幕高度 - 头部导航高度 - 状态栏高度 - 分页高度
    this.mainHeight = sysInfo.screenHeight - 43 - statusBarHeight - 40  + 'px';
    let q = uni.createSelectorQuery()
    setTimeout(function(){
      q.select('.cart').boundingClientRect(data => {
        that.cartBasketRect = data
      }).exec();
    },100)
    that.calcSize();
  },
  onBackPress(event) {
    if(this.showFormBox){
      this.hiddenForm()
      return true
    }
    if(!this.isBack){
      this.$refs.popup.close()
      return true
    }

  },
  onShow() {
    const that = this;
    let id=this.get_id;
    uni.showLoading({
      title: 'Cargando...'
    });
    that.$api.allrequest.shopDetalles({id:id}).then(function (data){
      let code=data.data.code;
      if(code!=1){
        uni.showToast({
          title: data.data.msg,
          icon: 'error',  // 可选: success / loading / none
          duration: 2000
        })
        setTimeout(function (){
          that.goBackOrHome();
        },2000)
        return;
      }
      let lsits=data.data.data;
      //设置店铺分类
      that.categoryList=lsits.categories;
      //设置商家信息
      that.storeData=lsits.detalles;
      that.storeData.score=Number(that.storeData.score);
      //设置商品
      that.goodsList=lsits.product;
      uni.hideLoading();
      that.isShow=true;
      that.init();
      //评论列表
    //  that.commentList = testData.commentData;
      that.commentList=[];
    }).catch(function (err){
      uni.hideLoading();
      console.log(err);
    })
  },
  mounted() {
    let that = this
  },
  watch:{
    showStoreBox(val,oldVal){
      if(val == true){

        this.showStoreBoxFunc();
      }else{
        this.hiddenStoreBoxFunc();
      }
    }
  },
  onPageScroll(e) {
    let that = this
    let top = e.scrollTop
    that.pageScrollTop = e.scrollTop
    that.pageScroll = e
    if(top < 120){
      if(that.navSearchWidth >= 3){
        if(top<3){
          that.navSearchWidth = 3
          that.navSearchBgOpacity = 0
          that.navSearchColor = '#ffffff'
        }else{
          let n = top * (120/100)
          if(n > 100){
            n = 100
          }
          that.navSearchWidth = n
          //that.navSearchBgOpacity =1
          that.navSearchBgOpacity = top * (1/100)
          that.navSearchColor = '#888888'
        }
      }
    }else{
      that.navSearchWidth = 100
      that.navSearchBgOpacity = 1
      that.navSearchColor = '#888888'
    }
    let view = uni.createSelectorQuery().select(".main");
    view.fields({
      rect: true
    }, data => {
      if(data != null){
        if(data.top <= statusBarHeight+44){
          that.goodsBoxScroll = true
        }else{
          that.goodsBoxScroll = false
        }
      }

    }).exec();
  },
  methods: {
    check_product(id,rowData){ //判断商品是否在分类
      console.log(id,rowData);
      let check=false;
      for (let i=0;i<rowData.ategories_id_array.length;i++){
        if(rowData.ategories_id_array[i]==id){
          check=true;
          break;
        }
      }
      return check;
    },
    getProductInfo(data,type){
      for (let i in this.goodsList){
        if(data.product_id==this.goodsList[i].id){
            if(type===1){
              return this.goodsList[i].image;
            }
          if(type===2){
            return this.goodsList[i].name;
          }
          if(type===3){
            return this.goodsList[i].real_price;
          }
          if(type===4){
            return this.goodsList[i].price;
          }
          if(type===5){
            return this.goodsList[i].jy_describe;
          }
          if(type===6){
            return this.goodsList[i];
          }

        }
      }
      return  '';
    },
    goBackOrHome(){
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack({ delta: 1 })
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    init(){
      if(!this.hasLogin){
        return; //没有登录就不去获取购物车信息
      }
      let that = this;
      that.shoppCart=[];
      that.goodsTotalPrice = 0;
      that.goodsTotalNumber = 0;
      //假设这是从后台获取的商品数据
      let goods = this.goodsList;
      that.$api.user.cartList().then(function (e){
       let lists=e.data.data;
        if(lists.length===0){
          return;
        }
        for (let i in lists){
          if(lists[i].shop_id==that.storeData.id){
            that.shoppCart.push(lists[i]);
          }
        }
        for(let i in that.shoppCart){
          for(let j in goods){
            if(goods[j].id === that.shoppCart[i].product_id){
              goods[j].number = that.shoppCart[i].num;
              that.shoppCart[i].total= goods[j].number*parseFloat(goods[j].real_price)
            }
          }
          //计算商品总价
          that.goodsTotalPrice += that.shoppCart[i].total
          //商品总数量
          that.goodsTotalNumber += that.shoppCart[i].num
        }
        that.goodsList = goods;
       // that.starting_price = that.storeData.starting_price;
       // that.shipping_dees = that.storeData.shipping_dees;

        that.setLabelNumber();
        return true;
      }).catch(function (e){
        console.log(e);
        return true;
      })
      return true;
    },
    //购物车修改后
    afterChangeCar(lists){
      if(!this.hasLogin){
        return; //没有登录就不去获取购物车信息
      }
      console.log(lists);
      let that = this;
      that.shoppCart=[];
      for (let i in lists){
        if(lists[i].shop_id==that.storeData.id){
          that.shoppCart.push(lists[i]);
        }
      }
      that.goodsTotalPrice = 0;
      that.goodsTotalNumber = 0;
      //假设这是从后台获取的商品数据
      let goods = this.goodsList;
      for (let j in goods){
        goods[j].number =0;
        for (let i in that.shoppCart){
          if(goods[j].id === that.shoppCart[i].product_id){
            goods[j].number = that.shoppCart[i].num;
            that.shoppCart[i].total= goods[j].number*parseFloat(goods[j].real_price);
            that.goodsTotalPrice += that.shoppCart[i].total
            //商品总数量
            that.goodsTotalNumber += that.shoppCart[i].num
          }
        }
      }
      this.goodsList=goods;
      that.setLabelNumber();

    },
    navBack(){
      if(getCurrentPages().length>1){
        uni.navigateBack();
      }else{
        // #ifdef H5
        this.goBackOrHome();
        // #endif
        // #ifndef H5
        uni.reLaunch({
          url: '/pages/index/index'
        });
        // #endif
      }
    },
    popupChange(e){
      this.isBack = !e.show
    },
    //-----------------------------------------------------------------------------------
    //显示 规格
    showForm(goods){
      var that = this;
      let goodsCart = that.getStoreCart();

      if(goodsCart){
        let currentGoods = null
        for(let i in goodsCart){
          if(goodsCart[i].id == goods.id){
            currentGoods = goodsCart[i]
            break
          }
        }
        if(currentGoods){
          let selectStatus = false
          for (let i in goods.form_child){
            if(goods.form_child[i].id == currentGoods.current_form.id){
              if(!selectStatus){
                goods.form_child[i].select = true
                goods.number = currentGoods.number
                selectStatus = true
              }else{
                goods.form_child[i].select = false
              }
            }else{
              goods.form_child[i].select = false
            }
          }
        }

      }
      that.currentGoodsData = goods
      that.$refs.popup.open()
    },
    //隐藏规格
    hiddenForm(){
      this.$refs.popup.close();
    },
    formFirstAddGoods(){
      let that = this

      that.formAddGoodsChange(1,that.currentGoodsData)
      that.touchOnAddGoods('#ggAddBtn',that.currentGoodsData)
    },
    //加入购物车
    formAddGoodsChange(number,goodsData){
      let that = this;
      if(number >= 1){
        for(let i in goodsData.form_child){
          if(goodsData.form_child[i].select == true ){
            that.currentGoodsData.current_form = goodsData.form_child[i]
            break
          }
        }
      }
      that.addGoodsChange(number,that.currentGoodsData)
    },
    //选择规格
    selectGoodsForm(goods,formChild){
      let that = this
      let data = goods.form_child
      let n = 0
      for (var i in data){
        if(data[i].id == formChild.id){
          data[i].select = true
        }else{
          data[i].select = false
        }
      }
      let goodsCart = that.getStoreCart();
      if(goodsCart){
        for(let i in goodsCart){
          if(goodsCart[i].id == goods.id && goodsCart[i].current_form.id == formChild.id){
            n = goodsCart[i].number
            break;
          }
        }
      }

      goods.number = n
      this.currentGoodsData = goods
    },

    //获取该商品在购物车的数量
    getCartGoodsNum(goods){
      let cart = this.getStoreCart()
      let n = 0
      if(cart){
        for(let i in cart){
          if(cart[i].id == goods.id){
            n += cart[i].number
          }
        }
      }
      return n
    },
    //-----------------------------------------------------------------------------------
    //获取门店购物车
    getStoreCart(){
      const that = this
      return that.shoppCart
    },
    //---------------------------------------------------------------------------------
    swiperChange(index) {
      this.swiperCurrent = index;
      this.swiperCurrentSliderLeft= 70 * index;
    },
    transition({ detail: { dx } }) {
      // this.$refs.tabs.setDx(dx);
    },
    animationfinish({detail: { current }}) {
      /* this.$refs.tabs.setFinishCurrent(current); */
      this.swiperCurrent = current;
      this.current = current;
      this.swiperChange(current);
      this.showFoot = current == 0 && this.showStoreBox != true ? true : false;
    },

    //一级分类点击
    showCategory(item){
      const that = this
      that.isBoxScroll = true;
      that.menuCurrentId = item.id;
      setTimeout(()=>{
        let index = that.categoryList.findIndex(sitem=>sitem.id === item.id);
        that.tabScrollTop = that.categoryList[index].top;
        that.isBoxScroll = false
      },100)

    },
    //右侧栏滚动
    asideScroll(e){
      const that = this;
      const scrollTop = Math.round(e.detail.scrollTop);
      that.calcSize()
      const tabs = that.categoryList.filter(item=>item.top <= scrollTop).reverse();

      if(tabs.length > 0){
        that.menuCurrentId = tabs[0].id;
      }
      const menuNum = that.categoryList.length
      const cNum = tabs.length
      // 定位在第4个分类，当分类滑动到第4格时将不再变换位置。
      const n = 4
      if(cNum>n){
        that.menuScrollTop = (cNum - n) * 45
      }else{
        that.menuScrollTop = 0
      }
    },
    //计算右侧栏每个tab的高度等信息
    calcSize(event){
      let h = 0;
      this.categoryList.forEach(item=>{
        let view = uni.createSelectorQuery().select("#goodsBox" + item.id);
        view.fields({
          size: true
        }, data => {
          if(data != null){
            item.top = h;
            h += Math.round(data.height);
            item.bottom = h;
          }
        }).exec();
      })
      this.sizeCalcState = true;
    },
    //小球跳跃动画
    delChange(number,data){
      let sendDate={
        shop_id:data.shop_id,
        id:data.id
      }
      const that = this;
      that.$api.user.cartDel(sendDate).then(function (res){
        if(res.data.code != '1'){
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: res.data.msg
          });
          return;
        }
        that.afterChangeCar(res.data.data);
      }).catch(function (e){
        console.log(e);
      })
    },
    touchOnAddGoods(ele,data){
      if(!this.hasLogin){
        uni.reLaunch({
          url: '/pages/user/login/login'
        });
        return;
      }
      let sendDate={
        shop_id:data.shop_id,
        id:data.id
      }
      const that = this;
      let q = uni.createSelectorQuery()
      that.$api.user.cartAdd(sendDate).then(function (res){
        if(res.data.code != '1'){
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: res.data.msg
          });
          return;
        }
        q.select(ele).boundingClientRect(res => {
          that.$refs.inCart.addToCart(res,data.id);
        }).exec();
        that.afterChangeCar(res.data.data);
      }).catch(function (e){
        console.log(e);
      })
    },
    //新增商品计算价格
    //计算每类商品购买的总数
    setLabelNumber(){
      let that = this;
      //计算每一类购买商品的总数量
      for(let j in that.categoryList){
        let n = 0;
        for(var i in that.shoppCart){
          if(that.shoppCart[i].categories_id ==  that.categoryList[j].id){
            n += that.shoppCart[i].num;
          }
        }
        that.categoryList[j].number = n;
      }
    },

    //去结算
    jiesuan(){
      if(!this.hasLogin){
        uni.reLaunch({
          url: '/pages/user/login/login'
        });
        return;
      }
      this.navTo("/pages/order/preview?sid=" + this.storeData.id)

    },
    navTo(url){
      let that = this;
      if(that.navStatus){
        that.navStatus = false
        uni.navigateTo({
          url: url,
          complete:function(){
            that.navStatus = true
          }
        })
      }
    },
    //联系商家
    contact(){
      uni.showModal({
        title: '', //提示
        content: 'Contact the mall manager to get the recharge method', //服务器错误
        confirmColor: '#3CC51F',
        confirmText:'Confirmar',
        showCancel: false,
        success: function (msg) {
          if (msg.confirm) {

          }
        }
      });
    },

    showStoreBoxFunc(){
return false;
      this.storeInfoBoxHeight = uni.getSystemInfoSync().screenHeight-136;
      this.$set(this.$data,'showFoot',false);
      this.showStoreBox = true;
      uni.pageScrollTo({
        duration:0,
        scrollTop:0
      })
    },
    hiddenStoreBoxFunc(){
      this.storeInfoBoxHeight = 100;
      this.showStoreBox = false;
      if(this.swiperCurrent == 0){
        this.$set(this.$data,'showFoot',true);
      }
    },

    mpClear(e) {
      // TODO nvue 取消冒泡
      e.stopPropagation()
    },

    //显示购物车
    showShoppingCar(){
      if(this.goodsTotalNumber == 0){
        return;
      }
      this.footHeight = '100%';
      this.showCar = true;
      console.log(this.shoppCart);
      this.carGoodsScrollTop = 0;
    },
    //隐藏购物车
    hideShoppingCar(){
      this.footHeight = '0';
      this.showCar = false;
    },
    //清空该门店的购物车
    clearShoppingCart(){
      const that = this;
      that.$api.user.cartDelAll().then(function (res){
        if(res.data.code != '1'){
          uni.showToast({
            icon: 'none',
            position: 'bottom',
            title: res.data.msg
          });
          return;
        }
        that.afterChangeCar(res.data.data);
        that.hideShoppingCar();
      }).catch(function (e){
        console.log(e);
        that.hideShoppingCar();
      })

    },
    hrefGoodsInfo(id){
      this.navTo('/pages/product/product?id=' + id)
    },
    //拨打电话
    goCall(phone){
      return; false;
      if(!phone){
        return;
      }
      uni.makePhoneCall({
        phoneNumber: phone //仅为示例
      });
    },

    touchStart(e){

      this.touchData.clientX=e.changedTouches[0].clientX;

      this.touchData.clientY=e.changedTouches[0].clientY;
    },
  }
}
</script>

<style lang="scss">
//主题颜色
$hx-theme-color: #FFC107;
$hx-theme-color-light: #FFEB3B;

.add{
  position: fixed;
  right: 60upx;
  top: 300upx;
  z-index: 999;
}
.ctn{

  /* border: 1px solid #e3e3e3; */
  width: 100%;
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  align-items: center;
  .searchCtn{
    display: flex;
    border-radius: 80upx;
    padding: 8upx 12upx;
    line-height: 44upx;
    background: #e0e0e0;
    overflow: hidden;
    align-items: center;
    min-width: 22px;
  }
  .leftBox{
    display: flex;
    width: 53px;
    justify-content: space-between;
    flex: none;
    margin: 0 8px;
  }
  .jrNull{
    /* #ifdef MP */
    width: 95px;
    flex: none;
    /* #endif */
  }
}


page{
  background: #ffffff;
}
.hx-bb{
  border-bottom: 1px solid $uni-border-color;
}
.hx-txt-10{
  font-size: 10px;
}
.hx-txt-12{
  font-size: 12px;
}
.hx-txt-14{
  font-size: 14px;
}
.hx-txt-16{
  font-size: 16px;
}
.hx-txt-18{
  font-size: 18px;
}
.hx-txt-22{
  font-size: 22px;
}
.hx-color-gray{
  color: #bbbbbb;
}
.hx-color-white{
  color: #FFFFFF;
}
.hx-color-black{
  color: #333333;
}
.hx-txt-weigth{
  font-weight: bold;
}
.hx-mb-10{
  margin-bottom: 10px;
}
.hx-mt-15{
  margin-top: 15px;
}
.hx-shadow{
  box-shadow: 0px 6upx 16upx rgba(173, 173, 173, 0.2);
}
.miniBtn{
  position: relative;
  padding: 0 12px;
  border-radius: 20px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: linear-gradient(100deg, #FFEB3B, #FFC107);
  font-size: 10px;
  color: #333;
  .num{
    position: absolute;
    right: 0;
    top: -10px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 10px;
    color: #fff;
    background-color: #ff5722;
    text-align: center;
    border-radius: 50%;

  }
}
.hx-store{
  .header{
    position: relative;
    min-height: 230px;
    &-bg{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      width: 100%;
      height: 142px;
    }
    &-bg-black{
      position: absolute;
      left: 0;
      top: 142px;
      bottom: 0;
      z-index: 1;
      background-color: #ffffff;
      width: 100%;
      transition: background-color 0.2s;
    }
    &-bg-gray{
      position: absolute;
      left: 0;
      top: 142px;
      bottom: -16px;
      z-index: 1;
      background-color: #afafaf;
      width: 100%;
      transition: background-color 0.2s;
    }
    &-top-Placeholder{
      height: 105px;
    }
    .storeInfo{
      position: relative;
      z-index: 2;
      background: #ffffff;
      height: 100px;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 4px;
      transition: all 0.2s;
      .shrink-box{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 20px;
        color: #a2a8ab;
      }
      .storeAvatar{
        position: absolute;
        width: 50px;
        height: 50px;
        right: 16px;
        top: -25px;
        background: #ffffff;
        border-radius: 4px;

      }
    }
  }
  .container{
    margin: 0 32upx;
  }
  .tabs-box{
    width: 100%;
    position: sticky;
    top: calc(44px + var(--status-bar-height));
    z-index: 10;
    background-color: white;
    border-bottom: 1px solid #efefef;
    height: 40px;

    .hx-tabs{
      position: relative;
      display: flex;
      height:100%;
      &-item{
        display: flex;
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
        width: 70px;
      }
      &-slider{
        display: flex;
        background: #f6d200;
        width: 30px;
        height: 3px;
      }
    }
  }
  .main{
    position: relative;
    background-color: #ffffff;

    #mainSwiper{
      background-color: #eeeeee;
      position: sticky;
      top: calc(40px + 44px + var(--status-bar-height));
      .scroll-items{
        // 商品列表样式
        .category-list{
          width: 100%;
          background-color: #fff;
          display: flex;
          padding-bottom: 50px;

          .left,.right{
            background: #fff;
            position: absolute;
            top:0;
            bottom: 0upx;
          }
          .left{
            width: 24%;
            left: 0upx;
            background-color: #f6f3f3;

            .row{
              width: 100%;
              height: 60px;
              display: flex;
              align-items: center;
              overflow: hidden;
              position: relative;
              .text{
                width: 100%;
                font-size: 14px;
                color:#999999;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                text-align: center;
                padding: 0 16px;
              }
              &-number{
                position: absolute;
                width: 18px;
                height: 18px;
                right: 4px;
                top: 4px;
                background: #ff5722;
                border-radius: 50%;
                line-height: 18px;
                text-align: center;
                font-size: 10px;
                color: #ffffff;
              }
              &.active{
                height: 60px;
                background-color: #fff;
                .text{
                  font-size: 14px;

                }
              }
            }
            .row:last-child{
              margin-bottom: 200upx;
            }
          }
          .right{
            width: 76%;
            left: 24%;
            .goodsListBox{
              padding-bottom: 100px;
              .category{
                // 				width: 94%;
                padding: 0 15px 10px 15px;
                .s-item{
                  height: 45px;
                  line-height: 45px;
                  font-size: 16px;
                  background: #ffffff;
                  color: #555555;
                  position: sticky;
                  top: 0;
                  z-index: 18;
                }
                .list:last-child{
                  margin-bottom: 0;
                }
                .list{
                  margin-bottom: 20px;
                  width: 100%;
                  display: flex;
                  flex-wrap: wrap;
                  .box:first-child{
                    .m-store-item{
                      margin-top: 0;
                    }
                  }
                  .box{
                    width: 100%;

                    .m-store-item{
                      display: flex;
                      flex-direction: row;
                      width: 100%;
                      justify-content: space-between;
                      align-items: flex-end;
                      margin-top: 15px;
                      margin-bottom: 15px;
                      .m-img{
                        flex: 0 0 85px;
                        height: 85px;
                        background: #eee;
                        border-radius: 4px;
                      }
                      .m-text{
                        flex: 1;
                        position: relative;
                        height: 85px;
                        padding: 0 6px;
                        display: flex;
                        align-content: space-between;
                        flex-direction: column;
                        .m-title{
                          font-size: 13px;
                          color:#555555;
                          height: 58px;
                          font-weight: bold;
                          overflow: hidden;
                          display: -webkit-box;
                          -webkit-box-orient: vertical;
                          -webkit-line-clamp: 4;

                        }
                        .m-descripe{
                          font-size: 12px;
                          color:#999999;
                          margin-top: 8px;
                          height: 35px;
                          margin-bottom: 8px;
                        }
                        .m-price-box{
                          height: 24px;
                          font-weight: bold;
                          display: flex;
                          flex-direction: row;
                          align-items: flex-end;
                          .symbol{
                            color:#ff582b;
                            font-size: 12px;
                          }
                          .m-price{
                            position: relative;
                            top: 2px;
                            font-size: 18px;
                            color:#ff582b;
                          }
                          .m-old-price{
                            margin-left: 3px;
                            display: flex;
                            flex-direction: row;
                            font-size: 10px;
                            color:#999999;
                            margin-top: 5upx;
                            text-decoration: line-through;
                            font-weight: normal;
                          }
                        }
                        .m-distance{
                          position: absolute;
                          right: 0;
                          bottom: -4px;
                          z-index: 16;
                          color:#b2b2b2;
                          font-size: 20upx;
                          text-align: right;
                          .jumpPosition{
                            position: absolute;
                            bottom: 23px;
                            right: 0;
                            z-index: 2;
                            width: 28px;
                            height: 28px;
                          }
                        }

                      }

                    }
                  }
                }
              }
            }
          }
        }
      }
      .evaluate-box{

      }
      .business-box{

        .info-list{
          background: #ffffff;
          padding: 0 15px;
          &-container{
            line-height: 46px;
            height: 46px;
            display: flex;
            flex-direction: row;
            [class*="hxicon-"]{
              color: #a2a2a2;
              margin-right: 8px;
            }
            text{
              font-size: 14px;
            }
            .right{

              float: right;
              color: #dddddd;
              display: flex;
              flex-direction: row;
              align-items:center;
              [class*="hxicon-"]{
                color: #dddddd;
                margin-right: 0;
                font-size: 16px;
              }
            }
          }

        }
      }
    }

  }
  .foot{
    position: fixed;
    display: flex;
    z-index: 999;

    justify-content:center;
    align-items : center;
    bottom: 0;
    height: 100%;
    width: 100%;

    /*width: calc(100% - 32px);*/
    .btn-box{
      position:absolute;
      display: flex;
      bottom: 15px;
      justify-content:center;
      align-items : center;
      margin:0;
      height: 50px;
      width: calc(100% - 32px);
      z-index: 9;
      &-left{
        background: #222222;
        border-top-left-radius:50px;
        border-top-right-radius:9px;
        border-bottom-left-radius:50px;
        border-bottom-right-radius:9px;
        padding-left: 6upx;
        display: flex;
        flex-direction:column;
        justify-content:center;
        align-self: center;
        width: 70px;
        height: 100%;
        color: #f6d200;
        text-align: center;
        .imgBox{
          display: flex;
          text-align: center;
          justify-content:center;
          image{
            width: 20px;
            height: 20px;
          }
        }
        text{
          font-size: 20upx;
        }
      }
      &-line{
        background: #ffffff;
        width: 2px;
        height: 100%;
      }
      &-center{
        height: 100%;
        flex: auto;
        display: flex;
        justify-content:flex-start;
        align-self: center;
        align-items: center;
        background: #222222;
        border-top-left-radius:8upx;
        border-bottom-left-radius:8upx;
        padding-left: 10upx;
        .cart{
          position: relative;
          width: 36px;
          height: 36px;
          image{
            width: 100%;
            height: 100%;
          }
          .tag{
            position: absolute;
            right: 12upx;
            top: 16upx;
            height: 18px;
            width: 18px;
            background-color: #ff4000;
            color: #ffffff;
            border-radius: 50%;
            z-index: 1;
            font-size: 10px;
            text-align: center;
            line-height: 18px;
          }
        }
        .priceBox{
          flex: auto;
        }

      }
      &-right{
        width: 70px;
        height: 100%;
        position: relative;
        display: flex;
        justify-content:flex-start;
        align-self: center;
        align-items: center;


        .pscj{
          width: 100%;
          height: 100%;
          border-top-right-radius:100upx;
          border-bottom-right-radius:100upx;
          background: #222222;
          text-align: center;
          display: flex;
          justify-content:center;
          align-self: center;
          align-items: center;
        }
        .jiesuan{
          width: 100%;
          height: 100%;
          font-size: 28upx;
          border-top-right-radius:100upx;
          border-bottom-right-radius:100upx;
          text-align: center;
          display: flex;
          justify-content:center;
          align-self: center;
          align-items: center;
          background: linear-gradient(45deg, $hx-theme-color-light, $hx-theme-color);
          font-weight: bold;
          color: #222222;
        }
      }
    }
    .zz{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.7);
      z-index: 1;
    }
    .cart-box{
      display: flex;
      justify-content: flex-start;
      flex-flow: column;
      background: #ffffff;
      position: absolute;
      bottom: 0;
      z-index: 2;
      max-height: 66%;

      padding-bottom: 62px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      overflow: hidden;
      width: 100%;
      .rebate-box{
        height: 30px;
        background: #FFC107;
        color: #FF9900;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
      }
      .box-container{
        box-sizing: border-box;
        padding:0 16px;
      }
      .operating-box{
        font-size: 12px;
        line-height: 40px;
        height: 40px;
        border-bottom: 1px solid #f6f6f6;
        color: #666666;
        display: flex;
        flex-direction: row;
        &_right{
          flex: 1;
        }
        &_left{
          display: flex;
          flex-direction: row;
        }

      }
      .goods-box{
        height: 100%;
        overflow: hidden;
        flex: 1;
        display: flex;
        .goods-list-scroll{
          height: 100%;

          .goods-list{

            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .box{
              width: 100%;
              border-bottom: 1px solid #f6f6f6;
              box-sizing: border-box;
              padding: 0 16px;
              .m-store-item{
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-between;
                align-items: flex-end;
                padding-top: 15px;
                padding-bottom: 15px;
                .m-img{
                  flex: 0 0 85px;
                  height: 85px;
                  background: #eee;
                  border-radius: 4px;
                }
                .m-text{
                  flex: 1;
                  position: relative;
                  height: 85px;
                  padding: 0 6px;
                  display: flex;
                  align-content: space-between;
                  flex-direction: column;
                  .m-title{
                    font-size: 16px;
                    color:#555555;
                    height: 21px;
                    font-weight: bold;
                  }
                  .m-descripe{
                    font-size: 12px;
                    color:#999999;
                    margin-top: 5px;
                    height: 35px;
                  }
                  .m-price-box{
                    height: 24px;
                    font-weight: bold;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                    .symbol{
                      color:#ff582b;
                      font-size: 12px;
                    }
                    .m-price{
                      position: relative;
                      top: 2px;
                      font-size: 18px;
                      color:#ff582b;
                    }
                    .m-old-price{
                      margin-left: 3px;
                      display: flex;
                      flex-direction: row;
                      font-size: 10px;
                      color:#999999;
                      margin-top: 5upx;
                      text-decoration: line-through;
                      font-weight: normal;
                    }
                  }
                  .m-distance{
                    position: absolute;
                    right: 0;
                    bottom: -4px;
                    z-index: 16;
                    color:#b2b2b2;
                    font-size: 20upx;
                    text-align: right;
                    .jumpPosition{
                      position: absolute;
                      bottom: 23px;
                      right: 0;
                      z-index: 2;
                      width: 28px;
                      height: 28px;
                    }
                  }

                }

              }
            }
          }
        }
      }
    }
  }
}
.form-main{

  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 15px;

  .form-main_ctn{
    display: flex;
    flex-direction: column;
    justify-content: left;
    padding: 23px 22px 22px 22px;
    background-color: #fff;
    border-radius: 8px;
    .godos_tit{
      margin-top: 4px;
      margin-bottom: 6px;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
    .gg_tit{
      margin-top: 8px;
      font-size: 14px;
      font-weight: bold;
      color: #555;
    }
    .gg_box{
      margin-top: 8px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      font-size: 12;
      color: #333;
      .item{
        margin-right: 14px;
        margin-bottom: 14px;
        border: 1px solid #f1f1f1;
        border-radius: 4px;
        padding: 4px 6px;
      }
      .item.active{
        border-color: #ffe081;
        background-color: #fff0b7;
      }

    }
    .select_gg{
      margin: 26px -12px 0;
      padding: 6px 12px;
      color: #999;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: row;
      .lable{

      }
      .select_gg_box{
        flex: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .gg-item{
          color: #333;
          .gg-item-cut{
            margin-left: 3px;
            margin-right: 3px;
          }
        }
        .gg-item:last-child{
          .gg-item-cut{
            display: none;
          }
        }
      }

    }
    .bottom{
      position: relative;
      display: flex;
      flex-direction: row;
      margin-top: 12px;
      .price_box{
        flex: 1;
        lign-items: baseline;
        color: #ff582b;
        font-size: 14px;
        position: relative;
        top: 4px;
        .price{
          font-size:  24px;
        }
      }
      .jumpPosition{
        position: absolute;
        right: 16px;
        top: 2px;
      }
      .form-btn-box{
        height: 30px;
        line-height: 30px;
        .add-btn{
          border-radius: 50px;
          background-color: #ffce3c;
          padding: 0 12px;
          display: flex;
          height: 30px;
          line-height: 30px;
          align-items: center;
          i{
            font-weight: bold;
            font-size: 18px;
            margin-right: 3px;
            margin-left: -4px;
          }
          text{

            font-size: 14px;
            font-weight: bold;
            color: #363636;
          }
        }
      }
    }

  }

  .close{
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: -70px;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    background-color: #fff;
    opacity: 0.7;
    text-align: center;
    line-height: 43px;
    i{
      font-weight: bold;
      font-size: 22px;
    }
  }
}



</style>
