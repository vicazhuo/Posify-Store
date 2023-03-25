// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import BasicLayout from '@/layouts/basic-layout';

const pre = 'staff_';

export default {
    path: '/store/staff/',
    name: 'staff',
    header: 'staff',
		meta: {
		    // 授权标识
		    auth: ['store-staff']
		},
    redirect: {
        name: `${pre}clerkList`
    },
    component: BasicLayout,
    children: [
        {
            path: 'index',
            name: `${pre}clerkList`,
            meta: {
                auth: ['store-staff-index'],
                title: '店员列表'
            },
            component: () => import('@/pages/staff/clerkList')
        },
        {
            path: 'statistics',
            name: `${pre}achievement`,
            meta: {
                auth: ['store-staff-statistics'],
                title: '业绩统计'
            },
            component: () => import('@/pages/staff/achievement')
        },
		{
		    path: '/store/delivery/index',
		    name: `${pre}deliveryClerk`,
		    meta: {
		        auth: ['store-delivery-index'],
		        title: '配送员列表'
		    },
		    component: () => import('@/pages/staff/deliveryClerk')
		},
		{
		    path: '/store/delivery/statistics',
		    name: `${pre}statistics`,
		    meta: {
		        auth: ['store-delivery-statistics'],
		        title: '账单统计'
		    },
		    component: () => import('@/pages/staff/bill')
		},
    ]
};
