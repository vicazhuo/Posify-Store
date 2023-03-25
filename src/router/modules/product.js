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

const pre = 'product_';

export default {
    path: '/store/product/',
    name: 'product',
    header: 'product',
    meta: {
        // 授权标识
        auth: ['store-product']
    },
    redirect: {
        name: `${pre}productList`
    },
    component: BasicLayout,
    children: [
        {
            path: 'index',
            name: `${pre}productList`,
            meta: {
                title: '商品列表',
                auth: ['store-product-index']
            },
            component: () => import('@/pages/product/productList')
        },
        {
            path: 'product_reply',
            name: `${pre}productReply`,
            meta: {
                title: '商品评价',
                auth: ['store-product-product_reply']
            },
            component: () => import('@/pages/product/productReply')
        },
        {
            path: 'edit_product/:id?',
            name: `${pre}productEdit`,
            meta: {
                title: '商品编辑',
                auth: ['store-product-product_reply'],
            },
            component: () => import('@/pages/product/productEdit')
        }
    ]
};
