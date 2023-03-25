<template>
	<div>
		<div class="i-layout-page-header">
		  <PageHeader class="product_tabs" hidden-breadcrumb>
			<div slot="title">
			  <router-link :to="{ path: '/store/product/index' }"
				><Button icon="ios-arrow-back" size="small" class="mr20"
				  >返回</Button
				></router-link
			  >
			  <span class="mr20">编辑商品</span>
			</div>
		  </PageHeader>
		</div>
		<Card :bordered="false" dis-hover class="ivu-mt">
			<Form
			  class="formValidate mt20"
			  ref="formValidate"
			  :model="formValidate"
			  :label-width="labelWidth"
			  :label-position="labelPosition"
			  @submit.native.prevent
			>
				<Row :gutter="24" type="flex">
					<!-- 商品信息-->
					<Col span="24">
					  <FormItem label="商品名称：" prop="store_name">
					    <Input
					      v-model="formValidate.store_name"
					      placeholder="请输入商品名称"
					      v-width="'50%'"
						  disabled
					    />
					  </FormItem>
					</Col>
					<Col span="24">
					  <FormItem label="商品关键字：" prop="">
					    <Input
					      v-model="formValidate.keyword"
					      placeholder="请输入商品关键字"
					      v-width="'50%'"
						  disabled
					    />
					  </FormItem>
					</Col>
					<Col span="24">
					  <FormItem label="单位：" prop="unit_name">
					    <Input
					      v-model="formValidate.unit_name"
					      placeholder="请输入单位"
					      v-width="'50%'"
						  disabled
					    />
					  </FormItem>
					</Col>
					<Col span="24">
					  <FormItem label="商品简介：" prop="">
					    <Input
					      v-model="formValidate.store_info"
					      type="textarea"
					      :rows="3"
					      placeholder="请输入商品简介"
					      v-width="'50%'"
						  disabled
					    />
					  </FormItem>
					</Col>
					<Col span="24">
					 <FormItem label="关联用户标签：" prop="label_id">
						 <div class="labelInput acea-row row-between-wrapper" @click="openLabel">
						 	<div style="width: 95%;">
						 		<Tag closable v-if="dataLabel.length" v-for="(item,index) in dataLabel" @on-close="closeLabel(item)">{{item.label_name}}</Tag>
						 		<span class="span" v-else>选择用户关联标签</span>
						 	</div>
						 	<div class="iconfont iconxiayi"></div>
						 </div>
							<!-- <Select v-model="formValidate.label_id" multiple class="perW50">
							  <Option
							    v-for="(item, index) in labelSelect"
									:disabled="item.label_cate === 0"
							    :value="item.id == []?formValidate.label_id:item.id"
							    :key="index"
							    >{{ item.html + item.label_name }}</Option
							  >
							</Select> -->
							
					  </FormItem>
					</Col>
					<Col span="24">
					  <FormItem label="是否上架：" prop="is_show">
					    <i-switch
					      v-model="formValidate.is_show"
					      :value="formValidate.is_show"
					      :true-value="1"
					      :false-value="0"
					      size="large"
					    >
					      <span slot="open">上架</span>
					      <span slot="close">下架</span>
					    </i-switch>
					  </FormItem>
					</Col>
					<Col span="24">
						<FormItem  label="商品属性：">
						  <Table :data="date" :columns="columns" border>
							  <template slot-scope="{ row, index }" slot="pic">
								  <img :src="row.pic">
							  </template>
							  <template slot-scope="{ row, index }" slot="stock">
								  <InputNumber :min="0" v-model="row.stock" :disabled="openErp" @on-change="stock(row,index)"></InputNumber>
							  </template>
						  </Table>
						</FormItem>
					</Col>
				</Row>
				<FormItem>
				  <Button
				    type="primary"
				    class="submission"
				    @click="handleSubmit('formValidate')"
				    >保存</Button
				  >
				</FormItem>
			</Form>
		</Card>
		<!-- 用户标签 -->
		<Modal
		  v-model="labelShow"
		  scrollable
		  title="请选择用户标签"
		  :closable="false"
		  width="320"
		  :footer-hide="true"
			:mask-closable="false"
		>
		  <userLabel ref="userLabel" @activeData="activeData" @close="labelClose"></userLabel>
		</Modal>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { productEditApi, productsaveApi } from "@/api/product"
	import { erpConfig } from "@/api/erp";
	import userLabel from "@/components/labelList";
	export default{
		name: 'productEdit',
		components: {
			userLabel
		},
		data(){
			return{
				openErp:false,
				dataLabel:[],
				labelShow:false,
				columns: [],
				date:[],
				openSubimit: false,
				formValidate: {
					is_show: "",
				  store_name: "",
				  keyword: "",
				  unit_name: "",
				  store_info: "",
				  label_id: []
				  }
			}
		},
		computed: {
		  ...mapState("store/layout", ["isMobile"]),
		  labelWidth() {
		    return this.isMobile ? undefined : 120;
		  },
		  labelPosition() {
		    return this.isMobile ? "top" : "right";
		  },
		  labelBottom() {
		    return this.isMobile ? undefined : 15;
		  },
		},
		mounted() {
			this.getList();
			this.getErpConfig();
			// this.userLabel();
		},
		methods:{
			//erp配置
			getErpConfig(){
				erpConfig().then(res=>{
					this.openErp = res.data.open_erp;
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			closeLabel(label){
				let index = this.dataLabel.indexOf(this.dataLabel.filter(d=>d.id == label.id)[0]);
				this.dataLabel.splice(index,1);
			},
			activeData(dataLabel){
				this.labelShow = false;
				this.dataLabel = dataLabel;
			},
			openLabel(row) {
			  this.labelShow = true;
				this.$refs.userLabel.userLabel(JSON.parse(JSON.stringify(this.dataLabel)));
			},
			// 标签弹窗关闭
			labelClose() {
			  this.labelShow = false;
			},
			//商品信息
			getList(){
				productEditApi(this.$route.params.id).then(res=>{
					this.columns = res.data.attrs.header
					this.date = res.data.attrs.attrs
					this.formValidate = res.data.storeInfo
					let label = res.data.storeInfo.label_id;
					// this.formValidate.label_id = res.data.storeInfo.label_id.map(Number)
					this.dataLabel = res.data.storeInfo.label_id;
				})
			},
			stock(e,index){
				this.date[index].stock = e.stock
			},
			// 用户标签
			// userLabel() {
			//   labelListApi()
			//     .then((res) => {
			//       this.labelSelect = res.data;
			//     })
			//     .catch((res) => {
			//       this.$Message.error(res.msg);
			//     });
			// },
			// 提交
			handleSubmit(name) {
			  this.$refs[name].validate((valid) => {
				  if(valid){
						let activeIds = [];
						this.dataLabel.forEach((item)=>{
							activeIds.push(item.id)
						});
						this.formValidate.label_id = activeIds
					  productsaveApi(this.$route.params.id,{attrs:this.date,label_id:this.formValidate.label_id,is_show:this.formValidate.is_show}).then(res=>{
						  this.$Message.success(res.msg)
						  this.$router.push({ path: "/store/product/index"});
					  }).catch(err=>{
						  this.$Message.error(err.msg)
					  })
				  }
			  })
			}
		}
	}
</script>

<style scoped lang="stylus">
	img{
		width 40px
		height 40px
	}
	.labeltop {
	  >>> .ivu-form-item-label {
	    float: none !important;
	    display: inline-block !important;
	    margin-left: 120px !important;
	    width: auto !important;
	  }
	}
	.labelInput{
		border: 1px solid #dcdee2;
		width 50%;
		padding 3px 5px;
		border-radius 5px;
		min-height 30px;
		cursor pointer;
		.span{
			 color: #c5c8ce;
		}
		.iconxiayi{
			font-size 12px
		}
	}	
</style>
