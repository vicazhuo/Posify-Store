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
//   财务设置

/**
 *财务设置-获取
 */
export function settingApi() {
    return request({
        url: 'finance/info',
        method: 'get'
    });
}

/**
 *财务设置-保存
 */
export function settingSaveApi(data) {
    return request({
        url: 'finance/info',
        method: 'post',
		data
    });
}

/**
 *转账申请-申请列表
 */
export function storeExtractInfo(data) {
    return request({
        url: 'finance/storeExtract/list',
        method: 'get',
		params:data
    });
}

/**
 *转账申请-申请提现
 */
export function storeExtractApi(data) {
    return request({
        url: 'finance/storeExtract/cash',
        method: 'post',
		data
    });
}

/**
 *转账申请-备注
 */
export function storeExtractMarkApi(id,data) {
    return request({
        url: `finance/storeExtract/mark/${id}`,
        method: 'post',
		data
		
    });
}


/**
 *门店流水-获取列表
 */
export function storeFinanceInfo(data) {
    return request({
        url: 'finance/store_finance_flow/list',
        method: 'get',
		params:data
    });
}

/**
 *门店流水--备注
 */
export function storeFinanceMarkApi(id,data) {
    return request({
        url: `finance/store_finance_flow/mark/${id}`,
        method: 'post',
		data
    });
}
/**
 *门店流水--获取店员列表
 */
export function storeFinanceflowApi() {
    return request({
        url: `finance/store_finance_flow/staff`,
        method: 'get'
    });
}


/**
 *门店流水--获取账单记录列表
 */
export function storeFfundRecordApi(data) {
    return request({
        url: `finance/store_finance_flow/fund_record`,
        method: 'get',
		params:data
    });
}


/**
 *门店流水--账单记录列表-账单详情
 */
export function storeFfundRecordInfoApi(data) {
    return request({
        url: `finance/store_finance_flow/fund_record_info`,
        method: 'get',
		params:data
    });
}



/**
 *门店流水--账单记录列表-账单下载
 */
export function exportfundRecordApi(data) {
    return request({
        url: `/export/financeRecord`,
        method: 'get',
		params:data
    });
}