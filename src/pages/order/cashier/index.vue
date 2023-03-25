<template>
	<div>
		<Card :bordered="false" dis-hover class="headerCard">
			<div class="header acea-row row-between-wrapper">
				<div class="title">
					<router-link :to="{ path: '/store/order/index' }" v-if="$route.query.isShow !=1">
					  <Button size="small" class="mr10">返回</Button>
					</router-link>
					收银台
					<!-- <span @click="ceshi">测试测试df</span> -->
				</div>
				<div class="right acea-row row-middle">
					<div class="pictrue"><img :src="storeInfos.avatar"></div>
					<div class="info">
						<span>{{storeInfos.account}}(ID: {{storeInfos.id}})</span>
					</div>
					<div class="storeBnt" @click="storeTap">切换店员</div>
				</div>
			</div>
		</Card>
		<div class="goodsCard acea-row row-between">
			<div class="conter">
				<Card :bordered="false" dis-hover class="ivu-mt cart" :style="'height:'+ clientHeight + 'px;'">
					<div class="acea-row">
						<div class="tourist" :style="'height:'+ clientHeight + 'px;'">
							<div class="item acea-row row-middle" :class="activeHangon == index?'on':''" v-for="(item,index) in hangData" :key="index" @click="hangDataTap(index,item)">
								<div class="pictrue">
									<img :src="item.avatar" v-if="item.uid">
									<img src="@/assets/images/yonghu.png" v-else>
								</div>
								<div class="name line1">{{item.uid?item.nickname:'游客'}}</div>
								<div class="iconfont iconguadan" v-if="!item.is_check"></div>
							</div>
						</div>
						<div class="acea-row row-between row-bottom">
							<div class="left">
								<div v-if="checkOut==0">
									<div class="title acea-row row-middle" v-if="userInfo">
										<div class="pictrue">
											<img :src="userInfo.avatar">
										</div>
										<div class="text">
											<div class="textCon line1"><span class="name">{{userInfo.nickname}}</span>[关联店员：{{storeInfos.account}}]</div>
											<div v-if="userInfo.uid"><span class="mr10" v-if="userInfo.phone">{{userInfo.phone}}</span><span class="balance">余额<span class="num">{{userInfo.now_money}}</span></span><span class="recharge" @click="rechargeBnt">充值</span><span class="balance">积分<span class="num">{{userInfo.integral}}</span></span></div>
										</div>
										<Dropdown trigger="click" class="switchs" @on-click="changeMenu($event)">
											<a href="javascript:void(0)">
											    切换会员
											  <Icon type="ios-arrow-down"></Icon>
											</a>
										  <DropdownMenu slot="list">
										    <DropdownItem name="1">选择用户</DropdownItem>
										    <DropdownItem name="2">游客</DropdownItem>
										  </DropdownMenu>
										</Dropdown>
									</div>
									<div class="listCon" :style="'height:'+ cartHeight + 'px;'">
										<div class="list">
											<div class="item acea-row row-middle" v-for="(item,index) in cartList" :key='index'>
												<div class="pictrue">
													<img v-if="item.productInfo.attrInfo" :src="item.productInfo.attrInfo.image">
													<img v-else :src='item.productInfo.image' />
												</div>
												<div class="text">
													<div class="name line1">{{item.productInfo.store_name}}</div>
													<div class="info" @click="cartAttr(item)" v-if="item.productInfo.attrInfo && item.productInfo.spec_type">
														{{item.productInfo.attrInfo.suk}}<span class="iconfont iconxiayi"></span>
													</div>
													<div class="info" v-else>默认</div>
													<div>¥ {{item.truePrice}}</div>
												</div>
												<div class="del" @click="delCart(item,index)">删除</div>

												<div class="cartBnt acea-row row-center-wrapper">
													<InputNumber :min="1" :max="item.branch_stock" v-model="item.cart_num" :editable="false" size="small"
														controls-outside @on-change="cartChange(item)"></InputNumber>
													<!--<div class="iconfont iconshangpinshuliang-jian"></div>-->
													<!--<input type="number" v-model="pp">-->
													<!--<div class="iconfont iconshangpinshuliang-jia"></div>-->
												</div>
											</div>
										</div>
										<div class="list">
											<div class="item acea-row row-middle" v-for="(item, index) in invalidList" :key="index">
												<div class="pictrue">
													<img v-if="item.productInfo.attrInfo" :src="item.productInfo.attrInfo.image">
													<img v-else :src='item.productInfo.image' />
												</div>
												<div class="text invalid">
													<div class="name line1">{{item.productInfo.store_name}}</div>
													<div class="info" v-if="item.productInfo.attrInfo">
														{{item.productInfo.attrInfo.suk}}<span class="iconfont iconxiayi"></span>
													</div>
													<div class="info" v-else>默认</div>
													<div class="end">该商品已失效</div>
												</div>
												<div class="del" @click="delCart(item,index,1)">删除</div>
											</div>
										</div>
										<div class="noCart acea-row row-center-wrapper" v-if="!invalidList.length && !cartList.length">
											<div>
												<div class="pictrue">
													<img src="@/assets/images/no-thing.png">
												</div>
												<div class="tip">购物车暂时无商品</div>
											</div>
										</div>
									</div>
								</div>
								<div v-else :style="'height:'+ (cartHeight+105) + 'px;'" style="padding-top: 15px;">
									<Form ref="lodgeFrom" :model="lodgeFrom" :label-width="100" @submit.native.prevent>
										<FormItem label="" :labelWidth="20" label-for="nickname">
											<Row>
												<Col>
												<Input v-model="lodgeFrom.keyword" placeholder="请输入用户名称/ID/手机号" element-id="nickname"
													style="width: 370px;" @on-search="storeSearch" search enter-button>
												</Input>
												</Col>
											</Row>
										</FormItem>
									</Form>
									<Table :loading="loading" highlight-row no-userFrom-text="暂无数据" no-filtered-userFrom-text="暂无筛选结果"
										ref="selection" :columns="columns" :data="tableHang" class="tableList">
										<template slot-scope="{ row, index }" slot="nickname">
											<div>{{row.uid?row.nickname:"游客"}}</div>
										</template>
										<template slot-scope="{ row, index }" slot="action">
											<a @click="billHang(row,index)">提单</a>
											<a @click="hangDel(row,index)" class="ml10">删除</a>
										</template>
									</Table>
									<div class="acea-row row-right page mr5">
										<Page :total="totalHang" size="small" show-total :current="lodgeFrom.page" @on-change="pageHangChange"
											:page-size="lodgeFrom.limit" />
									</div>
								</div>
								<div class="truePrice">实付：¥ <span
										class="num">{{priceInfo.payPrice?priceInfo.payPrice:0}}</span></div>
								<div class="footer">
									<div class="conInfo acea-row row-between-wrapper">
										<div>共计 {{cartSum}} 件，已优惠
											¥{{this.$computes.Add((this.$computes.Add(priceInfo.couponPrice,priceInfo.deductionPrice)),priceInfo.vipPrice) || 0}}
										</div>
										<div class="detailed" @click="discountCon" v-if="cartList.length">优惠明细 ></div>
									</div>
									<div class="pay acea-row row-between-wrapper" v-if="cartList.length">
										<div class="bnt" @click="payPrice('cash')">现金收款</div>
										<div class="bnt" @click="payPrice('')">微信/支付宝</div>
										<div class="bnt on" @click="payPrice('yue')" v-if="userInfo.uid && userInfo.now_money>=(priceInfo.payPrice || 0)">余额收款</div>
										<div class="bnt on bntUid" v-else>余额收款</div>
									</div>
									<div class="pay noCart acea-row row-between-wrapper" v-else>
										<div class="bnt">现金收款</div>
										<div class="bnt">微信/支付宝</div>
										<div class="bnt on">余额收款</div>
									</div>
								</div>
							</div>
							<div class="right">
								<div class="navTabs">
									<img :class="checkOut?'':'label01'" src="../../../assets/images/label01.png" @click="navTab(0)"/>
									<img class="label02" src="../../../assets/images/label02.png" @click="navTab(1)"/>
								</div>
								<div v-if="cartList.length">
									<div class="item" @click="lodgeTap" v-if="!checkOut">挂单</div>
									<div class="item" :class="integral?'on':''" @click="integralTap">
										积分
									</div>
									<div class="item" :class="coupon?'on':''" @click="couponTap">
										优惠券
										<span class="iconfont iconcha" v-if="coupon" @click.stop="closeCoupon"></span>
									</div>
									<div class="item" @click="changePrice">改价</div>
									<div class="item" @click="remarks">备注</div>
								</div>
								<div class="noCart" v-else>
									<div class="item" v-if="!checkOut">挂单</div>
									<div class="item">
										积分
									</div>
									<div class="item">优惠券</div>
									<div class="item">改价</div>
									<div class="item">备注</div>
								</div>
								<div class="item" @click="delAll" v-if="cartList.length || invalidList.length">
									清空
								</div>
								<div class="noCart" v-else>
									<div class="item">
										清空
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
			<div class="goods">
				<Card :bordered="false" dis-hover class="ivu-mt" :style="'height:'+ clientHeight + 'px;'">
					<Tabs :animated="false" v-model="currentTab">
						<TabPane label="扫码" name="1"></TabPane>
						<TabPane label="商品" name="2"></TabPane>
					</Tabs>
					<div class="smCode" v-if='currentTab==1'>
						<Input ref="goodsNum" v-model="codeNum" size="large" type="url" @input="inputSaoMa"
							placeholder="请点击输入框聚焦扫码" />
					</div>
					<div class="acea-row row-between" v-if="currentTab==2">
						<div class="goodsCon">
							<Input v-model="goodFrom.store_name" search enter-button placeholder="搜索商品名称/ID/唯一码"
								element-id="name" @on-search="orderSearch" class="input">
							<Select v-model="goodFrom.field_key" slot="prepend" style="width: 90px">
								<Option value="all">全部</Option>
								<Option value="store_name">商品名称</Option>
								<Option value="id">ID</Option>
								<Option value="bar_code">唯一码</Option>
							</Select>
							</Input>
							<div class="list acea-row" v-if="goodData.length" :style="'height:'+ goodsHeight + 'px;'">
								<div class="item" v-for="(item,index) in goodData" :key="index" @click="attrTap(item)">
									<div class="pictrue">
										<img :src="item.image">
									</div>
									<div class="text">
										<div class="name line1">{{item.store_name}}</div>
										<div class="stock">库存 {{item.stock}}</div>
										<div class="money">¥ {{item.price}}</div>
										<div class="iconfont iconxuanzhong6" v-if="item.cart_num"></div>
									</div>
								</div>
							</div>
							<div class="noGood acea-row row-center-wrapper" v-else>
								<div>
									<div class="pictrue">
										<img src="@/assets/images/no-thing.png">
									</div>
									<div class="tip">暂时无商品</div>
								</div>
							</div>
							<div class="acea-row row-right page" v-if="goodData.length">
								<Page :total="total" show-elevator show-total @on-change="pageChange"
									:page-size="goodFrom.limit" />
							</div>
						</div>
						<div class="goodClass acea-row row-center" :style="'height:'+ (Number(goodsHeight) + 87) + 'px;'">
							<div>
								<div class="item line1" :class="currentCate==index?'on':''" v-for="(item,index) in cateData"
									:key="index" @click="cateTap(item,index)">{{item.cate_name}}</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>

		<Modal v-model="modalUser" scrollable footer-hide closable title="用户列表" :mask-closable="false" width="900">
		  <userList ref="users" @getUserId="getUserId" v-if="modalUser"></userList>
		</Modal>
		<recharge ref="recharge" :userInfo="userInfo" @getSuccess="getSuccess"></recharge>
		<couponList ref="coupon" :uid='userInfo.uid' :cartList= 'cartList' @getCouponId="getCouponId" v-if="userInfo && cartList.length"></couponList>
		<storeList ref="store" @getStoreId="getStoreId" @getUserInfo='getUserInfo'></storeList>
		<productAttr ref='attrs' :attr="attr" :disabled="disabled" :isCart="isCart" @ChangeAttr='ChangeAttr' @goCat='goCat'></productAttr>
		<Modal v-model="modal" title="备注" footer-hide>
			<form-create v-model="fapi" :rule="rule" @on-submit="onSubmit" class="remark"></form-create>
		</Modal>
		<Modal v-model="modal2" title="订单改价" footer-hide @on-cancel="cancelPrice">
		   	<Form :model="formItem" :label-width="100">
				<FormItem label="订单改价：">
					<div class="acea-row">
						<div class="inputNum"><InputNumber :min="0" v-model="formItem.price" @on-change="tapPrice"></InputNumber>元</div>
						<div class="inputNum discount"><InputNumber :min="0" v-model="discountPrice" @on-change="tapDiscount"></InputNumber>%</div>
					</div>
				</FormItem>
				<FormItem label="改价后金额：">
					<div class="changePrice">¥<span class="price">{{formItem.price || 0}}</span></div>
				</FormItem>
				<div class="acea-row row-center-wrapper"><Button type="primary" class="buttonPrice" @click="onSubmit2">确认改价</Button></div>
			</Form>
