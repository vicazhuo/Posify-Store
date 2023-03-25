<template>
	<div>
		<Drawer :closable="false" width="1000" class-name="order_box" v-model="modals" :styles="{ padding: 0 }">
		    <div v-if="orderDatalist">
		        <div class="head">
		            <div class="full">
		                <Icon :class="{ 'sale-after': orderDatalist.orderInfo._status._type === -1 }" custom="iconfont icondingdan" size="60"/>
		                <div class="text">
		                    <div class="title">{{ orderData.pink_name || '售后订单' }}</div>
		                    <div>订单编号：{{ orderDatalist.orderInfo.order_id }}</div>
		                </div>
		                <div v-if="rowActive.delete_time == null">
		                    <Button v-if="orderData._status_new === 1 && orderData.paid === 0 && orderData.pay_type === 'offline'" @click="changeMenu('1')">立即支付</Button>
							<Button v-if="orderData._status_new == 1" @click="edit">编辑</Button>
		                    <Button v-if="(orderData._status_new === 2 || orderData._status_new === 8 || orderData.status === 4) && orderData.shipping_type === 3 && (orderData.pinkStatus === null || orderData.pinkStatus === 2)" @click="sendOrder">发送货</Button>
		                    <Button v-if="orderData._status_new === 4" @click="delivery">配送信息</Button>
		                    <Button v-if="orderData.shipping_type == 2 && (orderData.status == 0 || orderData.status == 5) && orderData.paid == 1 && orderData.refund_status === 0" @click="bindWrite">立即核销</Button>
		                    <Button v-if="orderData._status_new >= 2" @click="changeMenu('10')">小票打印</Button>
							<Button v-if="orderData._status_new >= 3 && orderData.express_dump" @click="changeMenu('11')">电子面单打印</Button>
		                    <Button v-if="
		                ([1, 2, 5].includes(orderData.refund_type) &&
		                (parseFloat(orderData.pay_price) >
		                  parseFloat(orderData.refunded_price) ||
		                  orderData.pay_price == 0)) && !formType
		              " @click="changeMenu('5')">{{orderData.refund_type == 2 ? "同意退货" : "立即退款"}}</Button>
		                    <Button v-if="[1, 2].includes(orderData.refund_type)" @click="changeMenu('7')">不退款</Button>
							<Button v-if="!formType" @click="changeMenu('4')">售后备注</Button>
		                    <Button v-if="orderData.is_del == 1" @click="changeMenu('9')">删除订单</Button>
		                    <Dropdown @on-click="changeMenu" v-if="orderData._status_new !== 1 && formType">
		                        <Button icon="ios-more"></Button>
		                        <DropdownMenu slot="list">
		                            <DropdownItem v-if="orderData._status_new !== 1 || (orderData._status_new === 3 && orderData.use_integral > 0 && orderData.use_integral >= orderData.back_integral)" name="4">订单备注</DropdownItem>
		                            <DropdownItem v-if="(orderData.refund_type == 0 || orderData.refund_type == 1 || orderData.refund_type == 5) && orderData.paid == 1 && orderData.refund_status !== 2 && parseFloat(orderData.pay_price) > 0" name="5">立即退款</DropdownItem>
		                            <DropdownItem v-if="orderData._status_new === 4" name="8">已收货</DropdownItem>
		                        </DropdownMenu>
		                    </Dropdown>
		                </div>
		            </div>
		            <ul class="list">
		                <li class="item">
		                    <div class="title">订单状态</div>
							<div v-if="!formType">
								<div v-if="orderData.refund_type == 1" class="value1">仅退款</div>
								<div v-else-if="orderData.refund_type == 2" class="value1">退货退款</div>
								<div v-else-if="orderData.refund_type == 3" class="value1">拒绝退款</div>
								<div v-else-if="orderData.refund_type == 4" class="value1">商品待退货</div>
								<div v-else-if="orderData.refund_type == 5" class="value1">退货待收货</div>
								<div v-else-if="orderData.refund_type == 6" class="value2">已退款</div>
							</div>
							<div class="value1" v-else>
							  <span v-html="orderData.status_name.status_name"></span>
							  <span v-if="!orderData.is_all_refund && orderData.refund.length">,部分退款中</span>
							  <span v-if="orderData.is_all_refund && orderData.refund.length && orderData.refund_type != 6">,退款中</span>
							</div>
		                    <!-- <div v-if="orderDatalist.orderInfo.is_del" class="value4">{{ orderDatalist.orderInfo._status._title }}</div>
		                    <template v-else>
		                        <div v-if="orderDatalist.orderInfo._status._type === -1" class="value5">{{ orderDatalist.orderInfo._status._title }}</div>
		                        <div v-else-if="orderDatalist.orderInfo._status._type < 4 || orderDatalist.orderInfo._status._type === 9" class="value1">{{ orderDatalist.orderInfo._status._title }}</div>
		                        <div v-else-if="orderDatalist.orderInfo._status._type === 4" class="value2">{{ orderDatalist.orderInfo._status._title }}</div>
		                        <div v-else-if="orderDatalist.orderInfo._status._type === 5" class="value3">{{ orderDatalist.orderInfo._status._title }}</div>
		                    </template> -->
		                </li>
		                <li class="item">
		                    <div class="title">实际支付</div>
												<div>¥{{ orderDatalist.orderInfo.paid>0?orderDatalist.orderInfo.pay_price:0 }}</div>
		                </li>
						<li class="item" v-if="!formType">
						    <div class="title">退款件数</div>
						    <div>{{ orderDatalist.orderInfo.total_num || '-'}}</div>
						</li>
		                <li class="item" v-else>
		                    <div class="title">支付方式</div>
		                    <div>{{ orderDatalist.orderInfo._status._payType || '-'}}</div>
		                </li>
						<li class="item" v-if="!formType">
						    <div class="title">退款时间</div>
						    <div>{{ orderDatalist.orderInfo._refund_time || '-' }}</div>
						</li>
		                <li class="item" v-else>
		                    <div class="title">支付时间</div>
		                    <div>{{ orderDatalist.orderInfo._pay_time || '-' }}</div>
		                </li>
		            </ul>
		        </div>
		        <Tabs v-model="activeName">
		            <TabPane label="订单信息" name="detail">
						<div class="section" v-if="!formType">
							<div class="title">退款信息</div>
							<ul class="list">
							    <li class="item">
							        <div>退款原因：</div>
							        <div class="value">{{ orderDatalist.orderInfo.refund_reason || '-' }}</div>
							    </li>
							    <li class="item" v-if="parseFloat(orderDatalist.orderInfo.refund_price)">
							        <div>退款金额：</div>
							        <div class="value">{{ parseFloat(orderDatalist.orderInfo.refund_price) || 0 }}</div>
							    </li>
								<li class="item" v-if="parseFloat(orderDatalist.orderInfo.back_integral)">
								    <div>退回积分：</div>
								    <div class="value">{{ parseFloat(orderDatalist.orderInfo.back_integral) || '-' }}</div>
								</li>
								<li class="item">
								    <div>退款说明：</div>
								    <div class="value">{{ orderDatalist.orderInfo.refund_explain || '-' }}</div>
								</li>
								<li class="item">
								    <div>退款凭证：</div>
								    <div class="value">
										<div class="image" v-for="(img, i) in orderDatalist.orderInfo.refund_img" :key="i" v-viewer>
											<img v-lazy="img">
										</div>
									</div>
								</li>
							</ul>
						</div>
						<div class="section" v-if="!formType && orderDatalist.orderInfo.refund_express_name">
						    <div class="title">退货物流信息</div>
						    <ul class="list">
						        <li class="item">
						            <div>物流公司：</div>
						            <div class="value">{{ orderDatalist.orderInfo.refund_express_name || '-'}}</div>
						        </li>
						        <li class="item">
						            <div>物流单号：</div>
						            <div class="value">{{ orderDatalist.orderInfo.refund_express || '-'}}</div>
						        </li>
								<li class="item">
								    <div>联系电话：</div>
								    <div class="value">{{ orderDatalist.orderInfo.refund_phone || '-'}}</div>
								</li>
								<li class="item">
								    <div>退货说明：</div>
								    <div class="value">{{ orderDatalist.orderInfo.refund_goods_explain || '-'}}</div>
								</li>
								<li class="item">
								    <div>退货凭证：</div>
								    <div class="value">
										<div class="image" v-for="(img, i) in orderDatalist.orderInfo.refund_goods_img" :key="i" v-viewer>
											<img v-lazy="img">
										</div>
									</div>
								</li>
						    </ul>
						</div>
		                <div class="section">
		                    <div class="title">用户信息</div>
		                    <ul class="list">
		                        <li class="item">
		                            <div>用户昵称：</div>
		                            <div class="value">{{orderDatalist.userInfo.uid?orderDatalist.userInfo.nickname:'游客'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>绑定电话：</div>
		                            <div class="value">{{ orderDatalist.userInfo.phone || '-'}}</div>
		                        </li>
		                    </ul>
		                </div>
		                <div class="section">
		                    <div class="title">收货信息</div>
		                    <ul class="list">
		                        <!-- <li class="item">
		                            <div>用户昵称：</div>
		                            <div class="value">{{orderDatalist.userInfo.uid?orderDatalist.userInfo.nickname:'游客'}}</div>
		                        </li> -->
		                        <li class="item">
		                            <div>收货人：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.real_name || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>收货电话：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.user_phone || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>收货地址：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.user_address || '-'}}</div>
		                        </li>
		                    </ul>
		                </div>
		                <div class="section" v-if="orderDatalist.orderInfo.fictitious_content && orderDatalist.orderInfo.cartInfo[0].product_type !=1">
		                    <div class="title">虚拟发货</div>
		                    <ul class="list">
		                        <li class="item">
		                            <div class="value">{{ orderDatalist.orderInfo.fictitious_content }}</div>
		                        </li>
		                    </ul>
		                </div>
		                <div class="section" v-if="orderDatalist.orderInfo.cartInfo[0].product_type ==1">
		                    <div class="title">卡密发货</div>
							<div v-if='orderDatalist.orderInfo.virtual.length'>
								<div class="list" v-for="(item,index) in orderDatalist.orderInfo.virtual" :key='index'>
								    <div class="item">
								        <div>卡号{{index+1}}：</div>
								        <div class="value">{{item.card_no}}</div>
								    </div>
									<div class="item">
									    <div>密码{{index+1}}：</div>
									    <div class="value">{{item.card_pwd}}</div>
									</div>
								</div>
							</div>
							<ul class="list" v-else>
							    <li class="item">
							        <div class="value">{{ orderDatalist.orderInfo.virtual_info }}</div>
							    </li>
							</ul>
		                </div>
		                <div class="section">
		                    <div class="title">订单信息</div>
		                    <ul class="list">
		                        <li class="item">
		                            <div>创建时间：</div>
		                            <div class="value">{{ orderDatalist.orderInfo._add_time || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>商品总数：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.total_num || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>商品总价：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.total_price || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>优惠券金额：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.coupon_price || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>积分抵扣：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.deduction_price || 0.00 }}</div>
		                        </li>
		                        <li class="item" v-if="parseFloat(orderDatalist.orderInfo.use_integral)">
		                            <div>使用积分：</div>
		                            <div class="value">{{ parseFloat(orderDatalist.orderInfo.use_integral) }}</div>
		                        </li>
		                        <li class="item">
		                            <div>支付邮费：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.pay_postage || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>会员商品优惠：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.vip_true_price || 0.00 }}</div>
		                        </li>
								<li class="item" v-if="orderDatalist.orderInfo.shipping_type === 2 && orderDatalist.orderInfo.refund_status === 0 && orderDatalist.orderInfo.paid === 1">
								    <div>门店名称：</div>
								    <div class="value">{{orderDatalist.orderInfo._store_name || '-'}}</div>
								</li>
								<li class="item" v-if="orderDatalist.orderInfo.shipping_type === 2 && orderDatalist.orderInfo.refund_status === 0 && orderDatalist.orderInfo.paid === 1">
								    <div>核销码：</div>
								    <div class="value">{{orderDatalist.orderInfo.verify_code || '-'}}</div>
								</li>
		                        <li class="item">
		                            <div>推广人：</div>
		                            <div class="value">{{ orderDatalist.userInfo.spread_name }}/ID:{{ orderDatalist.userInfo.spread_uid }}</div>
		                        </li>
								<li class="item">
								    <div>支付时间：</div>
								    <div class="value">{{ orderDatalist.orderInfo._pay_time || '-'}}</div>
								</li>
								<li class="item">
								    <div>支付方式：</div>
								    <div class="value">{{ orderDatalist.orderInfo._status._payType || '-'}}</div>
								</li>
		                        <li class="item" v-if="orderDatalist.orderInfo.store_order_sn">
		                            <div>原订单号：</div>
		                            <div class="value">{{orderDatalist.orderInfo.store_order_sn }}</div>
		                        </li>
								<li class="item" v-for="(item,index) in orderDatalist.orderInfo.promotions_detail" :key="index">
									<div>{{item.title}}：</div>
									<div class="value">-￥{{parseFloat(item.promotions_price).toFixed(2)}}</div>
								</li>
		                    </ul>
		                </div>
						<div class="section" v-if="orderDatalist.orderInfo.delivery_type==='express'">
						    <div class="title">物流信息</div>
						    <ul class="list">
						        <li class="item">
						            <div>快递公司：</div>
						            <div class="value">{{orderDatalist.orderInfo.delivery_name || '-'}}</div>
						        </li>
								<li class="item">
								    <div>快递单号：</div>
								    <div class="value">{{orderDatalist.orderInfo.delivery_id}}<span class="logisticsLook" @click="openLogistics">查询</span></div>
								</li>
						    </ul>
						</div>
						<div class="section" v-if="orderDatalist.orderInfo.delivery_type==='send'">
						    <div class="title">配送信息</div>
						    <ul class="list">
						        <li class="item">
						            <div>送货人姓名：</div>
						            <div class="value">{{orderDatalist.orderInfo.delivery_name || '-'}}</div>
						        </li>
								<li class="item">
								    <div>送货人电话：</div>
								    <div class="value">{{orderDatalist.orderInfo.delivery_id || '-'}}</div>
								</li>
						    </ul>
						</div>
		                <div v-if="orderDatalist.orderInfo.custom_form.length" class="section">
		                    <div class="title">自定义留言</div>
		                    <ul class="list">
		                        <li v-for="(item, index) in orderDatalist.orderInfo.custom_form" :key="index" class="item" v-if="item.value">
		                            <div>{{ item.title }}：</div>
		                            <div v-if="item.label === 'img'" class="value">
		                                <div v-for="(img, i) in item.value" :key="i" class="image" v-viewer>
		                                    <img v-lazy="img">
		                                </div>
		                            </div>
		                            <div v-else class="value">{{ item.value || '-' }}</div>
		                        </li>
		                    </ul>
		                </div>
		                <div class="section" v-if="orderDatalist.orderInfo.mark">
		                    <div class="title">买家留言</div>
		                    <ul class="list">
		                        <li class="item">
		                            <div class="value">{{orderDatalist.orderInfo.mark}}</div>
		                        </li>
		                    </ul>
		                </div>
		                <div class="section" v-if="orderDatalist.orderInfo.remark">
		                    <div class="title">订单备注</div>
		                    <ul class="list">
		                        <li class="item">
		                            <div>备注：</div>
		                            <div class="value">{{ orderDatalist.orderInfo.remark || '-' }}</div>
		                        </li>
		                    </ul>
		                </div>
						<div class="section" v-if="orderDatalist.orderInfo.refuse_reason">
						    <div class="title">拒绝退款原因</div>
						    <ul class="list">
						        <li class="item">
						            <div class="value">{{ orderDatalist.orderInfo.refuse_reason }}</div>
						        </li>
						    </ul>
						</div>
		                <div v-if="orderDatalist.orderInfo.invoice" class="section">
		                    <div class="title">发票信息</div>
		                    <ul class="list">
		                        <li class="item">
		                            <div>发票类型：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.type | invoiceType}}</div>
		                        </li>
		                        <li class="item">
		                            <div>抬头类型：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.header_type | invoiceHeaderType}}</div>
		                        </li>
		                        <li class="item">
		                            <div>发票抬头：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.name || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>税号：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.duty_number || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>邮箱：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.email || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>开户银行：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.bank || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>企业地址：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.address || '-'}}</div>
		                        </li>
		                        <li class="item">
		                            <div>企业电话：</div>
		                            <div class="value">{{orderDatalist.orderInfo.invoice.drawer_phone || '-'}}</div>
		                        </li>
		                    </ul>
		                </div>
		            </TabPane>
		            <TabPane label="商品信息" name="product">
		                <Table :columns="columns1" :data="orderDatalist.orderInfo.cartInfo" border highlight-row>
		                    <template slot-scope="{ row }" slot="product">
		                        <div class="product">
		                            <div class="image" v-viewer>
		                                <img v-lazy="row.productInfo.attrInfo ? row.productInfo.attrInfo.image : row.productInfo.image">
		                            </div>
		                            <div class="title"><span class="font-color-red" v-if="row.is_gift">[赠品]</span>{{ row.productInfo.store_name }} | {{ row.productInfo.attrInfo ? row.productInfo.attrInfo.suk : '' }}</div>
		                        </div>
		                    </template>
		                </Table>
		            </TabPane>
		            <TabPane label="订单记录" name="record">
		                <Table :columns="columns2" :data="recordData" border :loading="loading" no-data-text="暂无数据" highlight-row   no-filtered-data-text="暂无筛选结果"></Table>
		            </TabPane>
		        </Tabs>
		    </div>
		</Drawer>
		<Modal v-model="modal2" scrollable title="物流查询"  width="350" class="order_box2">
		    <div class="logistics acea-row row-top" v-if="orderDatalist">
		        <div class="logistics_img"><img src="../../../../assets/images/expressi.jpg"></div>
		        <div class="logistics_cent">
		            <span>物流公司：{{orderDatalist.orderInfo.delivery_name}}</span>
		            <span>物流单号：{{orderDatalist.orderInfo.delivery_id}}</span>
		        </div>
		    </div>
		    <div class="acea-row row-column-around trees-coadd">
		        <div class="scollhide">
		            <Timeline>
		                <TimelineItem v-for="(item,i) in result" :key="i">
		                    <p class="time" v-text="item.time"></p>
		                    <p class="content" v-text="item.status"></p>
		                </TimelineItem>
		            </Timeline>
		        </div>
		    </div>
		</Modal>
	</div>
