<template>
	<div>
		<Card :bordered="false" dis-hover class="ivu-mt box">
			<Form
			  ref="formValidate"
			  :model="formValidate"
			  :label-width="labelWidth"
			  :label-position="labelPosition"
			>
				<Row type="flex" :gutter="24">
					<Col v-bind="grid">
						<FormItem label="配送员搜索：">
						  <Input
						    v-model="formValidate.keyword"
						    placeholder="请输入ID/手机号"
						    clearable
						  >
						    <Select
						      v-model="formValidate.field_key"
						      slot="prepend"
						      style="width: 80px"
						    >
						      <Option value="all">全部</Option>
						      <Option value="id">ID</Option>
						      <Option value="phone">手机号</Option>
						    </Select>
						  </Input>
						</FormItem>
					</Col>
					<Col>
						<div class="search" @click="search">搜索</div>
					</Col>
					<Col>
						<div class="reset" @click="reset">重置</div>
					</Col>
				</Row>

			</Form>
		</Card>

		<Card :bordered="false" dis-hover class="ive-mt tablebox">
			<div class="btnbox">
				<Button v-auth="['staff-delivery-create']" type="primary" @click="add">添加配送员</Button>
			</div>
			<div class="table">
				<Table :columns="columns" :data="orderList" ref="table" class="mt25"
				       :loading="loading" highlight-row
				       no-userFrom-text="暂无数据"
				       no-filtered-userFrom-text="暂无筛选结果">
					<template slot-scope="{ row, index }" slot="status">
					  <i-switch
					    v-model="row.status"
					    :value="row.status"
					    :true-value="1"
					    :false-value="0"
					    @on-change="changeSwitch(row)"
					    size="large"
					  >
					    <span slot="open">开启</span>
					    <span slot="close">关闭</span>
					  </i-switch>
					</template>
					<template slot-scope="{ row, index }" slot="avatar">
						<viewer>
						  <div class="tabBox_img">
						    <img v-lazy="row.avatar" />
						  </div>
						</viewer>
					</template>
				    <template slot-scope="{ row, index }" slot="action">
				        <a @click="edit(row.id)">编辑</a>
				        <Divider type="vertical"/>
				        <a @click="del(row.id,'删除该配送员', index)">删除</a>
				        <Divider type="vertical"/>
				        <a @click="details(row)">查看详情</a>
				    </template>
				</Table>
				<div class="acea-row row-right page">
				  <Page
				    :total="total"
				    :current="formValidate.page"
				    show-elevator
				    show-total
				    @on-change="pageChange"
				    :page-size="formValidate.limit"
				  />
				</div>
			</div>
		</Card>
		<Details ref="Details"></Details>
	</div>
</template>

<script>
	import { deliveryListInfo, deliverycreate, deliveryEditApi, deliveryshowApi } from '@/api/staff'
	import Details from '../components/deliveryclerk'
	export default {
	    name: 'deliveryClerk',
		components:{
			Details
		},
	    data () {
			return{
				total:0,
				a:12,
				grid: {
				    xl: 8,
				    lg: 7,
				    md: 12,
				    sm: 24,
				    xs: 24
				},
				loading: false,
				columns: [
					{
						title: 'ID',
						key: 'id',
						width: 60
					},
					{
						title: '头像',
						slot: 'avatar',
						minWidth: 80
					},
					{
						title: '昵称',
						key: 'wx_name',
						minWidth: 80
					},
					{
					    title: '账号状态',
					    slot: 'status',
					    minWidth: 80
					},
					{
						title: '手机号',
						key: 'phone',
						minWidth: 100
					},
				    {
				        title: '操作',
				        slot: 'action',
				        fixed: 'right',
				        minWidth: 180,
				        align: 'center'
				    }
				],
				orderList:[{phone:1300000000,id:6,staff_name:"哈哈"}],
				formValidate: {
				  field_key: "all",
				  keyword:'',
				  page: 1,
				  limit: 15,
				}
			}
		},
		computed: {
		  labelWidth() {
		    return this.isMobile ? undefined : 80;
		  },
		  labelPosition() {
		    return this.isMobile ? "top" : "left";
		  },
		},
	    mounted () {
			this.getList()
		},
	    methods: {
			//列表
			getList(){
				this.loading = true
				deliveryListInfo(this.formValidate).then(res=>{
					this.total = res.data.count
					this.orderList = res.data.list
					this.loading = false
				}).catch(err=>{
					this.$Message.error(err.msg)
					this.loading = false
				})
			},
			//添加
			add(){
				this.$modalForm(deliverycreate()).then(() => this.getList());
			},
			//编辑
			edit(id){
				this.$modalForm(deliveryEditApi(id)).then(() => this.getList());
			},
			//删除
			del(id, tit, num) {
			  let delfromData = {
				title: tit,
				num: num,
				url: `staff/delivery/${id}`,
				method: "DELETE",
				ids: "",
			  };
			  this.$modalSure(delfromData)
				.then((res) => {
				  this.$Message.success(res.msg);
				  // this.tabList.splice(num, 1);
					this.getList()
				})
				.catch((res) => {
				  this.$Message.error(res.msg);
				});
			},
			//搜索
			search(){
				this.getList()
			},
			//重置
			reset(){
				this.formValidate.field_key = "all"
				this.formValidate.keyword = ""
				this.getList()
			},
			//状态
			changeSwitch(row){
				deliveryshowApi(row.id,row.status).then(res=>{
					this.$Message.success(res.msg);
				}).catch(err=>{
					this.$Message.error(res.msg);
				})
			},
			//分页
			pageChange(status) {
			  this.formValidate.page = status;
			  this.getList()
			},
			//详情
			details(row){
				this.$refs.Details.modals = true
				this.$refs.Details.getDetails(row.id);
			}
	    },
	}
</script>

<style scoped lang="less">
	/deep/.ivu-form .ivu-form-item-label{padding: 10px 0px;}
	/deep/.ivu-page-header,/deep/.ivu-tabs-bar{border-bottom: 1px solid #ffffff;}
	/deep/.ivu-card-body{padding: 0;}
	/deep/.ivu-tabs-nav{height: 45px;}
	img{width: 40px;height: 40px;}
	.box{padding: 20px;padding-bottom: 0px;}
	.tablebox{margin-top: 15px;}
	.btnbox{
		padding: 20px 0px 0px 30px;
		.btns{width: 99px;height: 32px;background: #1890FF;border-radius: 4px;text-align: center;line-height: 32px;color: #FFFFFF;cursor: pointer;}
	}
	.table{padding: 0px 30px 15px 30px;}
	.search{
		width: 86px;
		height: 32px;
		background: #1890FF;
		border-radius: 4px;
		text-align: center;
		line-height: 32px;
		font-size: 13px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		cursor: pointer;
	}
	.reset{
		width: 86px;
		height: 32px;
		border-radius: 4px;
		border: 1px solid rgba(151, 151, 151, 0.36);
		text-align: center;
		line-height: 32px;
		font-size: 13px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.85);
		cursor: pointer;
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