<!-- 			<form-create v-model="fapi2" :rule="rule2" @on-submit="onSubmit2" class="remark"></form-create> -->
		</Modal>
		<Modal v-model="modalPay" footer-hide width='430px' class="modalPay" @on-cancel="modalPayCancel">
			<div class="payPage">
				<div class="header acea-row row-center-wrapper">
					<div class="pictrue"><img src="../../../assets/images/gold.png"></div>
					<div class="text">应收金额(元)</div>
				</div>
				<div class="money">¥<span class="num">{{priceInfo.payPrice?priceInfo.payPrice:0}}</span></div>
				<!-- <div class="tip acea-row row-center-wrapper">
					<Icon type="ios-alert" class="icon" />
					{{createOrder.pay_type=='yue'?'提示：使用扫码枪扫描用户个人中心二维码':'提示：引导用户扫描柜台二维码，注册登录后支付'}}
				</div> -->
				<Input ref="focusNum" v-model="payNum" size="large" type="url" @input="inputSaoMa" placeholder="请点击输入框聚焦扫码或输入编码号"
					style="margin-top: 16px;" />
				<div class="process">
					<div class="pictrue">
						<img src="../../../assets/images/process1.png" v-if="createOrder.pay_type=='yue'">
						<img src="../../../assets/images/process2.png" v-else>
					</div>
					<div class="list acea-row row-between-wrapper">
						<div class="item one">
							<div class="name">{{createOrder.pay_type=='yue'?'出示付款码':'扫描收银码'}}</div>
							<div>{{createOrder.pay_type=='yue'?'用户打开个人中心':'引导用户扫描'}}</div>
						</div>
						<div class="item two">
							<div class="name">{{createOrder.pay_type=='yue'?'扫描付款码':'完成支付'}}</div>
							<div>{{createOrder.pay_type=='yue'?'扫码枪':'用户线上支付'}}</div>
						</div>
						<div class="item three">
							<div class="name">确认收款</div>
							<div>收银台点击确认</div>
						</div>
					</div>
				</div>
				<!-- <Button type="primary" class="bnt" @click="confirm">确认</Button> -->
			<!-- 	<div v-else>
					<Button type="primary" class="bnt" @click="confirmOrder" v-if="isOrderCreate">确认</Button>
					<Button type="primary" class="bnt" @click="confirm" v-else>创建订单</Button>
				</div> -->
			</div>
		</Modal>
		<Modal v-model="modalCash" footer-hide width='770px' class="cash" @on-cancel="cancel">
			<div class="cashPage acea-row">
				<div class="left">
					<div class="pictrue">
						<img src="../../../assets/images/gold.png">
					</div>
					<div class="text">应收金额(元)</div>
					<div class="money">¥<span class="num">{{priceInfo.payPrice?priceInfo.payPrice:0}}</span></div>
				</div>
				<div class="right">
					<div class="rightCon">
						<div class="top acea-row row-between-wrapper">
							<div>实际收款(元)</div>
							<div class="num">{{collection}}</div>
						</div>
						<div class="center acea-row row-between-wrapper">
							<div>需找零(元)</div>
							<div class="num"
								v-if="this.$computes.Sub(collection,priceInfo.payPrice?priceInfo.payPrice:0)>0">
								{{this.$computes.Sub(collection,priceInfo.payPrice?priceInfo.payPrice:0)}}
							</div>
							<div class="num" v-else>0</div>
						</div>
						<div class="bottom acea-row">
							<div class="item acea-row row-center-wrapper" :class="item=='.'?'spot':''"
								v-for="(item,index) in numList" :key='index' @click="numTap(item)">
								{{item}}
							</div>
							<div class="item acea-row row-center-wrapper" @click="delNum">
								<Icon type="ios-backspace" />
							</div>
						</div>
					</div>
					<Button type="primary" @click="cashBnt">确认</Button>
				</div>
			</div>
		</Modal>
		<Modal v-model="discount" title="优惠明细" footer-hide width='400'>
			<div class="discountCon">
				<div class="item acea-row row-between-wrapper">
					<div>会员优惠金额：</div>
					<div>{{priceInfo.vipPrice||0}}</div>
				</div>
				<div class="item acea-row row-between-wrapper">
					<div>优惠券金额：</div>
					<div>{{priceInfo.couponPrice||0}}</div>
				</div>
				<div class="item acea-row row-between-wrapper">
					<div>积分抵扣：</div>
					<div>{{priceInfo.deductionPrice||0}}</div>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
	import userList from '@/components/userList'
	import storeList from '@/components/storeList'
	import couponList from '@/components/couponList'
	import productAttr from './components/productAttr'
	import recharge from '@/components/recharge'

	import {
		cashierProduct,
		cashierCate,
		cashierUser,
		cashierCode,
		cashierCart,
		cashierDetail,
		cashierCartList,
		cashierCartNum,
		cashierchangeCart,
		cashierCartDel,
		cashierCompute,
		cashierCreate,
		cashierPay,
		postCashierSwitch,
		postCashierHang,
		getHangList,
		getHang,
		cashierHang
	} from '@/api/order';
	import {
		checkOrderApi
	} from '@/api/user';
	export default {
		name: 'index',
		components: {
			userList,
			storeList,
			productAttr,
			couponList,
			recharge
		},
		data() {
			return {
				formItem:{
					price:0
				},
				discountPrice:100,
				loading: false,
				totalHang:0,
				tableHang:[],
				activeHangon:-1,
				hangData:[],
				lodgeFrom:{
					keyword: "",
					page: 1,
					limit: 10
				},
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
											self.activeHangon = params.index;
											let data = {
												uid: params.row.uid
											}
											let touristId = params.row.tourist_uid;
											if(params.row.uid){
												this.userInfoData(data);
											}else{
												this.setUp(touristId);
											}
										},
									},
								}),
							]);
						},
					},
					{
						title: '用户',
						slot: 'nickname',
						minWidth: 70
					},
					{
						title: "订单金额",
						key: "price",
						minWidth: 70,
					},
					{
						title: "时间",
						key: "_add_time",
						minWidth: 70,
					},
					{
					  title: '操作',
					  slot: 'action',
					  minWidth: 100,
					  align: 'center'
					}
				],
				checkOut:0,
				modalUser: false,
				flag: true,
				goodFrom: {
					store_name: '',
					field_key: '',
					cate_id: '',
					page: 1,
					limit: 30,
					uid: 0,
					staff_id:0
				},
				total: 0,
				goodData: [],
				cateData: [],
				currentCate: 0, //分类的当前index；
				currentTab: '1',
				codeNum: '',
				payNum: '',
				userInfo: {},
				storeInfos: {}, //门店店员信息
				storeList: [], //门店列表
				attr: {
					productAttr: [],
					productSelect: {}
				},
				storeInfo: {}, //商品信息
				productValue: [],
				attrValue: '', //已选属性
				productId: 0, //产品id
				cartList: [],
				isCart: 0,
				cartInfo: { //更改属性所需参数
					cart_id: 0,
					product_id: 0,
					unique: ''
				},
				modal: false,
				fapi: {},
				rule: [{
					type: "input",
					field: "remarks",
					title: "备注",
					props: {
						type: "textarea",
						maxlength: 100,
						'show-word-limit':true
					},
				}],
				modal2: false,
				rule2: [{
					type: "InputNumber",
					field: "change_price",
					title: "实付款",
					value: 0,
					props: {
						min: 0,
					},
				}],
				integral: false, //是否使用积分
				coupon: false, //是否使用优惠券
				couponId:0,//优惠券id
				modalPay: false,
				cartSum: 0,
				priceInfo: {},
				createOrder: {
					remarks: '',
					change_price: 0,
					cart_id: [], // 购物车id
					userCode: '',
					is_price: 0,
					auth_code: ''
				},
				modalCash: false,
				numList: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'],
				collectionArray: [],
				collection: 0,
				isOrderCreate: 0,
				discount: false,
				payTape: '', // 支付方式
				orderId: '', //订单id
				clientHeight: 0,
				cartHeight: 0,
				goodsHeight: 0,
				invalidList: [],
				defaultcalc:false,
				orderSystem:{
					loadingMsg:null,
					timer:null
				},
				disabled:false, //阻止属性弹窗多次提交
				unchangedPrice:0
			}
		},
		created() {
			this.userInfo = JSON.parse(window.localStorage.getItem('cashierUser'));
			this.cateList();
			let that = this;
			//扫码枪扫码，针对纯数字
			// document.onkeydown = function(e) {
			// 	if (e.which == 13) {
			// 		if (that.payNum) {
			// 			console.log('klklk');
			// 			that.createOrder.userCode = that.payNum;
			// 		}
			// 		if (that.codeNum) {
			// 			console.log('klklk');
			// 			that.codeInfo({
			// 				bar_code: that.codeNum
			// 			})
			// 		}
			// 	}
			// };
		},
		mounted() {
			this.$nextTick(() => {
				this.$refs.goodsNum.focus();
				this.clientHeight = `${document.documentElement.clientHeight}` - 80; //获取浏览器可视区域高度
				this.cartHeight = `${document.documentElement.clientHeight}` - 387;
				this.goodsHeight = `${document.documentElement.clientHeight}` - 250;
				let that = this;
				window.onresize = function() {
					that.clientHeight = `${document.documentElement.clientHeight}` - 80;
					that.cartHeight = `${document.documentElement.clientHeight}` - 387;
					that.goodsHeight = `${document.documentElement.clientHeight}` - 250;
				}
			});
		},
		methods: {
			tapDiscount(){
				this.formItem.price = this.$computes.Mul(this.unchangedPrice||0,(this.discountPrice/100) || 0) || 0
			},
			tapPrice(){
				let num = this.$computes.Div(this.formItem.price||0,this.unchangedPrice||0);
				this.discountPrice =(num*100).toFixed(2) || 0;
			},
			cancelPrice(){
				this.formItem.price = this.priceInfo.payPrice||0;
				this.tapPrice();
			},
			getSuccess(e){
				let money = this.$computes.Add(this.userInfo.now_money,e);
				this.userInfo.now_money = money;
				let storage = window.localStorage;
				storage.setItem("cashierUser",JSON.stringify(this.userInfo));
			},
			clear() {
				this.priceInfo.couponPrice = 0;
				this.priceInfo.payPrice = 0;
				this.priceInfo.deductionPrice = 0;
				this.priceInfo.totalPrice = 0;
				this.priceInfo.vipPrice = 0;
				this.cartList = [];
				this.cartSum = 0;
				this.collection = 0;
				this.collectionArray = [];
				this.createOrder.change_price = 0;
				this.createOrder.remarks = '';
				this.coupon = false;
				this.couponId = 0;
				this.integral = false;
				this.createOrder.is_price = 0;
			},
			cancel() {
				this.collection = 0;
				this.collectionArray = [];
			},
			// 挂单区删除
			hangDel(row,index){
				cashierHang(row.id).then(res=>{
					if(this.tableHang.length==1){
						this.lodgeFrom.page = 1;
						this.hangList();
					}
					
					else{
						this.tableHang.splice(index, 1);
						this.totalHang = this.totalHang - 1;
					}
					this.hangData[index].is_check = 1;
					this.$Message.success(res.msg);
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			// 点击左侧挂单
			hangDataTap(index,item){
				this.activeHangon = index;
				this.checkOut = 0;
				let touristId = item.tourist_uid;
				let data = {
					uid: item.uid
				}
				if(item.uid){
					this.userInfoData(data);
				}else{
					this.setUp(touristId);
				}
			},
			// 挂单列表
			hangList(){
				this.loading = true;
				let storeId = this.storeInfos.id;
				getHangList(storeId,this.lodgeFrom).then(res=>{
					this.loading = false;
					this.tableHang = res.data.data;
					this.totalHang = res.data.count;
				}).catch(err=>{
					this.loading = false;
					this.$Message.error(err.msg);
				})
			},
			pageHangChange(e){
				this.lodgeFrom.page = e;
				this.hangList();
			},
			// 提单；
			billHang(item,index){
				this.checkOut = 0;
				this.activeHangon = index;
				let touristId = item.tourist_uid;
				let data = {
					uid: item.uid
				}
				if(item.uid){
					this.userInfoData(data);
				}else{
					this.setUp(touristId);
				}
			},
			//快速挂单列表（最左侧的）
			hangDataList(){
				let storeId = this.storeInfos.id
				getHang(storeId).then(res=>{
					this.hangData = res.data;
					this.defaultSel();
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			//保存挂单
			lodgeTap(){
				let data = {
					cart_ids:this.createOrder.cart_id,
					uid:this.userInfo.uid || 0,
					tourist_uid:this.userInfo.touristId || '',
					staff_id:this.storeInfos.id,
					price:this.priceInfo.payPrice || 0
				}
				postCashierHang(data).then(res=>{
					this.activeHangon = -1;
					this.$Message.success(res.msg);
					this.hangDataList();
					this.hangList();
					this.setUp();
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			//搜索挂单
			storeSearch() {
				this.lodgeFrom.page = 1;
				this.hangList();
			},
			//默认选中
			defaultSel(type){
				let uid = this.userInfo.uid;
				let touristId = this.userInfo.touristId;
				if(uid){
					let flag = 0;
					this.hangData.forEach((item,index)=>{
						if(item.uid == uid){
							flag = 1;
						  this.activeHangon = index;
						}
					})
					if(!flag){
						this.activeHangon = -1;
					}
				}else{
					if(touristId){
						this.hangData.forEach((item,index)=>{
							if(item.tourist_uid == touristId){
								this.activeHangon = index;
							}
						})
					}
				}
			},
			// 结账区和挂单区的切换；
			navTab(e){
				this.checkOut = e;
				if(e==1){
					this.currentid = '';
					this.activeHangon = -1;
					this.clear();
					this.lodgeFrom.page = 1;
					this.hangList();
				}else{
					this.getCartList();
					this.defaultSel();
				}
			},
			// 充值
			rechargeBnt(){
				this.$refs.recharge.modal = true;
			},
			//点击出现优惠明细
			discountCon() {
				this.discount = true;
			},
			//现金收款创建订单并支付
			cashBnt() {
				if (this.isOrderCreate){
					this.getCashierPay('cash');
				} else {
					this.orderCreate();
				}
			},
			//清除计算机输入的数字
			delNum() {
				this.collectionArray.pop();
				this.collection = this.collectionArray.length ? this.collectionArray.join("") : 0;
			},
			//输入实际收款金额
			numTap(item) {
				if(this.defaultcalc === false){
					this.collection = '';
					this.defaultcalc = true;
				}
				this.collectionArray.push(item);
				this.collection = this.collectionArray.join("");
			},
			checkOrderTime(msg){
				let that = this;
				let num = 1;
				let timer = this.orderSystem.timer = setInterval(function(){
					that.confirmOrder(timer,msg);
					num++;
					if(num>=60){
						clearInterval(timer);
						msg();
						that.isOrderCreate = 1;
						that.$Message.success("支付失败");
					}
				},1000)
			},
			confirmOrder(timer,msg){
				let data = {
					order_id: this.orderId
				}
				checkOrderApi(3,data).then(res=>{
					if(res.data.status == true){
						 msg();
						clearInterval(timer);
						 this.isOrderCreate = 0;
						 this.$Message.success('支付成功');
						 this.goodList();
						 this.modalPay = false;
						 this.changePoints();
						 let storage = window.localStorage;
						 storage.setItem("cashierUser",JSON.stringify(this.userInfo));
						 this.clear();
					}
				}).catch(err=>{
					msg();
					this.$Message.error(err.msg)
				})
			},
			payPrice(payTape) {
				this.payTape = payTape;
				if (payTape == '' || payTape == 'yue') {
					this.createOrder.userCode = '';
					this.createOrder.auth_code = '';
					this.payNum = '';
					this.modalPay = true;
					let that = this;
					this.$nextTick(()=>{
					  this.$refs.focusNum.focus();
						document.onkeydown = function(e) {
							if (e.which == 13) {
								if (that.payNum) {
									that.createOrder.userCode = that.payNum;
									that.createOrder.auth_code = that.payNum;
									that.confirm();
								}
								if (that.codeNum) {
									that.codeInfo({
										bar_code: that.codeNum
									})
								}
							}
						};
					})
				} else if (payTape == 'cash') {
					this.modalCash = true;
					this.collection = this.priceInfo.payPrice?this.priceInfo.payPrice:0
					this.keyboard();
				}
				this.createOrder.integral = this.integral;
				this.createOrder.coupon = this.coupon;
				this.createOrder.coupon_id = this.couponId;
				if(this.coupon && !this.couponId) return this.$Message.error('请选择有效优惠券');
				this.createOrder.pay_type = payTape;
				this.createOrder.staff_id = this.storeInfos.id;
				this.fapi.resetFields();
			},
			// 线上支付和余额支付
			confirm() {
				if (this.payTape == 'yue') {
					// this.createOrder.userCode = this.payNum;
					if (!this.createOrder.userCode) {
						return this.$Message.error("请扫描个人中心二维码")
					}
					if (this.isOrderCreate){
						this.getCashierPay('yue');
					} else {
						this.orderCreate();
					}
				}else if(this.payTape == ''){
					// this.createOrder.auth_code = this.payNum;
					if (!this.createOrder.auth_code) {
						return this.$Message.error("请扫描您的付款码")
					}
					if (this.isOrderCreate){
						this.getCashierPay('');
					} else {
						this.orderCreate();
					}
				}
			},
			modalPayCancel(){
				this.$Message.destroy()
				if(this.orderSystem.timer){
					clearInterval(this.orderSystem.timer);
					this.orderSystem.timer = null
				}
			},
			getCashierPay(payType) {
				let data = {
					payType: payType,
					userCode:this.payNum,
					auth_code:this.payNum
				}
				if(payType == 'cash'){
					if(parseFloat(this.priceInfo.payPrice) > parseFloat(this.collection)){
						 return this.$Message.error("您付款金额不足")
					}
				}
				cashierPay(this.orderId, data).then(res => {
					this.payNum = '';
					if(res.data.status == 'SUCCESS'){
						this.isOrderCreate = 0;
						this.$Message.success('支付成功')
						this.modalCash = false;
						this.modalPay = false;
						this.changePoints();
						let storage = window.localStorage;
						storage.setItem("cashierUser",JSON.stringify(this.userInfo));
						this.clear();
						this.goodList();
					}else if(res.data.status == 'PAY_ING'){
						let msg = this.$Message.loading({
						    content: '等待支付中...',
						    duration: 0
						});
						this.orderSystem.loadingMsg = msg;
						this.orderId = res.data.order_id;
						this.checkOrderTime(msg);
						// this.confirmOrder();
					}else{
						this.isOrderCreate = 1;
						this.orderId = res.data.order_id;
						this.$Message.error(res.data.message);
					}
				}).catch(err => {
					this.payNum = '';
					this.$Message.error(err.msg)
				})
			},
			// 创建订单
			orderCreate() {
				if (this.payTape == 'cash'){
					if(parseFloat(this.priceInfo.payPrice) > parseFloat(this.collection)){
						 return this.$Message.error("您付款金额不足")
					}
				}
				this.createOrder.tourist_uid = this.userInfo.touristId;
				cashierCreate(this.userInfo.uid, this.createOrder).then(res => {
					let storage = window.localStorage;
					this.payNum = '';
					if (this.payTape == 'yue') {
						this.modalPay = false;
						this.payNum = '';
						this.createOrder.userCode = '';
						if (res.data.status == 'ORDER_CREATE') {
							this.isOrderCreate = 1;
							this.orderId = res.data.order_id;
							this.$Message.success(res.data.message);
						} else if(res.data.status == 'SUCCESS'){
							this.isOrderCreate = 0;
							this.$Message.success('支付成功');
							let money = this.$computes.Sub(this.userInfo.now_money,this.priceInfo.payPrice);
							this.userInfo.now_money = money;
							this.changePoints();
							storage.setItem("cashierUser",JSON.stringify(this.userInfo));
							this.goodList();
							this.clear();
						}else{
							this.isOrderCreate = 1;
							this.orderId = res.data.order_id;
							this.$Message.error(res.data.message);
						}
					}
					if (this.payTape == 'cash') {
						if (res.data.status == 'SUCCESS') {
							this.$Message.success('支付成功');
							// storage.removeItem("cashierUser");
							// this.userInfo = null;
							this.changePoints();
							storage.setItem("cashierUser",JSON.stringify(this.userInfo));
							this.goodList();
							this.modalCash = false;
							this.clear();
						}
					}
					if (this.payTape == '') {
						this.payNum = '';
						this.createOrder.auth_code = '';
						if(res.data.status == 'ORDER_CREATE'){
							this.isOrderCreate = 1;
							this.orderId = res.data.order_id;
							this.$Message.success(res.data.message);
						}else if(res.data.status == 'PAY_ING'){
							let msg = this.$Message.loading({
							    content: '等待支付中...',
							    duration: 0
							});
							this.orderId = res.data.order_id;
							this.checkOrderTime(msg);
						}else if(res.data.status == 'SUCCESS'){
							this.$Message.success('支付成功');
							// storage.removeItem("cashierUser");
							// this.userInfo = null;
							// this.setUp();
							this.changePoints();
							storage.setItem("cashierUser",JSON.stringify(this.userInfo));
							this.goodList();
							this.modalPay = false;
							this.clear();
						}else{
							this.isOrderCreate = 1;
							this.orderId = res.data.order_id;
							this.$Message.error(res.data.message);
						}
					}
				}).catch(err => {
					this.payNum = '';
					this.$Message.error(err.msg);
				})
			},
			//更新积分、更新左侧挂单、更新挂单（此函数支付成功调用）
			changePoints(){
				let usedIntegral = this.$computes.Sub(this.userInfo.integral,this.priceInfo.usedIntegral);
				this.userInfo.integral = usedIntegral;
				this.hangDataList();
				this.tableHang.forEach((item,index)=>{
					if(item.uid){
						if(this.userInfo.uid == item.uid){
							this.tableHang.splice(index, 1);
						}
					}else{
						if(this.userInfo.touristId == item.tourist_uid){
							this.tableHang.splice(index, 1);
						}
					}
				})
			},
			//计算金额
			cartCompute() {
				let ids = []
				this.cartList.forEach(item => {
					ids.push(item.id)
				})
				this.createOrder.cart_id = ids;
				let data = {
					integral: this.integral,
					coupon: this.coupon,
					coupon_id: this.couponId,
					cart_id: ids
				}
				cashierCompute(this.userInfo.uid, data).then(res => {
					this.priceInfo = res.data;
					this.unchangedPrice = this.priceInfo.payPrice || 0; 
					this.formItem.price = this.priceInfo.payPrice || 0; 
					this.tapPrice();
					//处理数据拿到总件数
					let num  = this.priceInfo.cartInfo.map(function(value,index){
						return value.cart_num
					})
					this.cartSum = num.reduce((count,v) => count+v, 0)

				}).catch(err => {
					this.$Message.error(err.msg)
					this.coupon = false;
				})
			},
			// 点击使用优惠券
			couponTap() {
				this.$refs.coupon.modals = true;
				this.$refs.coupon.currentid = this.couponId || 0;
				this.$refs.coupon.getList();
			},
			getCouponId(e){
				this.couponId = e.id;
				this.coupon = true;
				this.cartCompute();
			},
			closeCoupon(){
				this.coupon = false;
				this.couponId = 0;
				this.cartCompute();
			},
			// 是否使用积分
			integralTap() {
				this.integral = !this.integral
				this.cartCompute();
			},
			changePrice() {
				this.modal2 = true;
			},
			remarks() {
				// this.fapi.resetFields();
				this.modal = true;
			},
			// 提交备注
			onSubmit(formData) {
				this.createOrder.remarks = formData.remarks;
				// this.fapi.resetFields();
				this.modal = false;
			},
			onSubmit2() {
				if(this.formItem.price>=0 && this.formItem.price != null){
					this.priceInfo.payPrice = this.formItem.price;
					this.$Message.success('改价成功');
					this.createOrder.is_price = 1;
					this.createOrder.change_price = this.formItem.price;
					this.cancelPrice();
					this.modal2 = false;
				}else{
					return this.$Message.error('价格不能为空')
				}
			},
			// 删除
			del(ids, type, index, num) {
				this.$Modal.confirm({
					title: '删除该购物车',
					content: '<p>确定要删除该购物车吗？</p><p>删除该购物车后将无法恢复，请谨慎操作！</p>',
					onOk: () => {
						cashierCartDel(this.userInfo.uid, ids).then(res => {
							this.$Message.success('删除成功');
							this.goodList();
							if (type) {
								this.clear();
								this.invalidList = [];
								this.hangDataList();
							} else {
								if(num){
									this.invalidList.splice(index, 1);
								}else{
									this.cartList.splice(index, 1);
									if(this.cartList.length){
										this.cartCompute();
									}else{
										this.hangDataList();
										this.clear();
									}
								}
								// this.cartSum = this.cartSum - 1;
							}
						}).catch(err => {
							this.$Message.error(err.msg)
						})
					},
					onCancel: () => {}
				});
			},
			delAll() {
				let ids = []
				this.cartList.forEach(item => {
					ids.push(item.id)
				})
				this.invalidList.forEach(item => {
					ids.push(item.id)
				})
				this.del({
					'ids': ids
				}, 1)
			},
			delCart(item, index,num) {
				let ids = [];
				ids.push(item.id)
				this.del({
					'ids': ids
				}, 0, index,num)
			},
			// 点击切换属性
			cartAttr(item) {
				this.disabled = false;
				this.$refs.attrs.modals = true;
				this.isCart = 1;
				this.cartInfo.cart_id = item.id;
				this.cartInfo.product_id = item.product_id;
				this.goodsInfo(item.product_id);
			},
			// 加入购物车
			joinCart(num) {
				let that = this;
				if(num){
					let productSelect = that.productValue[this.attrValue];
					//如果有属性,没有选择,提示用户选择
					if (
						that.attr.productAttr.length &&
						productSelect === undefined
					) {
						return this.$Message.warning('产品库存不足，请选择其它');
					}
				}
				let uid = this.userInfo.uid;
				let data = {
					productId: this.productId,
					cartNum: 1,
					uniqueId: num?(this.attr.productSelect !== undefined ? this.attr.productSelect.unique : ""):'',
					staff_id: this.storeInfos.id,
					tourist_uid: this.userInfo.touristId
				}
				cashierCart(uid, data).then(res => {
					this.$refs.attrs.modals = false
					this.$Message.success('添加购物车成功');
					this.getCartList();
					this.goodList();
					this.hangDataList();
					this.disabled = true;
				}).catch(err => {
					this.$Message.error(err.msg)
				})
			},
			// 购物车加减
			cartChange(item) {
				let uid = item.uid;
				let data = {
					number: item.cart_num,
					id: item.id
				}
				cashierCartNum(uid, data).then(res => {
					this.cartCompute();
				}).catch(err => {
					this.$Message.error(err.msg)
				})
			},
			changeCartAttr() {
				this.cartInfo.unique = this.attr.productSelect !== undefined ? this.attr.productSelect.unique : "";
				cashierchangeCart(this.cartInfo).then(res => {
					this.disabled = true;
					this.$Message.success(res.msg);
					this.$refs.attrs.modals = false;
					this.getCartList();
					// this.cartList.forEach(res => {
					// 	if (res.id == this.cartInfo.cart_id) {
					// 		res.productInfo.attrInfo.suk = this.attrValue;
					// 		res.truePrice = this.attr.productSelect.price;
					// 	}
					// })
					this.cartCompute();
				}).catch(err => {
					this.$Message.error(err.msg)
				})
			},
			goCat(e) {
				if (e) {
					this.changeCartAttr();
				} else {
					this.joinCart(1);
				}
			},
			// 购物车列表
			getCartList() {
				let uid = this.userInfo.uid;
				let staffId = this.storeInfos.id;
				if (uid >= 0) {
					let data = {'tourist_uid':this.userInfo.touristId}
					cashierCartList(uid,staffId,data).then(res => {
						this.cartList = res.data.valid;
						this.invalidList = res.data.invalid;
						// this.cartSum = res.data.valid.length;
						if (res.data.valid.length) {
							this.cartCompute();
						}else{
							this.clear();
						}
					}).catch(err => {
						this.$Message.error(err.msg)
					})
				} else {
					this.$Message.error('请添加或选择用户');
				}
			},
			// 选择属性
			attrTap(item) {
				this.disabled = false;
				if (this.userInfo && this.userInfo.uid >= 0) {
					this.productId = item.product_id;
					let specType = item.product.spec_type;
					if(specType){
						this.isCart = 0; //判断切换属性或是加入购物车：0加入购物车；1切换属性
						this.$refs.attrs.modals = true;
						this.goodsInfo(item.product_id);
					}else{
						// 0为单规格属性
						this.joinCart(0);
					}
				} else {
					this.$Message.error('请添加或选择用户')
				}
			},
			// 商品详情
			goodsInfo(id) {
				cashierDetail(id, this.userInfo.uid).then(res => {
					let data = res.data;
					this.storeInfo = data.storeInfo;
					this.productValue = data.productValue;
					this.$set(this.attr, 'productAttr', data.productAttr);
					this.DefaultSelect();
				}).catch(err => {
					this.$Message.error(err.msg)
				})
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				for (var key in this.productValue) {
					if (this.productValue[key].stock > 0) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						break;
					}
				}
				//isCart 1为触发购物车 0为商品
				if (this.isCart) {
					//购物车默认打开时，随着选中的属性改变
					let attrValue = [];
					this.cartList.forEach(res => {
						if (res.id == this.cartInfo.cart_id) {
							attrValue = res.productInfo.attrInfo.suk.split(",");
						}
					})
					for (let i = 0; i < productAttr.length; i++) {
						this.$set(productAttr[i], "index", attrValue[i]);
					}
				} else {
					for (let i = 0; i < productAttr.length; i++) {
						this.$set(productAttr[i], "index", value[i]);
					}
				}
				//sort();排序函数:数字-英文-汉字；
				let productSelect = this.productValue[value.join(",")];
				if (productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", value.join(","));
				} else if (!productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
				} else if (!productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(
						this.attr.productSelect,
						"unique",
						this.storeInfo.unique || ""
					);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
				}
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if (productSelect && productSelect.stock > 0) {
					this.$set(this.attr.productSelect, 'image', productSelect.image);
					this.$set(this.attr.productSelect, 'price', productSelect.price);
					this.$set(this.attr.productSelect, 'stock', productSelect.stock);
					this.$set(this.attr.productSelect, 'unique', productSelect.unique);
					this.$set(this.attr.productSelect, 'cart_num', 1);
					this.$set(this.attr.productSelect, 'vip_price', productSelect.vip_price);
					this.$set(this, 'attrValue', res);
				} else {
					this.$set(this.attr.productSelect, 'image', this.storeInfo.image);
					this.$set(this.attr.productSelect, 'price', this.storeInfo.price);
					this.$set(this.attr.productSelect, 'stock', 0);
					this.$set(this.attr.productSelect, 'unique', '');
					this.$set(this.attr.productSelect, 'cart_num', 0);
					this.$set(this.attr.productSelect, 'vip_price', this.storeInfo.vip_price);
					this.$set(this, 'attrValue', '');
				}
			},
			storeTap() {
				this.$refs.store.modals = true
				this.$refs.store.cancel();
			},
			setUp(touristId){
				let timestamp = new Date().getTime();
				let userInfo = {
					avatar:require('@/assets/images/yonghu.png'),
					nickname:'游客',
					uid:0,
					touristId: touristId || timestamp
				}
				this.userInfo = userInfo;
				let storage = window.localStorage;
				storage.setItem("cashierUser", JSON.stringify(userInfo));
				this.getCartList();
				this.goodList();
			},
			// 选择用户
			changeMenu(name){
				if(name==1){
					this.setUser();
				}else{
					this.activeHangon = -1;
					this.clear();
					this.setUp();
				}
			},
			// 修改用户
			setUser() {
				this.modalUser = true
				this.$refs.users.currentid = 0
				// this.$refs.users.modals = true
				// this.$refs.users.cancel();
			},
			// 当前选中门店店员信息
			getStoreId(e) {
				this.clear();
				this.storeList.forEach(i => {
					if (i.id == e.id) {
						this.goodFrom.staff_id = e.id;
						this.storeInfos = i;
						this.getCartList();
						this.goodList();
						this.hangDataList();
						this.hangList();
					}
				})
			},
			// 门店店员信息以及门店店员列表
			getUserInfo(e) {
				this.storeInfos = e.users;
				this.storeList = e.storeList;
				this.goodFrom.staff_id = e.users.id;
				if (this.userInfo) {
					this.getCartList();
				}else{
					this.setUp();
				}
				this.goodList();
				this.hangDataList();
				this.hangList();
			},
			// 收银台切换购物车用户
			cashierSwitch(data){
				postCashierSwitch(data,this.storeInfos.id).then(res=>{
					console.log('jkjkj',res);
				}).catch(err=>{
					this.$Message.error(err)
				})
			},
			getUserId(e) {
				this.clear();
				this.modalUser = false;
				let data = {
					uid: e.uid
				}
				let dataSwitch = {
					uid:this.userInfo.touristId,
					to_uid:e.uid,
					is_tourist:1
				}
				this.cashierSwitch(dataSwitch);
				this.userInfoData(data)
			},
			// 获取收银台用户信息
			userInfoData(data) {
				cashierUser(data).then(res => {
					this.userInfo = res.data;
					let storage = window.localStorage;
					storage.setItem("cashierUser", JSON.stringify(res.data));
					this.getCartList();
					this.goodList();
					this.defaultSel(1);
				}).catch(err => {
					this.$Message.error(err)
				})
			},
			//扫码枪扫码，针对带有字母的
			inputSaoMa(e) {
				// setTimeout定时器的作用是，等待扫码枪输入完，拿到完整的二维码信息，再调接口（扫码枪输入速度大概8~20毫秒，手动输速度大概是80毫秒），否则拿不到完整的二维信息。
				let val = e
				if (val === '') return false
				clearTimeout(this.endTimeout)
				this.endTimeout = null
				this.endTimeout = setTimeout(() => {
					// if (this.payNum === val) {
					// 	clearTimeout(this.endTimeout)
					// 	if (val) {
					// 		this.createOrder.userCode = val;
					// 		this.createOrder.auth_code = val;
					// 		this.confirm();
					// 	}
					// }
					if (this.codeNum === val) {
						clearTimeout(this.endTimeout)
						if (val) {
							this.codeInfo({
								bar_code: val
							})
						}
					}
				}, 500)
			},
			codeInfo(data) {
				data.uid = this.userInfo ? this.userInfo.uid : 0;
				data.staff_id = this.storeInfos.id;
				data.tourist_uid = this.userInfo.touristId;
				if(this.userInfo == null){
					this.codeNum = '';
					return this.$Message.error("请添加或选择用户")
				}
				cashierCode(data).then(res => {
					this.codeNum = '';
					let data = res.data;
					if (data.hasOwnProperty('userInfo')) {
						// 用户 Object.keys(this.userInfo).length
						if (this.userInfo) {
							this.$Modal.confirm({
								title: '切换用户',
								content: '<p>确定要切换用户吗？</p>',
								onOk: () => {
									this.userInfo = res.data.userInfo;
									let storage = window.localStorage;
									storage.setItem("cashierUser", JSON.stringify(res.data.userInfo));
									this.getCartList();
								},
								onCancel: () => {}
							});
						} else {
							this.userInfo = res.data.userInfo;
							let storage = window.localStorage;
							storage.setItem("cashierUser", JSON.stringify(res.data.userInfo));
						}
					}
					this.goodList();
					this.getCartList();
				}).catch(err => {
					this.codeNum = '';
					this.$Message.error(err.msg)
				})
			},
			//点击分类
			cateTap(item, index) {
				this.currentCate = index;
				this.goodFrom.cate_id = item.id;
				this.goodFrom.page = 1;
				this.goodList();
			},
			//分类列表
			cateList() {
				cashierCate().then(res => {
					let all = {
						cate_name: '全部商品',
						id: ''
					};
					res.data.unshift(all)
					this.cateData = res.data;
				}).catch(err => {
					this.$Message.error(err)
				})
			},
			//商品列表
			goodList() {
				this.goodFrom.uid = this.userInfo ? this.userInfo.uid : 0;
				cashierProduct(this.goodFrom).then(res => {
					let data = res.data;
					this.total = data.count;
					this.goodData = data.list;
				}).catch(err => {
					this.$Message.error(err);
				})
			},
			//搜索
			orderSearch() {
				this.goodFrom.page = 1;
				this.goodList();
			},
			pageChange(e) {
				this.goodFrom.page = e;
				this.goodList();
			},
			// 监听键盘函数
			keyboard(){
				let that = this;
				function delNums (item) {
					that.collectionArray.pop();
					that.collection = that.collectionArray.length ? that.collectionArray.join("") : 0;
				};
				function numTaps (item) {
					if(that.defaultcalc === false){
						that.collection = '';
						that.defaultcalc = true;
					}
					that.collectionArray.push(item);
					that.collection = that.collectionArray.join("");
				};
				document.onkeydown = function(event){
					let e = event || window.event;
					let key = e.keyCode;
					if(that.modalCash){
						event.stopPropagation(); // 阻止事件冒泡传递
						event.preventDefault(); //阻止默认事件原有功能
					}
					switch (key){
						case 96:
						case 48:
					    	numTaps(0)
						    break;
						case 97:
						case 49:
						    numTaps(1)
						    break;
						case 98:
						case 50:
						    numTaps(2)
						    break;
						case 99:
						case 51:
						    numTaps(3)
						    break;
						case 100:
						case 52:
						    numTaps(4)
						    break;
						case 101:
						case 53:
						    numTaps(5)
						    break;
						case 102:
						case 54:
						    numTaps(6)
						    break;
						case 103:
						case 55:
						    numTaps(7)
						    break;
						case 104:
						case 56:
						    numTaps(8)
						    break;
						case 105:
						case 57:
						    numTaps(9)
						    break;
						case 110:
						    numTaps('.')
						    break;
						case 190:
						    numTaps('.')
						    break;
						case 8:
						    delNums()
						    break;
					}
				}
			}
		}
	}
</script>

<style scoped lang="stylus">
	::-webkit-scrollbar-thumb {
		-webkit-box-shadow: inset 0 0 6px #ccc;
	}

	::-webkit-scrollbar {
		width: 2px !important;
		/*对垂直流动条有效*/
	}
	
	.inputNum{
		width 210px;
		border-radius: 4px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		&.discount{
			width 130px;
			margin-left 8px;
			/deep/.ivu-input-number{
				border:0!important
				width 105px;
			}
		}
		/deep/.ivu-input-number{
			border:0!important
			width 187px;
		}
		/deep/.ivu-input-number-focused{
			box-shadow unset!important;
		}
		/deep/.ivu-input-number-handler-wrap{
			display none
		}
	}
	
	.changePrice{
		font-size 12px;
		color #E93323;
		.price{
			font-size 17px;
			margin-left 5px;
		}
	}
	
	.buttonPrice{
		width 460px;
		height 36px;
		margin-top 50px;
	}

	.tableList{
		/deep/.ivu-table-header table{
			border-top:0!important;
		}
		/deep/.ivu-table th, /deep/.ivu-table td{
			border-bottom 0!important;
			height 34px!important;
		}
		/deep/.ivu-table-cell{
			padding 0!important
		}
		/deep/.ivu-table th{
			color #999999;
		}
	}
	.left{
		/deep/.ivu-form-item{
			margin-bottom 12px!important;
		}
	}

	.header .ivu-btn{
		width: 56px;
		height: 28px;
		border-radius: 4px;
		border: 1px solid #FFFFFF;
		background-color unset!important;
		color #fff;
		&:hover{
			border-color #ccc;
			color #ccc;
		}
	}

	.headerCard{
		background: #1890FF;
		border-radius 0!important;
	}

	.remark {
		/deep/.ivu-input-wrapper {
			width: 91% !important;
		}

		/deep/.ivu-input-number {
			width: 91% !important;
		}

		/deep/.ivu-form-item-content {
			margin-left: 63px !important;
		}

		/deep/.ivu-form-item-label {
			width: 63px !important;
		}
	}

	.noCart{
		height 100%;
		.tip{
			text-align center;
			color #ccc;
		}
		.pictrue{
			width 308px;
			height 200px;
			img{
				width 100%;
				height 100%;
			}
		}
	}

	.goodsCard {
		max-width: 100%;
		min-width: 1100px;
	}

	.modalPay {
		/deep/.ivu-modal-body {
			padding: 0;
		}
	}

	.cash {
		/deep/.ivu-modal-body {
			padding: 0 !important;
		}
	}

	.discountCon {
		.item {
			font-size: 15px;
			margin-bottom: 10px;
		}
	}

	.cashPage {
		text-align: center;

		.right {
			width: 488px;
			background: #F5F5F5;
			padding: 16px 16px 16px 0;
			border-radius: 0 6px 6px 0;

			/deep/.ivu-btn-primary {
				width: 100px;
			}

			.rightCon {
				width: 388px;
				height: 506px;
				margin: 35px auto 20px auto;
				background-color: #fff;
				border-radius: 14px;

				.top {
					height: 80px;
					color: rgba(0, 0, 0, 0.65);
					font-size: 13px;
					padding: 0 20px;

					.num {
						font-size: 42px;
						color: rgba(0, 0, 0, 0.85);
					}
				}

				.center {
					width: 100%;
					height: 46px;
					background-color: #1890FF;
					font-size: 13px;
					color: #fff;
					padding: 0 20px;

					.num {
						font-size: 27px;
					}
				}

				.bottom {
					padding: 10px 0 0 8px;

					.item {
						width: 108px;
						height: 62px;
						background: #FAFAFA;
						border-radius: 9px;
						border: 1px solid rgba(0, 0, 0, 0.15);
						color: #1890FF;
						font-size: 32px;
						margin-left: 12px;
						margin-top: 12px;
						cursor: pointer;

						&.on {
							background: #1890FF;
							color: #FFFFFF;
							font-size: 20px;
						}

						&.spot {
							padding-bottom: 15px;
						}
					}
				}
			}
		}

		.left {
			width: 282px;
			padding: 16px 0 16px 16px;

			.pictrue {
				width: 110px;
				height: 110px;
				margin: 180px auto 0 auto;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.text {
				color: rgba(0, 0, 0, 0.45);
				font-size: 14px;
				margin-top: 14px;
			}

			.money {
				color: rgba(0, 0, 0, 0.85);
				font-size: 18px;

				.num {
					font-size: 32px;
					margin-left: 5px;
				}
			}
		}
	}

	.payPage {
		text-align: center;
		padding: 16px;

		/deep/.ivu-input {
			width: 394px !important;
			text-align: center;
		}

		.header{
			margin:35px 0 3px 0;
		}

		.process{
			width 394px;
			height 158px;
			border: 1px dashed #D8D8D8;
			border-top: 1px dashed #fff;
			margin: -1px auto 0 auto;
			&.on{
				border-top: 1px dashed #D8D8D8;
				margin-top: 20px;
				.list{
					 padding-left 14px!important
				}
			}
			.list{
				padding 6px 10px 0 3px;
				.item{
					font-size 12px;
					color #666;
					.name{
						color #333;
						font-size 13px;
						font-weight bold;
					}
				}
			}
			.pictrue{
				width 362px;
				height 68px;
				margin 24px auto 0 auto;
				img{
					width 100%;
					height 100%;
				}
			}
		}

		.pictrue {
			width: 18px;
			height: 18px;

			img {
				width: 100%;
				height: 100%;
			}
			margin-right 7px
		}

		.text {
			color: rgba(0, 0, 0, 0.45);
			font-size: 14px;
		}

		.money {
			font-size: 18px;
			color: rgba(0, 0, 0, 0.85);

			.num {
				font-size: 32px;
				margin-left: 5px;
			}
		}

		.tip {
			width: 310px;
			height: 26px;
			background: rgba(255, 126, 0, 0.1);
			border-radius: 13px;
			font-size: 13px;
			color: #FF7E00;
			margin: 10px auto 0 auto;

			.icon {
				font-size: 16px;
				margin-right: 5px;
			}
		}

		.bnt {
			width: 394px;
			height 38px;
			margin: 28px 0 15px 0;
		}
	}

	.goods {
		flex: auto;
		margin-right: 15px;
		width: calc(100% - 672px);

		/deep/.ivu-card-body {
			padding: 10px 0 16px 0 !important;
		}

		.smCode {
			padding: 0 16px;

			/deep/.ivu-input-large {
				height: 350px !important;
				text-align: center;
				font-size: 20px !important;
			}
		}

		.goodsCon {
			flex: auto;
			padding-left: 16px;
			width: calc(100% - 100px);

			/deep/.ivu-input-group {
				.ivu-input {
					text-align: center;
				}
			}

			.input {
				padding-right: 16px;
			}

			.page {
				padding-right: 16px;
			}

			.noGood {
				margin-top: 30px;

				.pictrue {
					width: 414px;
					height: 304px;
				}

				img {
					width: 100%;
					height: 100%;
				}

				.tip {
					font-size: 15px;
					text-align: center;
					color #ccc;
				}
			}

			.list {
				overflow-x: hidden;
				overflow-y: auto;
				.item {
					width: 152px;
					height: 238px;
					background: #FAFAFA;
					margin: 16px 16px 0 0;
					position: relative;
					cursor: pointer;

					.pictrue {
						width: 100%;
						height: 152px;

						img {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						padding: 8px 10px 0 10px;

						.iconfont {
							position: absolute;
							color: #1890FF;
							font-size: 20px;
							right: 5px;
							bottom: 5px;
						}

						.name {
							font-size: 16px;
							color: #000;
						}

						.stock {
							font-size: 13px;
							color: #999999;
							margin: 2px 0;
						}

						.money {
							color: #F5222D;
							font-size: 16px;
						}
					}
				}
			}
		}

		.goodClass {
			width: 100px;
			border-left: 1px solid #F0F2F5;
			cursor: pointer;
			overflow-y:auto;

			.item {
				width: 82px;
				height: 38px;
				text-align: center;
				line-height: 38px;
				font-size: 14px;
				color: #000;

				&.on {
					background-color: #1890FF;
					color: #fff;
				}
			}
		}
	}

	.conter {
		margin-right: 10px;
		margin-left: 15px;

		/deep/.ivu-card-body {
			padding: 0 !important;
		}

		.cart {
			width: 632px;
			position relative;
			.tourist{
				// width 129px;
				padding-left: 13px;
				padding-top 15px;
				display inline-block;
				overflow-x hidden;
				overflow-y auto;
				cursor pointer;
				.item{
					width: 116px;
					height: 38px;
					background: #F7F7F7;
					border-radius 50px 0 0 50px;
					font-size: 12px;
					color: rgba(0, 0, 0, 0.85);
					position relative;
					padding-left 7px;
					margin-bottom 9px;
					.pictrue{
						width: 24px;
						height: 24px;
						border-radius 50%;
						margin-right 6px;
						img{
							width 100%;
							height 100%;
							border-radius 50%;
						}
					}
					.name{
						width 50px;
					}
					.iconfont{
						position absolute;
						top:0;
						font-size 26px;
						right 3px;
						color #FF7700;
					}
					&:hover{
						background: #FF7700;
						color #fff;
						.iconfont{
							color #fff;
						}
					}
					&.on{
						background: #FF7700;
						color #fff;
						.iconfont{
							color #fff;
						}
					}
				}
			}
			.right {
				width: 90px;
				.navTabs{
					position absolute;
					top:15px;
					cursor pointer;
					img{
						display block;
						width 40px;
						height 85px;
					}
					.label01{
						z-index:5;
						position relative;
					}
					.label02{
						margin-top -16px;
					}
				}
				.item {
					width: 72px;
					background: #F2F3F5;
					margin: 0 auto 13px auto;
					text-align: center;
					padding: 9px 0;
					cursor: pointer;
					position: relative;
					.iconfont{
						position absolute;
						font-size 20px;
						top:-9px;
						right -7px;
						color #bbb;
					}
					&:hover{
						background-color: #1890FF;
						color: #fff;
					}
				// 	&:nth-child(1) {
				// 		&:hover {
				// 			background-color: #1890FF;
				// 			color: #fff;
				// 		}
				// 	}

				// 	&:nth-child(3) {
				// 		&:hover {
				// 			background-color: #1890FF;
				// 			color: #fff;
				// 		}
				// 	}

				// 	&:nth-child(4) {
				// 		&:hover {
				// 			background-color: #1890FF;
				// 			color: #fff;
				// 		}
				// 	}

				// 	&:nth-child(5) {
				// 		&:hover {
				// 			background-color: #1890FF;
				// 			color: #fff;
				// 		}
				// 	}

					&.on {
						background-color: #1890FF;
						color: #fff;
					}
				}

				.noCart{
					.item{
						background #ccc;
						color #fff;
						cursor unset;

						&:nth-child(3) {
							&:hover {
								background-color: #ccc;
							}
						}

						&:nth-child(4) {
							&:hover {
								background-color: #ccc;
							}
						}

						&:nth-child(5) {
							&:hover {
								background-color: #ccc;
							}
						}

						&.on {
							background-color: #ccc;
						}
					}
				}
			}

			.left {
				width: 410px;
				border-right: 1px solid #eee;
				border-left: 1px solid #eee;

				.title {
					// border-bottom: 1px solid #D8D8D8;
					width: 376px;
					height: 76px;
					background: rgba(255, 119, 0, 0.05);
					border-radius: 4px;
					margin 15px auto;
					padding 0 12px;
					position relative;
					.pictrue{
						width 42px;
						height 42px;
						border-radius 50%;
						margin-right 8px;
						img{
							width 100%;
							height 100%;
							border-radius 50%;
						}
					}
					.switchs{
						color: #FF7700;
						cursor pointer;
						padding 7px 0;
						position absolute;
						right 19px;
						top:10px;
					}
					.text{
						font-size: 12px;
						font-weight 400;
						color: rgba(51, 51, 51, 0.85);
						.textCon{
							width 215px;
							margin-bottom 6px;
						}
						.balance{
							.num{
								font-weight: 600;
								color: #F5222D;
								// font-size 17px;
								margin-left 4px;
							}
						}
						.recharge{
							color: #1890FF;
							padding 8px 4px 8px 8px;
							cursor pointer;
						}
						.name{
							color: rgba(0, 0, 0, 0.85);
							font-size 14px;
							font-weight 600;
							margin-right 6px;
						}
					}
				}

				.footer {
					padding: 10px 17px 15px 17px;

					.conInfo {
						font-size: 14px;
						color: #000;

						.detailed {
							color: #999999;
							font-size: 14px;
							cursor: pointer;
						}
					}

					.pay {
						margin-top: 12px;

						.bnt {
							width: 120px;
							height: 56px;
							border: 1px solid #1890FF;
							color: #1890FF;
							font-size: 18px;
							text-align: center;
							line-height: 56px;
							font-weight: 500;
							cursor: pointer;

							&.on {
								background: #1890FF;
								color: #fff;
							}

							&.bntUid{
								border:1px solid #ccc;
								color #ccc;
								cursor unset;
								&.on{
									background: #ccc;
									color: #fff;
								}
							}
						}

						&.noCart{
							.bnt{
								border:1px solid #ccc;
								color #ccc;
								cursor unset;
								&.on{
									background: #ccc;
									color: #fff;
								}
							}
						}
					}
				}

				.truePrice {
					margin-top: 40px;
					color: #000;
					font-size: 15px;
					text-align: right;
					border-bottom: 1px solid #D8D8D8;
					padding-right: 17px;
					padding-bottom: 10px;

					.num {
						font-size: 24px;
					}

				}
			}

			.listCon{
				overflow-x: hidden;
				overflow-y: auto;
			}

			.list {
				.item {
					width: 100%;
					height: 122px;
					position: relative;
					padding-left: 16px;
					&:hover{
						background: rgba(24, 144, 255, 0.05);
					}
					/deep/.ivu-input-number-input {
						text-align: center;
					}

					/deep/.ivu-input-number-controls-outside {
						width: 112px !important;
					}

					.pictrue {
						width: 90px;
						height: 90px;

						img {
							width: 100%;
							height: 100%;
						}
					}

					.del {
						position: absolute;
						font-size: 14px;
						color: #1890FF;
						right: 10px;
						top: 15px;
						cursor: pointer;
						padding: 2px 7px;
					}

					.cartBnt {
						position: absolute;
						right: 10px;
						height: 24px;
						bottom: 13px;

						.iconfont {
							width: 24px;
							height: 100%;
							background-color: #F2F3F5;
							text-align: center;
							line-height: 24px;
							font-size: 15px;
							color: #000;
						}

						input {
							outline: unset;
							border: 0;
							width: 60px;
							background-color: #F2F3F5;
							height: 100%;
							margin: 0 2px;
							text-align: center;
						}
					}

					.text {
						width: 286px;
						color: #000;
						font-size: 18px;
						margin-left: 10px;

						.end{
							color #999;
							font-size 13px;
						}

						.name {
							font-size: 16px;
							margin-top: 5px;
							width: 230px;
						}

						.info {
							color: #999999;
							font-size: 12px;
							margin: 10px 0 14px 0;
							cursor: pointer;

							.iconfont {
								font-size: 12px;
								margin-left: 5px;
							}
						}

						&.invalid{
							.info{
								cursor unset;
							}
							.name{
								color #999;
							}
						}
					}
				}
			}
		}

		.title {
			color: rgba(0, 0, 0, 0.85);
			.text {
				font-size: 16px;
				font-weight: 500;
			}

			.pictrue {
				width: 32px;
				height: 32px;
				border-radius: 50%;
				cursor: pointer;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.info {
				font-size: 14px;
				margin-left: 8px;
				cursor: pointer;

				.iconfont {
					font-size: 12px;
					margin-left: 5px;
				}

				&:hover {
					color: #2d8cf0;
				}
			}
		}
	}

	.header {
		color #fff;
		.title {
			font-size: 18px;
			font-weight: 500;
		}

		.right {
			.pictrue {
				width: 32px;
				height: 32px;
				border-radius: 50%;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.storeBnt{
				width: 80px;
				height: 32px;
				background: #FFFFFF;
				border-radius: 1px;
				color: #1890FF;
				font-size 14px;
				text-align center;
				line-height 32px;
				margin-left 10px;
				cursor pointer;
				&:hover{
					background-color rgba(255,255,255,0.9);
				}
			}

			.info {
				font-size: 14px;
				font-weight: 400;
				color: #fff;

				span {
					padding: 0 8px;

					&~span {
						border-left: 1px solid #DDDDDD;
					}
				}
			}

			.bnt {
				margin-left: 20px;
			}
		}
	}
</style>
