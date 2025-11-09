<template>
	<view>
		<hx-navbar left-text="Acerca de nosotros" defaultBackUrl="/pages/user/setting/setting"></hx-navbar>
		
		<view class="container" >
			<image :src="config.site_logo" mode=""></image>
			<view class="title margin-top" style="word-break: break-all; white-space: normal;">
        <rich-text :nodes="config.about_us"></rich-text>
			</view>
			<text class="vsersion"></text>
		</view>
	</view>
</template>

<script>
	var that;
	export default {
		data() {
			return {
				appName: this.$conf.appName,
				version: this.$conf.version,
				company: this.$conf.company,
				companyEN: this.$conf.companyEN,
				nowYear: 2019,
				server: this.$conf.server,
        config:{

        },
			}
		},
		onLoad(){
			
		},
    onShow(){
      let config=uni.getStorageSync('webConfig');
      this.config=config;
      console.log(config);
    },
		mounted() {
			that= this;
			var myDate = new Date();
			that.nowYear = myDate.getFullYear();
		},
		methods: {
			// #ifdef APP-PLUS
			upgrade(){
				let that = this;
				 plus.runtime.getProperty(plus.runtime.appid,function(inf){ 
				        that.$appUpgrade.checkUpgrade( inf.version); 
				        //sessionStorage.setItem('upgrade','1');
				 });  
				/* uni.showLoading({
				    title: '获取最新版本中'
				});
				setTimeout(function () {
				    uni.hideLoading();
					uni.showToast({
					    title: '已是最新版本',
						position: 'center',
					});
				}, 2000); */
			},
			
			//检查更新
			checkUpgrade(wgtVer){
				let that = this;
				plus.nativeUI.showWaiting("检测更新...");
				that.$api.app.upgrade({version:wgtVer}).then((res)=>{
					plus.nativeUI.closeWaiting();
					let resData = res.data;
					if( parseInt(resData.code) ==1 ){                           
						//可以升级
						plus.nativeUI.confirm("检查到当前版本有最新更新，下载升级？",
							function(event){
								if(event.index ==0){
									console.log('下载地址：'+ server + resData.url)
									downWgt(server + resData.url); //下载更新版的地址
								}                        
							} ,'系统消息',['马上升级','下次再说']);                
					} else{  
						plus.nativeUI.toast("无新版本可更新！");
					}
				}).catch((e)=>{
					plus.nativeUI.closeWaiting();
					 plus.nativeUI.toast('检测更新失败！') ;
				})
			},
			// 下载wgt文件
			downWgt(wgtUrl){
			    plus.nativeUI.showWaiting("下载更新文件...");
			    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
			        if ( status == 200 ) { 
			            //console.log("下载wgt成功："+d.filename);
			            installWgt(d.filename); // 安装wgt包
			        } else {
			            //console.log("下载wgt失败！");
			            plus.nativeUI.alert("下载更新失败！");
			        }
			        plus.nativeUI.closeWaiting();
			    }).start();
			},
			
			// 更新应用资源  
			installWgt(path){
			    plus.nativeUI.showWaiting("正在安装更新文件...");
			    plus.runtime.install(path,{},function(){
			        plus.nativeUI.closeWaiting();        
			        plus.nativeUI.alert("应用资源更新完成！",function(){
			            plus.runtime.restart();
			        });
			    },function(e){
			        plus.nativeUI.closeWaiting();        
			        plus.nativeUI.alert("安装更新文件失败["+e.code+"]："+e.message);
			    });
			}
			
			// #endif
		}
	}
</script>

<style>
	page{
		background: #ffffff;
	}
	.cu-list.menu {
	    margin-left:24upx;
		margin-right:24upx;
		border-top: 2upx solid #f1f1f1;
	    border-bottom: 2upx solid #f1f1f1;
	}
	.text-grey{
		color: #555555;
	}
	.container{
		margin-top: 60upx;
		margin-bottom: 60upx;
		text-align: center;
	}
	.container image{
		width: 192upx;
		height: 192upx;
	}
  .title{
    padding: 15rpx;
  }
  p>img{
    width: 100%!important;
  }

	.version{
		font-size: 32upx;
		color: #333333;
	}
	.foot{
		position: absolute;
		bottom: 10upx;
		text-align: center;
		width: 100%;
	}
</style>
