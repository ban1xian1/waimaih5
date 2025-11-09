import http from './interface'
const CryptoJS = require("crypto-js");

//手机号登录
export const login = (data) => {
    return http.request({
        url: '/api/login/login',
		method:'POST',
        data,
    })
}

//退出登录
export const logout = () => {
    return http.request({
        url: '/home/v1/logout',
		method:'GET',
    });
}

//使用手机号注册账户
export const Reg = (data) => {
    return http.request({
        url: '/api/login/register',
		method:'POST',
        data,
    })
}


/**
 * 修改密码
 * oldPwd	原密码
 * newPwd	新密码
 */
export const updatePassword = (data) => {
    return http.request({
        url: '/api/user/changPassword',
		method:'POST',
        data,
    })
}
export const updatePayPassword = (data) => {
    return http.request({
        url: '/api/user/changePayPassword',
        method:'POST',
        data,
    })
}

/**
 * 密码验证
 * oldPwd	原密码
 * newPwd	新密码
 */
export const passwordValidation = (data) => {
    return http.request({
        url: '/home/v1/password/validation',
		method:'POST',
        data,
    })
}

/**
 * 检查是否登录
 * oldPwd	原密码
 * newPwd	新密码
 */
export const hasLogin = () => {
    return http.request({
        url: '/home/v1/user/islogin',
		method:'GET'
    })
}


/**
 * 更新手机号
 * phone	手机号
 * code		手机验证码
 */
export const updatePhone = (data) =>{
	return http.request({
	    url: '/home/v1/user/phone/update',
		method:'POST',
	    data,
	})
}
export const userDetalles=()=>{
    return http.request({
        url: '/api/user/detalles',
    })
}
export  const  userAddressAdd=(data)=>{
    return http.request({
        url:'/api/userAddress/add',
        method:'POST',
        data
    })
}
export  const  userAddressChange=(data)=>{
    return http.request({
        url:'/api/userAddress/edit',
        method:'POST',
        data
    })
}
export  const  userAddressLists=()=>{
    return http.request({
        url:'/api/userAddress/lists',
    })
}
export  const  userMoneylogLists=(data)=>{
    return http.request({
        url:'/api/userMoneylog/lists',
        data
    })
}
//银行卡列表
export const userBanklists=()=>{
    return http.request({
        url:'/api/userBank/lists',
    })
}
export const userBankAdd=(data)=>{
    return http.request({
        url:'/api/userBank/add',
        method:'POST',
        data
    })
}
export const userBankDel=(data)=>{
    return http.request({
        url:'/api/userBank/del',
        method:'POST',
        data
    })
}
//购物车
export const cartList=()=>{
    return http.request({
        url:'/api/cart/lists',
    })
}
export const cartAdd=(data)=>{
    return http.request({
        url:'/api/cart/add',
        method:'POST',
        data
    })
}
export const cartDel=(data)=>{
    return http.request({
        url:'/api/cart/del',
        method:'POST',
        data
    })
}
export const cartDelAll=()=>{
    return http.request({
        url:'/api/cart/delAll',
        method:'POST',

    })
}
export const shopCartDetalles=(data)=>{
    return http.request({
        url:'/api/cart/shopCartDetalles',
        data
    })
}
// --------------------------------------------------------------------------------------------/
//创建订单
export const orderAdd=(data)=>{
    return http.request({
        url:'/api/order/add',
        method:'POST',
        data
    })
}

//支付订单
export const orderPay=(data)=>{
    return http.request({
        url:'/api/order/pay',
        method:'POST',
        data
    })
}
//取消订单
export const orderCancel=(data)=>{
    return http.request({
        url:'/api/order/cancel',
        method:'POST',
        data
    })
}

//退款订单
export const orderRefund=(data)=>{
    return http.request({
        url:'/api/order/refund',
        method:'POST',
        data
    })
}
export const orderLists=(data)=>{
    return http.request({
        url:'/api/order/lists',
        data
    })
}
export const orderDetails=(data)=>{
    return http.request({
        url:'/api/order/details',
        data
    })
}
export const orderPayInfo=(data)=>{
    return http.request({
        url:'/api/order/payInfo',
        data
    })
}
export const qk=(data)=>{
    return http.request({
        url:'/api/user/qk',
        method:'POST',
        data
    })
}
//积分历史
export const jfLists=(data)=>{
    return http.request({
        url:'/api/goodsJf/lists',
        data
    })
}
//获取推官码
export const getCode=()=>{
    return http.request({
        url:'/api/user/inviteCode',
    })
}
export const quList=(data)=>{
    return http.request({
        url:'/api/user/qk_records',
        data
    })
}




export default {
	login,
	logout,
    Reg,
	updatePassword,
	passwordValidation,
	updatePhone,
	hasLogin,
    userDetalles,
    userAddressAdd,
    userAddressChange,
    userAddressLists,
    userMoneylogLists,
    userBanklists,
    userBankAdd,
    userBankDel,
    cartDel,
    cartAdd,
    cartList,
    cartDelAll,
    shopCartDetalles,
    orderAdd,
    orderPay,
    orderCancel,
    orderRefund,
    orderLists,
    orderDetails,
    orderPayInfo,
    updatePayPassword,
    qk,
    jfLists,
    getCode,
    quList
}

