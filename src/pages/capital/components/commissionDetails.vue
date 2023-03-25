<template>
    <div style="width: 100%">
        <Modal v-model="modals" scrollable footer-hide closable title="账单详情" :mask-closable="false" @on-cancel="cancel"
               width="950">
            <Divider dashed/>
            <Form ref="formValidate" :label-width="labelWidth" :label-position="labelPosition" class="tabform" @submit.native.prevent>
              <Row type="flex" :gutter="24">
					<Col v-bind="grid">
						<FormItem label="选择店员："  label-for="status1">
							<Select v-model="formValidate.staff_id" placeholder="请选择" clearable element-id="status1" @on-change="searchs">
								<Option :value ="item.value" v-for="(item,index) in staff">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col v-bind="grid">
						<FormItem label="订单搜索："  label-for="status1">
							<Input v-model="formValidate.keywork" placeholder="请输入交易单号/交易人" class="input"></Input>
						</FormItem>
					</Col>
					<Col>
						<div class="search" @click="searchs">搜索</div>
					</Col>
					<Col>
						<div class="reset" @click="reset">重置</div>
					</Col>
               </Row>
            </Form>
            <!-- <Divider dashed/> -->
            <Table :columns="columns" :data="tabList"
                   ref="table"
                   :loading="loading"
                   no-userFrom-text="暂无数据"
                   no-filtered-userFrom-text="暂无筛选结果"
                   class="table"
            >
				<template slot-scope="{ row, index }" slot="number">
					<span v-if="row.pm == 0" class="colorgreen">- {{row.number}}</span>
					<span v-if="row.pm == 1" class="colorred">+ {{row.number}}</span>
				</template>
				<template slot-scope="{ row, index }" slot="nickname">
					<span>{{ row.uid?row.user_nickname:'游客' }}</span>
				</template>
			</Table>
            <div class="acea-row row-right page">
                <Page :total="total" :current="formValidate.page" show-elevator show-total @on-change="pageChange"
                      :page-size="formValidate.limit"/>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {  storeFfundRecordInfoApi, storeFinanceflowApi } from '@/api/capital';
    import { mapState } from 'vuex';
    export default {
        name: 'commissionDetails',
        data () {
            return {
								grid: {
										xl: 7,
										lg: 7,
										md: 12,
										sm: 24,
										xs: 24
								},
                modals: false,
                detailsData: {},
                Ids: 0,
                loading: false,
								staff: [],
								ids: '',
               formValidate: {
				         ids: '',
                 staff_id: '',
                 keywork: "",
                 data: "",
                 page: 1,
                 limit: 10,
               },
                total: 0,
                columns: [
                    {
                    	title: '交易单号',
                    	key: 'order_id',
                    	minWidth: 80
                    },
                    {
                    	title: '关联订单',
                    	key: 'link_id',
                    	minWidth: 80
                    },
                    {
                    	title: '交易时间',
                    	key: 'trade_time',
                    	minWidth: 150
                    },
                    {
                    	title: '交易金额',
                    	slot: 'number',
                    	minWidth: 80
                    },
                    {
                    	title: '交易人',
                    	slot: 'nickname',
                    	ellipsis: true,  
                    	minWidth: 80
                    },
                    {
                    	title: '关联店员',
                    	key: 'staff_name',
                    	minWidth: 80
                    },
                    {
                        title: '交易类型',
                        key: 'type_name',
                        minWidth: 80
                    },
                    {
                        title: '支付方式',
                        key: 'pay_type_name',
                        minWidth: 80
                    },
                    {
                    	title: '备注',
                    	key: 'mark',
                    	minWidth: 120
                    }
                ],
                tabList: []

            }
        },
        computed: {
            ...mapState('store/layout', [
                'isMobile'
            ]),
            labelWidth () {
                return this.isMobile ? undefined : 80;
            },
            labelPosition () {
                return this.isMobile ? 'top' : 'left';
            }
        },
        mounted () {
			this.staffApi()
        },
        methods: {
			staffApi(){
				storeFinanceflowApi().then(res=>{
					this.staff = res.data
				})
			},
			searchs(){
				this.formValidate.page = 1
				this.getList(this.ids)
			},
            // 时间
            onchangeTime (e) {
                this.formValidate.start_time = e[0];
                this.formValidate.end_time = e[1];
            },
            // 列表
            getList (id) {
				this.ids = id
				this.formValidate.ids = id
                this.loading = true;
                storeFfundRecordInfoApi(this.formValidate).then(async res => {
                    let data = res.data;
                    this.tabList = data.list;
                    this.total = data.count;
                    this.loading = false;
                }).catch(res => {
                    this.loading = false;
                    this.$Message.error(res.msg);
                })
            },
            pageChange (index) {
                this.formValidate.page = index
                this.getList(this.ids);
            },
			reset(){
				this.formValidate = {
					ids: this.ids,
				  staff_id: '',
				  keywork: "",
				  data: "",
				  page: 1,
				  limit: 10,
				}
				this.getList(this.ids)
			},
			// 关闭按钮
			cancel() {
				this.formValidate = {
				 ids: '',
                 staff_id: '',
                 keywork: "",
                 data: "",
                 page: 1,
                 limit: 10
               }
			}
        }
    }
</script>

<style lang="less" scoped>
	.colorred{color: #ff5722;}
	.colorgreen{color: #009688;}
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
    .table {
        .ivu-table-default{
            overflow-y: auto;
            max-height: 350px;
        }
    }
    .dashboard-workplace {
        &-header {
            &-avatar {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                margin-right: 16px;
                font-weight: 600;
            }

            &-tip {
                width: 82%;
                display: inline-block;
                vertical-align: middle;

                &-title {
                    font-size: 13px;
                    color: #000000;
                    margin-bottom: 12px;
                }

                &-desc {
                    &-sp {
                        width: 33.33%;
                        color: #17233D;
                        font-size: 12px;
                        display: inline-block;
                    }
                }
            }

            &-extra {
                .ivu-col {
                    p {
                        text-align: right;
                    }

                    p:first-child {
                        span:first-child {
                            margin-right: 4px;
                        }

                        span:last-child {
                            color: #808695;
                        }
                    }

                    p:last-child {
                        font-size: 22px;
                    }
                }
            }
        }
    }
</style>
