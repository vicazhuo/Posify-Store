<template>
	<div style="width: 100%">
		<Modal v-model="modals" scrollable footer-hide closable title="店员列表" :mask-closable="false" width="900"
			@on-cancel="cancel">
			<Form ref="userFrom" :model="userFrom" :label-width="100" @submit.native.prevent>
				<FormItem label="用户搜索：" :labelWidth="100" label-for="nickname">
					<Row>
						<Col>
						<Input v-model="userFrom.keyword" placeholder="请输入用户名称/ID/手机号" element-id="nickname"
							style="width: 100%" @on-search="storeSearch" search enter-button>
						</Input>
						</Col>
					</Row>
				</FormItem>
			</Form>
			<Table :loading="loading" highlight-row no-userFrom-text="暂无数据" no-filtered-userFrom-text="暂无筛选结果"
				ref="selection" :columns="columns" :data="dataList">
				<template slot-scope="{ row, index }" slot="avatar">
					<viewer>
						<div class="tabBox_img">
							<img v-lazy="row.avatar" />
						</div>
					</viewer>
				</template>
			</Table>
			<div class="acea-row row-right page">
				<Page :total="total" show-elevator show-total :current="userFrom.page" @on-change="pageChange"
					:page-size="userFrom.limit" />
			</div>
		</Modal>
	</div>
</template>

<script>
	import {
		cashierStaff
	} from "@/api/order"
	export default {
		name: 'userList',
		data() {
			return {
				modals: false,
				total: 0,
				userFrom: {
					keyword: "",
					page: 1,
					limit: 15
				},
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
											self.$emit("getStoreId", params.row);
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
						title: "头像",
						slot: "avatar",
						minWidth: 50,
					},
					{
						title: '昵称',
						key: 'staff_name',
						minWidth: 70
					},
					{
						title: "手机号",
						key: "phone",
						minWidth: 70,
					}
				],
			}
		},
		created() {
			this.getList()
		},
		methods: {
			//用户列表
			getList(name) {
				this.loading = true
				cashierStaff(this.userFrom).then(res => {
					this.loading = false
					this.total = res.data.count;
					let dataList = res.data.staffList;
					let userInfo = res.data.staffInfo;
					this.dataList = dataList;
					if (name != 'search') {
						this.$emit("getUserInfo", {
							'users': userInfo,
							'storeList': dataList
						});
					}
				}).catch(err => {
					this.loading = false
					this.$Message.error(err.msg)
				})
			},
			//搜索
			storeSearch() {
				this.userFrom.page = 1;
				this.getList('search')
			},
			cancel() {
				this.currentid = ''
			},
			pageChange(page){
			    this.userFrom.page = page;
			    this.getList()
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
