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

const pre = 'set_';

export default {
	path: '/store/set/',
	name: 'set',
	header: 'set',
	meta: {
		// 授权标识
		auth: ['store-set']
	},
	redirect: {
		name: `${pre}set`
	},
	component: BasicLayout,
	children: [{
			path: 'store',
			name: `${pre}set`,
			meta: {
				title: '门店设置',
				auth: ['store-set-store']
			},
			component: () => import('@/pages/setting/index')
		},
		{
			path: 'index',
			name: `${pre}setting`,
			meta: {
				title: '系统设置',
				auth: ['store-set-index']
			},
			component: () => import('@/pages/setting/system/index')
		},
		{
			path: '/store/admin/index',
			name: `${pre}admin`,
			meta: {
				title: '管理员列表',
				auth: ['store-admin-index']
			},
			component: () => import('@/pages/setting/admin/index')
		}
	]
};
