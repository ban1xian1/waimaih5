import Vue from 'vue'
import App from './App'

import store from './store/index';
Vue.prototype.$store = store;
const userData = uni.getStorageSync('userData')

if (userData!=''&& typeof userData!='undefined'&& userData.token!='') {
	store.commit('login', userData)
}

//配置
import config from './config.js'
Vue.prototype.$conf = config
import { refreshPage } from './common/vmeitime-http/refreshPage.js';
Vue.prototype.$refresh = refreshPage;

Vue.prototype.$msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
// \uni.showToast({
// 	icon: 'error',
// 	position: 'bottom',
// 	title: 'Sesión expirada'
// });
// }

import api from './common/vmeitime-http/index.js'
Vue.prototype.$api = api
Promise.all([api.allrequest.webConfig()]).then(([webConfig])=>{
	let config = webConfig.data.data;

	// 设置 favicon
	let link = document.querySelector("link[rel~='icon']");
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon'; // 必须是 "icon"
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	link.href = config.site_logo; // 这里放图片 URL
	document.title = config.site_name || "shop";

	// 缓存配置
	uni.setStorageSync('webConfig', config);
}).catch(function (e){
	console.log(e);
});


import appupgrade from './common/appupgrade.js'
import {webConfig} from "./common/vmeitime-http/request";
Vue.prototype.$appUpgrade = appupgrade

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
