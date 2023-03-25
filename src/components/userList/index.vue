<template>
	<div style="width: 100%;background-color: #fff;padding-bottom: 19px;">
		<Form ref="userFrom" :model="userFrom" :label-width="100" @submit.native.prevent>
			<FormItem label="用户搜索：" :labelWidth="100" label-for="nickname">
				<Row>
					<Col>
					<Input v-model="userFrom.keyword" placeholder="请输入ID或者手机号" element-id="nickname" style="width: 100%"
						@on-search="orderSearch" search enter-button>
					<Select v-model="userFrom.field_key" slot="prepend" style="width: 80px">
						<Option value="all">全部</Option>
						<Option value="uid">ID</Option>
						<Option value="phone">手机号</Option>
					</Select>
					</Input>
					</Col>
				</Row>
			</FormItem>
		</Form>
		<Table :loading="loading" @on-sort-change="sortChanged" highlight-row no-userFrom-text="暂无数据" no-filtered-userFrom-text="暂无筛选结果"
			ref="selection" :columns="columns" :data="dataList" max-height="300">
			<template slot-scope="{ row, index }" slot="avatars">
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
	</div>
</template>

<script>
	import {
		userListApi,
		usersearchApi
	} from "@/api/user"
	export default {
		name: 'userList',
		data() {
			return {
				total: 0,
				userFrom: {
					keyword: "",
					page: 1,
					limit: 15,
					field_key: "all",
				},
				loading: false,
				dataList: [],
				currentid: 0,
				columns: [{
						title: "选择",
						key: "chose",
						width: 60,
						align: "center",
						render: (h, params) => {
							let uid = params.row.uid;
							let flag = false;
							if (this.currentid === uid) {
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
											self.currentid = uid;
											self.$emit("getUserId", params.row);
											if (params.row.uid) {
												if (this.$route.query.fodder === "image") {
													/* eslint-disable */
													let imageObject = {
														image: params.row.avatar,
														uid: params.row.uid
													};
													form_create_helper.set("image", imageObject);
													form_create_helper.close("image");
												}
											} else {
												this.$Message.warning("请先选择用户");
											}
										},
									},
								}),
							]);
						},
					},
					{
						title: "ID",
						key: "uid",
						width: 80,
					},
					{
						title: "头像",
						slot: "avatars",
						minWidth: 50,
					},
					{
						title: '昵称',
						key: 'nickname',
						minWidth: 70
					},
					{
						title: "手机号",
						key: "phone",
						minWidth: 70,
					},
					{
						title: "用户类型",
						key: "user_type",
						minWidth: 70,
					},
					{
						title: "余额",
						key: "now_money",
						sortable: 'custom',
						minWidth: 70,
					}
				],
			}
		},
		created() {
			this.getList()
		},
		methods: {
			// 排序
			sortChanged(e) {
			  this.userFrom[e.key] = e.order;
			  this.getList();
			},
			//用户列表
			getList() {
				this.loading = true
				userListApi(this.userFrom).then(res => {
					this.loading = false
					this.total = res.data.count
					this.dataList = res.data.list
				}).catch(err => {
					this.loading = false
					this.$Message.error(err.msg)
				})
			},
			usersearchList() {
				this.loading = true
				usersearchApi(this.userFrom).then(res => {
					this.dataList = res.data.list
					this.total = res.data.count
					this.loading = false
				}).catch(err => {
					this.loading = false
					this.$Message.error(err.msg)
				})
			},
			//搜索
			orderSearch() {
				this.userFrom.page = 1;
				if (this.userFrom.keyword == '') {
					this.getList()
				} else {
					this.usersearchList()
				}
			},
			// cancel(){
			//     this.currentid = 0
			// },
			pageChange(page) {
				this.userFrom.page = page;
				if (this.userFrom.keyword == '') {
					this.getList()
				} else {
					this.usersearchList()
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/.ivu-table {
		// height: 330px;
		// overflow-x: hidden;
		// overflow-y: auto;
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