</template>

<script>
    import { getExpress, getOrderRecord } from '@/api/order';
    export default {
        name: 'orderDetails',
        filters: {
            invoiceType: value => value == 1 ? '电子普通发票' : '纸质专用发票',
            invoiceHeaderType: value => value == 1 ? '个人' : '企业'
        },
        data () {
            return {
                modal2: false,
                modals: false,
                grid: {
                    xl: 8,
                    lg: 8,
                    md: 12,
                    sm: 24,
                    xs: 24
                },
                result: [],
                columns1: [
                    {
                        title: '商品信息',
                        slot: 'product',
                        align: 'center',
                        minWidth: 400
                    },
                    {
                        title: '价格',
                        key: 'truePrice',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'cart_num',
                        align: 'center'
                    },
                    {
                        title: '小计',
                        align: 'center',
                        render: (h, params) => {
							return h('div', params.row.truePrice * params.row.cart_num);
						}
                    }
                ],
                columns2: [
                    {
                        title: '订单ID',
                        key: 'oid',
                        align: 'center',
                        minWidth: 40
                    },
                    {
                        title: '操作记录',
                        key: 'change_message',
                        align: 'center',
                        minWidth: 280
                    },
                    {
                        title: '操作时间',
                        key: 'change_time',
                        align: 'center',
                        minWidth: 100
                    }
                ],
                recordData: [],
								activeName:'detail',
								orderData:{}
            }
        },
        props: {
            orderDatalist: Object,
            orderId: Number,
            rowActive: Object,
			formType: {
			  type: Number,
			  default: 0,
			}
        },
        watch: {
			orderDatalist (value) {
				console.log('dhfgdf',value.orderInfo)
				this.orderData = value.orderInfo;
				this.getList( !this.formType?value.orderInfo.store_order_id:value.orderInfo.id);
			}
		},
        methods: {
            openLogistics () {
				this.modal2 = true;
                this.getOrderData()
            },
            // 获取订单物流信息
            getOrderData () {
                getExpress(!this.formType?this.orderDatalist.orderInfo.store_order_id:this.orderDatalist.orderInfo.id).then(async res => {
                    this.result = res.data.result;
                }).catch(res => {
                    this.$Message.error(res.msg);
                })
            },
            getList (id) {
                let data = {
                    id: id,
                    datas: this.page
                }
                this.loading = true;
                getOrderRecord(data).then(async res => {
                    this.recordData = res.data;
                    this.loading = false;
                }).catch(res => {
                    this.loading = false;
                    this.$Message.error(res.msg);
                })
            },
            changeMenu (value) {
                this.$parent.changeMenu(this.rowActive, value);
            },
			edit(){
				this.$parent.edit(this.rowActive);
			},
            sendOrder () {
                this.$parent.sendOrder(this.rowActive);
            },
            delivery () {
                this.$parent.delivery(this.rowActive);
            },
            bindWrite () {
                this.$parent.bindWrite(this.rowActive);
            }
        },
        computed: {
        }
    }
