<template>
	<div style="width: 100%">
		<Modal v-model="modals" scrollable footer-hide closable title="优惠券列表" :mask-closable="false" width="900"
			@on-cancel="cancel">
			<Table :loading="loading" highlight-row no-userFrom-text="暂无数据" no-filtered-userFrom-text="暂无筛选结果"
				ref="selection" :columns="columns" :data="dataList">
				<template slot-scope="{ row }" slot="coupon_price">
				   <span v-if="row.coupon_type==1">{{row.coupon_price}}元</span>
					 <span v-if="row.coupon_type==2">{{parseFloat(row.coupon_price)/10}}折（{{row.coupon_price.toString().split(".")[0]}}%）</span>
				</template>
				<template slot-scope="{ row, index }" slot="start_time">
				    <div v-if="row.start_time">
				        {{row.start_time | formatDate}} - {{row.end_time | formatDate}}
				    </div>
				    <span v-else>不限时</span>
				</template>
				<template slot-scope="{ row }" slot="type">
				    <span v-if="row.type === 1">品类券</span>
				    <span v-else-if="row.type === 2">商品券</span>
				    <span v-else-if="row.type === 3">会员券</span>
				    <span v-else>通用券</span>
				</template>
			</Table>
		</Modal>
	</div>
</template>

<script>
	import {
		cashierCouponList
	} from "@/api/order"
	import {formatDate} from '@/utils/validate'
	export default {
		name: 'userList',
		filters: {
		    formatDate(time) {
		        if (time !== 0) {
		            let date = new Date(time * 1000)
		            return formatDate(date, 'yyyy-MM-dd')
		        }
		    }
		},
		props: {
			uid: {
				type: Number,
				value: 0
			},
			cartList:{
				type: Array,
				value: 0
			}
		},
		data() {
			return {
				modals: false,
				loading: false,
				dataList: [],
				currentid: '',
				columns: [{
						title: "选择",
						key: "chose",
						width: 60,
						align: "center",
						render: (h, params) => {
							let id = params.row.id;
							let flag = false;
							if (this.currentid === id) {
								flag = true;
							} else {
								flag = false;
							}
							let self = this;
							return h("div", [
								h("Radio", {
									props: {
										value: flag,
									},
									on: {
										"on-change": () => {
											self.currentid = id;
											self.modals = false;
											self.$emit("getCouponId", params.row);
										},
									},
								}),
							]);
						},
					},
					{
						title: "ID",
						key: "id",
						width: 80,
					},
					{
						title: "优惠券名称",
						key: "coupon_title",
						minWidth: 70,
					},
					{
						title: '优惠券类型',
						slot: 'type',
						minWidth: 70
					},
					{
						title: "面值",
						slot: "coupon_price",
						minWidth: 70,
					},
					{
						title: "最低消费额",
						key: "use_min_price",
						minWidth: 60,
					},
					{
						title: "有效期限",
						slot: 'start_time',
						minWidth: 90
					}
				],
			}
		},
		created() {
		},
		methods: {
			//优惠券列表
			getList() {
				this.loading = true
				let ids = []
				this.cartList.forEach(item => {
					ids.push(item.id)
				})
				cashierCouponList(this.uid,{cart_id:ids}).then(res => {
					this.loading = false;
					this.dataList = res.data;
				}).catch(err => {
					this.loading = false
					this.$Message.error(err.msg)
				})
			},
			cancel() {
				this.currentid = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/.ivu-table {
		height: 300px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	/deep/.ivu-table-overflowX {
		overflow-x: hidden !important;
	}

	.tabBox_img {
		width: 36px;
		height: 36px;
		border-radius: 4px;
		cursor: pointer;

		img {
			width: 100%;
			height: 100%;
		}
	}
</style>

