// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import request from '@/plugins/request';
// 商品列表
/**
 *商品列表-获取列表
 */
export function productListInfo(data) {
    return request({
        url: 'product/product',
        method: 'get',
        params: data
    });
}

/**
 * @description 商品列表-- 详情
 */
export function productInfoApi(id) {
    return request({
        url: `product/product/${id}`,
        method: 'get'
    });
}
/**
 *商品列表-获取列表头
 */
export function productHeaderInfo(data) {
    return request({
        url: 'product/type_header',
        method: 'get',
        params: data
    });
}

/**
 *商品列表-商品分类
 */
export function cascaderListApi() {
    return request({
        url: `product/category`,
        method: 'get'
    });
}

/**
 *商品列表-商品编辑
 */
export function productEditApi(id) {
    return request({
        url: `product/product/${id}/edit`,
        method: 'get'
    });
}

/**
 *商品列表-商品编辑-保存
 */
export function productsaveApi(id, data) {
    return request({
        url: `product/product/${id}`,
        method: 'put',
        data
    });
}

/**
 *商品列表-商品编辑- 用户标签
 */
export function labelListApi() {
    return request({
        url: 'product/getUserLabel',
        method: 'get'
    });
}

/**
 *商品列表-商品评价
 */
export function productReplyApi(params) {
    return request({
        url: `product/reply`,
        method: 'get',
        params
    });
}

/**
 * 商品评论 -- 回复
 */
export function setReplyApi(data, id) {
    return request({
        url: `product/reply/set_reply/${id}`,
        method: 'PUT',
        data
    });
}

/**
 * 商品 -- 上下架
 */
export function setShowApi(id, is_show) {
    return request({
        url: `product/product/set_show/${id}/${is_show}`,
        method: 'PUT'
    });
}

/**
 *商品列表-获取商品规格
 */
export function productAttrsApi(id) {
    return request({
        url: `product/product/attrs/${id}`,
        method: 'get'
    });
}

/**
 *商品列表-提交商品规格库存
 */
export function productSaveStocksApi(data, id) {
    return request({
        url: `product/product/saveStocks/${id}`,
        method: 'PUT',
        data
    });
}

/**
 *商品列表-获取商品规格
 */
export function synchStocks(data) {
    return request({
        url: `/product/product/synchStocks`,
        method: 'post',
        data
    });
}