</script>

<style scoped lang="stylus">
    .ivu-description-list-title {
        margin-bottom: 16px;
        color: #17233d;
        font-weight: 500;
        font-size: 14px;
    }
	.logisticsLook{
		font-size 13px;
		margin-left 10px;
		color #1890FF;
		cursor pointer;
	}
	.value{
		word-break:break-all
	}
	/deep/.ivu-icon-ios-more {
		font-size 20px;
	}
    .logistics
        align-items: center
        padding: 10px 0px
        .logistics_img
            width 45px
            height 45px
            margin-right: 12px
            img
             width 100%
             height 100%
        .logistics_cent
            span
              display block
              font-size 12px
    .trees-coadd
        width: 100%;
        height: 400px;
        border-radius: 4px;
        overflow: hidden;
        .scollhide
            width: 100%;
            height: 100%;
            overflow: auto;
            margin-left: 18px;
            padding: 10px 0 10px 0;
            box-sizing: border-box;
            .content
              font-size 12px
            .time
              font-size 12px
              color: #2d8cf0
.order_box2
   position absolute
   z-index 999999999
.order_box >>> .ivu-modal-header
   padding 30x 16px !important
.order_box >>> .ivu-card
    font-size 12px !important
.fontColor1 >>> .ivu-description-term
    color red !important
