<template>
	<div>
		<Card :bordered="false" dis-hover class="ivu-mt box">
			<Form
			  ref="formValidate"
			  :model="formValidate"
			  :label-width="labelWidth"
			  :label-position="labelPosition"
			  @submit.native.prevent
			>
				<FormItem label="创建时间：">
				  <RadioGroup
				    v-model="formValidate.data"
				    type="button"
				    @on-change="selectChange(formValidate.data)"
					style="margin-right: 20px"
				  >
				    <Radio
				      :label="item.val"
				      v-for="(item, i) in fromList.fromTxt"
				      :key="i"
				      >{{ item.text }}</Radio
				    >
				  </RadioGroup>
				  <DatePicker
				    :editable="false"
				    @on-change="onchangeTime"
				    :value="timeVal"
				    format="yyyy/MM/dd"
				    type="daterange"
				    placement="bottom-end"
				    placeholder="自定义时间"
				    style="width: 200px"
				  ></DatePicker>
				</FormItem>
				<FormItem label="审核状态：">
					<RadioGroup
						v-model="formValidate.status"
						type="button"
						@on-change="payStatus(formValidate.status)"
						style="margin-right: 20px">
							<Radio
							  :label="item.val"
							  v-for="(item, i) in fromLists.status"
							  :key="i"
							  >{{ item.text }}</Radio
							>
					</RadioGroup>
				</FormItem>
				<Row type="flex" :gutter="24">
					<Col v-bind="grid">
						<FormItem label="收款方式："  label-for="status1">
							<Select v-model="formValidate.extract_type" placeholder="请选择" clearable element-id="status1" @on-change="searchs">
								<Option value="bank">银行卡</Option>
								<Option value="weixin">微信</Option>
								<Option value="alipay">支付宝</Option>
							</Select>
						</FormItem>
					</Col>
					<Col v-bind="grid">
						<FormItem label="转账状态："  label-for="status1">
							<Select v-model="formValidate.pay_status" placeholder="请选择" clearable element-id="status1" @on-change="searchs">
								<Option value="0">未转账</Option>
								<Option value="1">已转账</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</Card>
		<cards-data :cardLists="cardLists" v-if="cardLists.length >= 0"></cards-data>
		<Card :bordered="false" dis-hover class="ive-mt">
			<div class="btnbox">
				<Button v-auth="['finance-storeExtract-cash']" type="primary" @click="add">申请提现</Button>
			</div>
			<div class="table">
				<Table :columns="columns" :data="orderList" ref="table" class="mt25"
				       :loading="loading" highlight-row
				       no-userFrom-text="暂无数据"
				       no-filtered-userFrom-text="暂无筛选结果">
				    <template slot-scope="{ row, index }" slot="action">
				    	<a @click="remark(row)">备注</a>
				    </template>
					<template slot-scope="{ row, index }" slot="extract_type">
						<span v-if="row.extract_type == 'bank'">银行卡</span>
						<span v-if="row.extract_type == 'weixin'">微信</span>
						<span v-if="row.extract_type == 'alipay'">支付宝</span>
					</template>
					<template slot-scope="{ row, index }" slot="type">
						<div v-if="row.extract_type == 'bank'">
							<div>开户地址：{{row.bank_address}}</div>
							<div>银行卡：{{row.bank_code}}</div>
						</div>
						<div v-if="row.extract_type == 'weixin'">
							<div>微信号：{{row.wechat}}</div>
							<viewer>
							  <div class="tabBox_img">
								  <img v-lazy="row.qrcode_url" />
							  </div>
							</viewer>
						</div>
						<div v-if="row.extract_type == 'alipay'">
							<div>支付宝账号：{{row.alipay_account}}</div>
							<viewer>
							  <div class="tabBox_img">
							    <img v-lazy="row.qrcode_url" />
							  </div>
							</viewer>
						</div>
					</template>
					<template slot-scope="{ row, index }" slot="status">
						<div v-if="row.status == '0'">未审核</div>
						<div v-if="row.status == '1'">已通过</div>
						<div v-if="row.status == '-1'">
							<div>未通过</div>
							<div>未通过原因：{{row.fail_msg}}</div>
						</div>
					</template>
					<template slot-scope="{ row, index }" slot="pay_status">
						<div v-if="row.pay_status == '0'">未转账</div>
						<div v-if="row.pay_status == '1'">
							<div>已转账</div>
							<div>转账说明：{{row.voucher_title}}</div>
							<viewer v-if="row.voucher_image">
							  <div class="tabBox_img">
							    <img v-lazy="row.voucher_image" />
							  </div>
							</viewer>
						</div>
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
		<!-- 备注 -->
		<Modal v-model="modalmark"  scrollable title="请修改内容"  class="order_box" :closable="false" :mask-closable="false">
		    <Form ref="remarks" :model="remarks" :label-width="80" @submit.native.prevent>
		        <FormItem label="备注：">
		            <Input v-model="remarks.mark" maxlength="200" show-word-limit type="textarea" placeholder="请填写备注~" style="width: 100%" />
		        </FormItem>
		    </Form>
		    <div slot="footer">
		        <Button  type="primary"  @click="putRemark()">提交</Button>
		        <Button @click="cancel()">取消</Button>
		    </div>
		</Modal>
		<!-- 申请提现 -->
		<Modal title="申请提现" v-model="modal" :mask-closable="false" @on-cancel='cancelApply'>
			<Form :model="formItem" :label-width="80">
				<FormItem label="申请金额：">
					<InputNumber  v-model="formItem.money" :min="0" placeholder="请输入申请金额"></InputNumber >
				</FormItem>
				<FormItem label="收款方式：">
					<Select v-model="formItem.extract_type" placeholder="请选择" clearable element-id="status1">
						<Option value="bank">银行卡</Option>
						<Option value="weixin">微信</Option>
						<Option value="alipay">支付宝</Option>
					</Select>
				</FormItem>
				<FormItem label="备注：">
					<Input v-model="formItem.mark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
				</FormItem>
			</Form>
			<div slot="footer">
			  <Button @click="cancelApply">取消</Button>
			  <Button type="primary" v-preventReClick @click="ok" >确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import { mapState } from 'vuex';
	import {storeExtractInfo,storeExtractApi, storeExtractMarkApi} from '@/api/capital'
	import cardsData from '../../../components/cards/cards.vue'
	export default {
	  name: 'bill',
		components: {
		    cardsData,
		},
	    data () {
			return{
				modal: false,
				modalmark: false,
				formItem: {
					money: 0,
					extract_type: 'bank',
					mark: ''
				},
				remarkId: 0,
				remarks: {
					mark: ''
				},
				total: 0,
				cardLists: [],
				extractStatistics: [],
				grid: {
				    xl: 7,
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
						title: '申请金额',
						key: 'extract_price',
						minWidth: 80
					},
					{
						title: '申请时间',
						key: 'add_time',
						minWidth: 150
					},
					{
						title: '收款方式',
						slot: 'extract_type',
						minWidth: 80
					},
					{
						title: '收款信息',
						slot: 'type',
						minWidth: 180
					},
					{
						title: '审核状态',
						slot: 'status',
						minWidth: 120
					},
					{
						title: '转账状态',
						slot: 'pay_status',
						minWidth: 180
					},
					{
						title: '管理员',
						key: 'admin_name',
						minWidth: 80
					},
					{
						title: '备注',
						key: 'store_mark',
						minWidth: 150
					},
				    {
				        title: '操作',
				        slot: 'action',
				        fixed: 'right',
				        minWidth: 120,
				        align: 'center'
				    }
				],
				orderList:[],
				formValidate: {
					pay_status: '',
					extract_type: "",
					data: "",
					status: '',
					page: 1,
					limit: 15,
				},
				timeVal: [],
				fromList: {
				  title: "选择时间",
				  custom: true,
				  fromTxt: [
				    { text: "全部", val: "" },
				    { text: "昨天", val: "yesterday" },
				    { text: "今天", val: "today" },
				    { text: "本周", val: "week" },
				    { text: "本月", val: "month" },
				    { text: "本季度", val: "quarter" },
				    { text: "本年", val: "year" },
				  ]
				},
				fromLists: {
				  custom: true,
				  status: [
				    { text: "全部", val: "" },
				    { text: "待审核", val: "0" },
				    { text: "已通过", val: "1" },
				    { text: "未通过", val: "-1" },
				  ]
				}
			}
		},
		computed: {
			...mapState('store/layout', [
				'isMobile'
			]),
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
			getList(){
				this.loading = true
				storeExtractInfo(this.formValidate).then(res=>{
					this.orderList = res.data.list.list
					this.total = res.data.list.count
					this.extractStatistics = res.data.extract_statistics;
					this.cardLists = [
					  {
					    col: 6,
					    count: this.extractStatistics.unPayPrice,
					    name: "待转账金额",
					    className: "md-basket",
					  },
					  {
					    col: 6,
					    count: this.extractStatistics.price,
					    name: "待审核金额",
					    className: "md-cash",
					  },
					  {
					    col: 6,
					    count: this.extractStatistics.price_not,
					    name: "可提现金额",
					    className: "ios-cash",
					  },
					  {
					    col: 6,
					    count: this.extractStatistics.paidPrice,
					    name: "累计提现金额",
					    className: "ios-cash",
					  },
					];
					this.loading = false
				})
			},
			searchs(){
				this.formValidate.page = 1;
				this.getList()
			},
			// 选择时间
			selectChange(tab) {
			  this.formValidate.page = 1;
			  this.formValidate.data = tab;
			  this.timeVal = [];
			  this.getList();
			},
			//审核状态
			payStatus(tab){
				this.formValidate.page = 1;
				this.formValidate.status = tab
				this.getList();
			},
			// 具体日期
			onchangeTime(e) {
			  this.timeVal = e;
			  this.formValidate.data = this.timeVal.join("-");
			  this.formValidate.page = 1;
			  this.getList();
			},
			//分页
			pageChange(status) {
			  this.formValidate.page = status;
			  this.getList()
			},
			remark(data){
				this.remarkId = data.id
				this.remarks.mark = data.store_mark
				this.modalmark = true;
			},
			// 制空
			clear(){
				this.formItem = {
					money: 0,
					extract_type: 'bank',
					mark: ''
				};
				this.remarks.mark = '';
			},
			cancelApply(){
				this.modal = false;
				this.clear();
			},
			add(){
				this.modal = true;
			},
			//申请提现提交
			ok(){
				if(this.formItem.money == '' || this.formItem.money <1){
					return this.$Message.error('提现金额不能小于1元');
				}
				storeExtractApi(this.formItem).then(res=>{
					this.$Message.success(res.msg);
					this.modal = false;
					this.getList();
					this.clear();
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			// 取消按钮
			cancel(){
				this.modalmark = false;
				this.clear();
			},
			//备注的提交
			putRemark(){
				storeExtractMarkApi(this.remarkId,this.remarks).then(res=>{
					this.$Message.success(res.msg)
					this.modalmark = false
					this.getList()
				}).catch(err=>{
					this.$Message.error(err.msg)
				})
			}
	    }
	}
</script>

<style scoped lang="less">
	/deep/.ivu-page-header,/deep/.ivu-tabs-bar{border-bottom: 1px solid #ffffff;}
	/deep/.ivu-card-body{padding: 0;}
	/deep/.ivu-tabs-nav{height: 45px;}
	// /deep/.ivu-col-span-xl-6{max-width: 20%;}
	/deep/.ivu-input-number{width: 150px !important;}
	/deep/.ivu-modal-body{padding: 16px 50px;}
	.box{padding: 20px;padding-bottom: 1px;}
	.btnbox{
		padding: 20px 0px 0px 30px;
		.btns{width: 99px;height: 32px;background: #1890FF;border-radius: 4px;text-align: center;line-height: 32px;color: #FFFFFF;cursor: pointer;}
	}
	.table{padding: 0px 30px 15px 30px;}
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
