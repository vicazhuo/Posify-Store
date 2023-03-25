<template>
    <div v-resize="handleResize">
		<Card :bordered="false" dis-hover class="ivu-mt">
			<Form
			  ref="formValidate"
			  :model="formValidate"
			  :label-width="labelWidth"
			  :label-position="labelPosition"
			>
				<FormItem label="时间筛选："> 
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
					<Select v-model="formValidate.type" placeholder="请选择类型" clearable @on-change="searchs">
						<Option value="0">全部订单</Option>
						<Option value="7">充值订单</Option>
						<Option value="8">付费订单</Option>
						<Option value="9">收银订单</Option>
						<Option value="10">核销订单</Option>
						<Option value="11">配送订单</Option>
					</Select>
					<Select v-model="formValidate.staff_id" placeholder="请选择店员" clearable @on-change="searchs">
						<Option value="0">全部店员</Option>
						<Option :value ="item.value" v-for="(item,index) in staff">{{item.label}}</Option>
						
					</Select>
				</FormItem>
			</Form>
		</Card>	
		<Row :gutter="24"  class="ivu-mt Box">
			<Col :xl="16" :lg="12" :md="24" :sm="24" :xs="24" class="cardpad">
				<echarts-from ref="userChart" :series="series"  :echartsTitle="inlie" :infoList="infoList" v-if="infoList" :yAxisData="yAxisData"></echarts-from>
			</Col>
			<Col :xl="8" :lg="12" :md="24" :sm="24" :xs="24" class="cardpad">
				<echarts-from ref="visitChart" :infoList="infoLists" :echartsTitle="circle"></echarts-from>
			</Col>
		</Row>
		<Card :bordered="false" dis-hover class="ivu-mt box">
			<div class="fonts">交易数据</div>
			<Table ref="selection" :columns="columns4" :data="tabList" :loading="loading"
			       no-data-text="暂无数据" highlight-row
			       no-filtered-data-text="暂无筛选结果">
						 <template slot-scope="{ row, index }" slot="user_nickname">
						 	 <span>{{row.uid?row.user_nickname:'游客'}}</span>
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
	import { mapState } from 'vuex';
	import {  storeFinanceflowApi } from '@/api/capital';
	import { staffStatisticsApi, staffStatisticsHeaderApi } from '@/api/staff'
	import { orderApi, userApi } from '@/api/index'//图表接口
	import echartsFrom from '@/components/echarts/index'
	export default {
		name: "achievement",
		components: { echartsFrom },
		data() {
			return{
				total: 0,
				loading:false,
				optionData:{},
				formValidate: {
				  type: "0",
				  staff_id: "0",
				  data: "yesterday",
				  page: 1,
				  limit: 20,
				},
				bing_data: [],
				bing_xdata: [],
				staff: [],
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
				inlie: 'inlies',
				columns4: [
				    {
				        title: '订单号',
				        key: 'link_id',
				        width: 200
				    },
				    {
				        title: '用户信息',
				        width: 120,
				        slot: 'user_nickname'
				    },
				    {
				        title: '实际支付',
				        key: 'pay_price',
				        minWidth: 80
				    },
					// {
					//     title: '交易金额',
					//     key: 'number',
					//     minWidth: 80
					// },
				    {
				        title: '订单类型',
				        key: 'type_name',
				        minWidth: 100
				    },
				    {
				        title: '支付方式',
				        key: 'pay_type_name',
				        minWidth: 100
				    },
					{
					    title: '店员名称',
					    key: 'staff_name',
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
		mounted(){
			this.staffApi()
			this.getList()
			this.getStatistics()
		},
		methods:{
			staffApi(){
				storeFinanceflowApi().then(res=>{
					this.staff = res.data
				})
			},
			getList(){
				this.loading = true
				staffStatisticsApi(this.formValidate).then(res=>{
					this.loading = false
					this.tabList = res.data.list
					this.total = res.data.count
				})
			},
			searchs(){
				this.getList()
				this.getStatistics()
				
			},
			// 统计
			getStatistics () {
				if(!this.formValidate.staff_id){
					this.formValidate.staff_id = 0
				}
				if(!this.formValidate.type){
					this.formValidate.type = 0
				}
			    staffStatisticsHeaderApi(this.formValidate).then(async res => {
					if(this.formValidate.staff_id == 0){
						this.infoList = res.data || {}
						this.infoLists = res.data || {}
						if(this.formValidate.staff_id == 0){
							this.series = [
							    {
							        data: res.data.series,
							        name: '金额（元）',
							        type: 'bar',
							        tooltip: true,
							        smooth: true,
							        symbol: 'none',
									barWidth : 20,
							        areaStyle: {
							            normal: {
							                opacity: 0.2
							            }
							        }
							    }
							]
						}else{
							this.series = [
							    {
							        data: res.data.series,
							        name: '金额（元）',
							        type: 'line',
							        tooltip: true,
							        smooth: true,
							        symbol: 'none',
									// barWidth : 20,
							        areaStyle: {
							            normal: {
							                opacity: 0.2
							            }
							        }
							    }
							];
						}
					}else{
						this.infoLists = res.data.bing || {}
						this.infoList = res.data.order || {}
						this.series = res.data.order.series || [],
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
					}
			        
					// this.bing_data = res.bing_data;
					// this.bing_xdata = res.bing_xdata;
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
			  if (this.infoList && this.series.length !== 0) this.$refs.userChart.handleResize();
			  if (this.infoList) this.$refs.visitChart.handleResize();
			},
			//分页
			pageChange(status) {
			  this.formValidate.page = status;
			  this.getList();
			},
			beforeDestroy () {
			    if (this.visitChart) {
			        this.visitChart.dispose();
			        this.visitChart = null;
			    }
			}
		}
	}
</script>

<style scoped lang="less">
	// @media (min-width: 1200px)
	/deep/.ivu-col-span-xl-6 {
	    display: block;
	    flex: 0 0 25%;
	    max-width: 20%;
	}
	/deep/.ivu-select{width: 20%;margin-left: 15px;}
	.Box{background-color: #FFFFFF;margin: 0px !important;margin-top: 15px !important;padding-right: 10px !important; padding-top: 5px !important;}
	.box{padding-bottom: 10px;}
	.fonts{margin-bottom: 10px;font-weight: bold;}
	.ivu-form-item{margin-bottom: 0px !important;}
	.time{margin-right: 20px;}
	.cardpad{padding: 0px !important;padding-right: 10px;}
</style>
