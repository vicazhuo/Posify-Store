<template>
    <div v-resize="handleResize">
		<Card :bordered="false" dis-hover class="ivu-mt">
			<Form
			  ref="formValidate"
			  :model="formValidate"
			  :label-width="labelWidth"
			  :label-position="labelPosition"
			>
				<Row type="flex" :gutter="24" >
					<Col v-bind="grid">
						<FormItem label="选择配送员：">
							<Select v-model="formValidate.delivery_uid" placeholder="请选择" clearable @on-change="searchs">
								<Option :value="item.value" v-for="(item,index) in select">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col v-bind="grids">
						<FormItem label="订单时间：">
							<RadioGroup
							v-model="formValidate.data"
							type="button"
							@on-change="selectChange(formValidate.data)"
							class="time"
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
				</Col>
				</Row>
			</Form>
		</Card>	
		<Row :gutter="24"  class="ivu-mt Box">
			<Col  :xl="24" :lg="24" :md="24" :sm="24" :xs="24" >
				<div class="ivu-pl-8 fonts">配送订单趋势</div>
				<echarts-from ref="visitChart" :series="series"  :echartsTitle="inlie" :infoList="infoList" v-if="infoList" :yAxisData="yAxisData"></echarts-from>
			</Col>
		</Row>
		<Card :bordered="false" dis-hover class="ivu-mt box">
			<div class="fonts">配送数据</div>
			<Table ref="selection" :columns="columns4" :data="tabList" :loading="loading"
			       no-data-text="暂无数据" highlight-row
			       no-filtered-data-text="暂无筛选结果">
				   <template slot-scope="{ row }" slot="uid">
				     <span>{{row.nickname}} / {{row.uid}}</span>
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
		</Card>
	</div>
      
</template>

<script>
	import { staffDeliveryStatisticsHeaderApi, staffDeliveryselectApi,deliveryStatisticsApi } from '@/api/staff'//图表接口
	import echartsFrom from '@/components/echarts/index'
	export default {
		name: "bill",
		components: { echartsFrom },
		data() {
			return{
				total: 0,
				select: [],
				grid: {
				    xl: 5,
				    lg: 7,
				    md: 12,
				    sm: 24,
				    xs: 24
				},
				grids: {
				    xl: 19,
				    lg: 7,
				    md: 12,
				    sm: 24,
				    xs: 24
				},
				loading:false,
				optionData:{},
				formValidate: {
				  delivery_uid: "0",
				  data: "yesterday",
				  page: 1,
				  limit: 15,
				},
				timeVal: [],
				fromList: {
				  title: "选择时间",
				  custom: true,
				  fromTxt: [
				    { text: "昨天", val: "yesterday" },
				    { text: "今天", val: "today" },
				    { text: "最近7天", val: "sevenday" },
				    { text: "近30天", val: "thirtyday" },
				    { text: "本月", val: "month" },
				    { text: "本年", val: "year" },
				  ],
				},
				extractStatistics: {
					price: '11',
					brokerage_count: '23',
					priced: '34'
					
				},
				series: [],
				yAxisData: [],
				infoList: {},
				infoLists: {},
				circle: 'circle',
				inlie: 'inlie',
				columns4: [
				    {
				        title: '订单号',
				        key: 'order_id',
				        width: 200
				    },
				    {
				        title: '用户信息',
				        width: 120,
				        slot: 'uid'
				    },
				    {
				        title: '实际支付',
				        key: 'pay_price',
				        minWidth: 100
				    },
					{
					    title: '订单类型',
					    key: 'pink_name',
					    minWidth: 100
					},
				    {
				        title: '支付方式',
				        key: 'pay_type_name',
				        minWidth: 100
				    },
					{
					    title: '配送员名称',
					    key: 'delivery_name',
					    minWidth: 100
					},
					{
					    title: '下单时间',
					    key: 'add_time',
					    minWidth: 120
					},
				],
				tabList: [],
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
		created(){
			this.getStatistics()
			this.storeList()
			this.getList()
		},
		methods:{
			storeList(){
				staffDeliveryselectApi().then(res=>{
					this.select = res.data
				})
			},
			getList(){
				this.loading= true
				deliveryStatisticsApi(this.formValidate).then(res=>{
					this.tabList = res.data.list
					this.total = res.data.count
					this.loading= false
				})
			}, 
			searchs(){
				this.getList()
				this.getStatistics()
			},
			// 统计
			getStatistics () {
				if(!this.formValidate.delivery_uid){
					this.formValidate.delivery_uid = 0
				}
			    staffDeliveryStatisticsHeaderApi(this.formValidate).then(async res => {
			        this.infoList = res.data || {}
			        this.series = this.infoList.series || [],
					this.yAxisData = [
						{
							type: 'value',
							name: '',
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								textStyle: {
									color: '#7F8B9C'
								}
							},
							splitLine: {
								show: true,
								lineStyle: {
									color: '#F5F7F9'
								}
							}
						},
						{
							type: 'value',
							name: '',
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								textStyle: {
									color: '#7F8B9C'
								}
							},
							splitLine: {
								show: true,
								lineStyle: {
									color: '#F5F7F9'
								}
							}
						}
					]
			    }).catch(res => {
			        this.$Message.error(res.msg)
			    })
			},
			// 选择时间
			selectChange(tab) {
			  this.formValidate.page = 1;
			  this.formValidate.data = tab;
			  this.timeVal = [];
			  this.getList();
			  this.getStatistics()
			},
			// 具体日期
			onchangeTime(e) {
			  this.timeVal = e;
			  this.formValidate.data = this.timeVal[0] ? this.timeVal.join("-") : "";
			  if(e[0]==''){
				  this.formValidate.data = 'yesterday';
			  }
			  this.formValidate.page = 1;
			  this.getList();
			  this.getStatistics()
			},
			// 监听页面宽度变化，刷新表格
			handleResize () {
			    if (this.infoList) this.$refs.visitChart.handleResize()
			},
			//分页
			pageChange(status) {
			  this.formValidate.page = status;
			  this.getList();
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/.ivu-form-label-left .ivu-form-item-label{width: 90px !important;text-align: right;}
	/deep/.ivu-select{width: 80%;}
	.top{display: flex;}
	.Box{background-color: #FFFFFF;margin-left: 0px !important;margin-right: 0px !important;padding-top: 20px;}
	.fonts{margin-bottom: 10px;font-weight: bold;}
	.ivu-form-item{margin-bottom: 0px !important;}
	.time{margin-right: 20px;}
</style>