.fontColor1 >>> .ivu-description-detail
    color red !important
    padding-bottom 14px !important
.fontColor2 >>> .ivu-description-detail
    color #733AF9 !important
.order_box >>> .ivu-description-term
    padding-bottom 10px !important
.order_box >>> .ivu-description-detail
    padding-bottom 10px !important
.order_box >>> .ivu-modal-body
    padding: 0 !important
.fontColor3 >>> .ivu-description-term
    color #f1a417 !important
.fontColor3 >>> .ivu-description-detail
    color #f1a417 !important

.tabBoxPic
    width 50px
    height 50px
    display inline-block
    vertical-align top
    margin-right 6px
.tabBox_img
    width 100%
    height 100%
    border-radius:4px
    cursor pointer
    img
       width 100%
       height 100%
       padding 2px

>>> .order_box

    .head
        padding 30px 35px 25px

        .full
            display flex

            .iconfont
                color #1890FF

                &.sale-after {
                    color #90ADD5
                }

            .text
                align-self center
                flex 1
                min-width 0
                padding-left 12px
                border 0
                font-size 13px
                line-height 13px
                color #606266

                .title
                    margin-bottom 10px
                    font-weight 500
                    font-size 16px
                    line-height 16px
                    color rgba(0, 0, 0, 0.85)

            .ivu-btn
                margin-left 12px

                &:first-child
                    display inline-block
                    border-color #1890FF
                    margin-left 0
                    background-color #1890FF
                    color #FFFFFF
                
                &:nth-child(2)
                    display inline-block
                    border-color #19BE6B
                    background-color #19BE6B
                    color #FFFFFF

                &:nth-child(3)
                    display inline-block

                &:focus
                    box-shadow none
            
            .ivu-dropdown
                margin-left 12px

                &:nth-child(n+5)
                    display inline-block

                .ivu-btn
                    border-color #DCDEE2
                    background-color #FFFFFF
                    color #515A6E

        .list
            display flex
            margin-top 20px
            overflow hidden
            list-style none

            .item
                flex none
                width 200px
                font-size 14px
                line-height 14px
                color rgba(0, 0, 0, 0.85)

                .title
                    margin-bottom 12px
                    font-size 13px
                    line-height 13px
                    color #666666

                .value1
                    color #F56022

                .value2
                    color #1BBE6B

                .value3
                    color #1890FF

                .value4
                    color #6A7B9D

                .value5
                    color #F5222D

    .section
        padding 25px 0
        border-bottom 1px dashed #EEEEEE

        .title
            padding-left 10px
            border-left 3px solid #1890FF
            font-size 15px
            line-height 15px
            color #303133

        .list
            display flex
            flex-wrap wrap
            list-style none

        .item
            flex 0 0 calc(100% / 3)
            display flex
            margin-top 16px
            font-size 13px
			color #606266

            &:nth-child(3n+1)
                padding-right 20px

            &:nth-child(3n+2)
                padding-right 10px
                padding-left 10px

            &:nth-child(3n+3)
                padding-left 20px

        .value
            flex 1

            .image
                display inline-block
                width 40px
                height 40px
                margin 0 12px 12px 0
                vertical-align middle

            img
                width 100%
                height 100%

    .product
        display flex

        .image
            width 50px
            height 50px

        img
            width 100%
            height 100%
            border-radius 4px
        
        .title
            flex 1
            padding-left 13px
            text-align left

>>> .ivu-tabs
    color rgba(0, 0, 0, 0.85)

    .ivu-tabs-bar
        border-bottom 0
        margin-bottom 0
        background-color #F5F7FA

    .ivu-tabs-nav-container
        font-size 13px

    .ivu-tabs-nav-wrap
        margin-bottom 0

    .ivu-tabs-ink-bar
        display none

    .ivu-tabs-tab
        padding 7px 19px
        margin-right 0
        line-height 26px

    .ivu-tabs-tab-active
        background-color #FFFFFF
        color rgba(0, 0, 0, 0.85)

        &::before
            content ""
            position absolute
            top 0
            left 0
            width 100%
            height 2px
            background-color #1890FF

    .ivu-tabs-tabpane
        padding 25px 35px

        &:first-child
            padding 0 35px

>>> .ivu-table

	.ivu-table-header

		table
			border-top 0 !important

		th
			background-color #F7F7F7 !important
</style>
