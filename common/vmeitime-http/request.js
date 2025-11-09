import http from './interface'

export const tag = () => {
    return http.request({
        url: '/api/shop/tag',
        method:'GET',
    })
}
export  const shopList=(data)=>{
    return http.request({
        url: '/api/shop/lists',
        data:data
    })
}
export  const  bannerList=()=>{
    return http.request({
        url: '/api/banner/lists',
    })
}
//店铺详情页面展示只有一个接口简单粗暴
export  const shopDetalles=(data)=>{
    return http.request(
        {
            url:'/api/shop/detalles',
            data:data
        }
    )
}
export  const productDetalles=(data)=>{
    return http.request(
        {
            url:'/api/goods/detalles',
            data:data
        }
    )
}
export  const productHotTag=(data)=>{
    return http.request(
        {
            url:'/api/goods/hotTags',
            data:data
        }
    )
}
export  const shopSearch=(data)=>{
    return http.request(
        {
            url:'/api/shop/search',
            data:data
        }
    )
}
export  const productSearch=(data)=>{
    return http.request(
        {
            url:'/api/goods/search',
            data:data
        }
    )
}
export  const webConfig=()=>{
    return http.request(
        {
            url:'/api/webConfig/lists',
        }
    )
}
export default {
    tag,
    shopList,
    bannerList,
    shopDetalles,
    productDetalles,
    productHotTag,
    shopSearch,
    productSearch,
    webConfig
}

