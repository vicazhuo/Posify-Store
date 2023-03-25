<template>
  <div>
    <Card
      :bordered="false"
      dis-hover
      class="cardCon"
      v-if="Object.keys(tablists).length"
    >
      <Tabs v-model="currentTab" @on-click="onClickTab">
        <TabPane :label="'收银台订单（' + tablists.cashier + '）'" name="6" />
        <TabPane :label="'配送订单（' + tablists.delivery + '）'" name="7" />
        <TabPane :label="'核销订单（' + tablists.writeoff + '）'" name="5" />
        <TabPane :label="'充值订单（' + tablists.recharg + '）'" name="3" />
        <TabPane :label="'付费会员订单（' + tablists.vip + '）'" name="4" />
      </Tabs>
    </Card>
    <Card :bordered="false" dis-hover class="mt15">
      <Form
        ref="orderData"
        :model="orderData"
        :label-width="labelWidth"
        :label-position="labelPosition"
        class="tabform"
        @submit.native.prevent
      >
        <Row :gutter="24" type="flex" justify="end">
          <Col
            span="24"
            class="ivu-text-left"
            v-if="currentTab == 6 || currentTab == 7 || currentTab == 5"
          >
            <FormItem label="订单状态：">
              <RadioGroup
                v-model="orderData.status"
                type="button"
                @on-change="selectStatus"
              >
                <Radio label=""
                  >全部
                  {{
                    "(" + orderChartType.statusAll
                      ? orderChartType.statusAll
                      : 0 + ")"
                  }}
                </Radio>
                <Radio label="0" v-if="currentTab == 6 || currentTab == 5"
                  >未支付
                  {{
                    "(" + orderChartType.unpaid
                      ? orderChartType.unpaid
                      : 0 + ")"
                  }}
                </Radio>
                <Radio label="1" v-if="currentTab == 7"
                  >待配送
                  {{
                    "(" + orderChartType.unshipped
                      ? orderChartType.unshipped
                      : 0 + ")"
                  }}
                </Radio>
                <Radio label="2" v-if="currentTab == 7"
                  >配送中
                  {{
                    "(" + orderChartType.untake
                      ? orderChartType.untake
                      : 0 + ")"
                  }}
                </Radio>
                <Radio label="5" v-if="currentTab == 5"
                  >待核销
                  {{
                    "(" + orderChartType.write_off
                      ? orderChartType.write_off
                      : 0 + ")"
                  }}
                </Radio>
                <!-- <Radio label="6" v-if="currentTab == 5"
                  >已核销
                  {{
                    "(" + orderChartType.write_offed
                      ? orderChartType.write_offed
                      : 0 + ")"
                  }}
                </Radio> -->
                <Radio label="3"
                  >待评价
                  {{
                    "(" + orderChartType.unevaluate
                      ? orderChartType.unevaluate
                      : 0 + ")"
                  }}
                </Radio>
                <Radio label="4"
                  >已完成
                  {{
                    "(" + orderChartType.complete
                      ? orderChartType.complete
                      : 0 + ")"
                  }}
                </Radio>
                <Radio label="-4"
                  >已删除
                  {{ "(" + orderChartType.del ? orderChartType.del : 0 + ")" }}
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="24" class="ivu-text-left">
            <FormItem label="创建时间：">
              <RadioGroup
                v-model="orderData.time"
                type="button"
                @on-change="selectChange"
                class="mr"
              >
                <Radio
                  :label="item.val"
                  v-for="(item, i) in fromList.fromTxt"
                  :key="i"
                  >{{ item.text }}
                </Radio>
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
                class="mr20"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="24" class="ivu-text-left" v-if="currentTab == 4">
            <FormItem label="会员类型：">
              <Select
                v-model="vipData.member_type"
                clearable
                @on-change="userSearchs"
                style="width: 300px"
              >
                <Option
                  v-for="item in treeSelect"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="24" class="ivu-text-left">
            <FormItem label="选择店员：">
              <Select
                v-model="orderData.staff_id"
                clearable
                @on-change="userSearchs"
                style="width: 300px"
              >
                <Option
                  v-for="item in staffData"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <Row>
              <Col class="mr" span="8">
                <FormItem
                  label="订单号："
                  label-for="real_name"
                  v-if="currentTab == 6 || currentTab == 7 || currentTab == 5"
                >
                  <Input
                    search
                    enter-button
                    placeholder="订单号/商品名称"
                    v-model="orderData.real_name"
                    @on-search="orderSearch"
                  />
                </FormItem>
                <FormItem
                  label="用户搜索："
                  label-for="nickname"
                  v-if="currentTab == 3 || currentTab == 4"
                >
                  <Input
                    search
                    enter-button
                    placeholder="请输入用户名"
                    v-model="rechargeData.nickname"
                    @on-search="orderSearch"
                  />
                </FormItem>
              </Col>
              <Col>
                <Button
                  v-auth="['order-export']"
                  icon="ios-share-outline"
                  @click="exports"
                  >导出</Button
                >
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" dis-hover class="mt15">
      <Row type="flex" v-if="currentTab == 6">
        <Col>
          <Button
            v-auth="['order-cashier-cashier_scan']"
            type="primary"
            @click="qrcodeShow"
            >下载收银码</Button
          >
        </Col>
				<!-- <Col>
					<router-link :to="{path:'/store/order/create',query:{isShow:1}}" target="_blank">
						 <Button class="ml10" v-auth="['store-order-create']">收银台</Button>
					</router-link>
				</Col> -->
      </Row>
      <Table
        :columns="
          currentTab == 6 || currentTab == 7 || currentTab == 5
            ? columns
            : currentTab == 3
            ? rechargeColumns
            : vipColumns
        "
        :data="tableList"
        class="ivu-mt"
        :loading="loading"
        no-data-text="暂无数据"
        highlight-row
        no-filtered-data-text="暂无筛选结果"
      >
        <template slot-scope="{ row, index }" slot="order_id">
          <span v-text="row.order_id" style="display: block"></span>
          <span v-show="row.is_del === 1 && row.delete_time == null" style="color: #ed4014; display: block"
            >用户已删除</span
          >
        </template>
        <template slot-scope="{ row, index }" slot="userInfo">
          <div
            v-if="currentTab == 6 || currentTab == 7 || currentTab == 5"
            class="tabBox"
          >
            <div class="tabBox_img" v-viewer>
              <img v-lazy="row.avatar" v-if="row.uid" />
              <img src="@/assets/images/yonghu.png" v-else />
            </div>
            <span class="tabBox_tit" v-if="row.uid">
              <a @click="showUserInfo(row)"
                >{{ row.nickname
                }}<span style="margin-left: 5px">/{{ row.uid }}</span></a
              >
            </span>
            <span class="tabBox_tit" v-else>
              游客<span style="margin-left: 5px">/{{ row.uid }}</span>
            </span>
						<span style="color: #ed4014;" v-if="row.delete_time != null"> (已注销)</span>
          </div>
          <div class="tabBox" v-if="currentTab == 3">
            <div class="tabBox_img" v-viewer>
              <img v-lazy="row.avatar" />
            </div>
            <span class="tabBox_tit">{{ row.nickname }}</span>
          </div>
          <div class="tabBox" v-if="currentTab == 4 && row.user">
            <div class="tabBox_img" v-viewer>
              <img v-lazy="row.user.avatar" />
            </div>
            <span class="tabBox_tit">{{ row.user.nickname }}</span>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="info">
          <div class="tabBox" v-for="(val, i) in row._info" :key="i">
            <div class="tabBox_img" v-viewer>
              <img
                v-lazy="
                  val.cart_info.productInfo.attrInfo
                    ? val.cart_info.productInfo.attrInfo.image
                    : val.cart_info.productInfo.image
                "
              />
            </div>
            <span class="tabBox_tit">
              <span class="font-color-red" v-if="val.cart_info.is_gift">[赠品]</span>{{ val.cart_info.productInfo.store_name + " | "
              }}{{
                val.cart_info.productInfo.attrInfo
                  ? val.cart_info.productInfo.attrInfo.suk
                  : ""
              }}
            </span>
            <span class="tabBox_pice">{{
              "￥" + val.cart_info.truePrice + " x " + val.cart_info.cart_num
            }}</span>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="statusName">
          <div
            v-html="row.status_name.status_name"
            class="pt5"
            v-if="row.status_name"
          ></div>
          <div class="trip" v-if="!row.is_all_refund && row.refund.length">
            部分退款中
          </div>
					<div class="trip" v-if="row.is_all_refund && row.refund.length && row.refund_type != 6">
					  退款中
					</div>
          <div class="pictrue-box" v-if="row.status_name">
            <div
              v-viewer
              v-if="row.status_name.pics"
              v-for="(item, index) in row.status_name.pics || []"
              :key="index"
            >
              <img class="pictrue mr10" v-lazy="item" :src="item" />
            </div>
          </div>
        </template>
				<template slot-scope="{ row, index }" slot="pay_price">
					{{row.paid>0?row.pay_price:0}}
				</template>
        <template slot-scope="{ row, index }" slot="action">
          <a v-if="currentTab == 6 || currentTab == 7 || currentTab == 5">
           <!-- <a @click="edit(row)" v-if="row._status === 1">编辑</a> -->
            <a
              @click="sendOrder(row)"
              v-if="
                (row._status === 2 || row._status === 8 || row.status === 4) &&
                row.shipping_type === 3 &&
                (row.pinkStatus === null || row.pinkStatus === 2) && row.delete_time == null
              "
              >发送货</a
            >
         <!--   <a
              @click="delivery(row)"
              v-if="row._status === 4 && !row.split.length"
              >配送信息</a
            > -->
            <a
              @click="bindWrite(row)"
              v-if="
                row.shipping_type == 2 &&
                (row.status == 0 || row.status == 5) &&
                row.paid == 1 &&
                row.refund_status === 0 && row.delete_time == null
              "
              >立即核销</a
            >
			<Divider
			  type="vertical"
			  v-if="
			    ((row._status === 2 || row.split.length) &&
			      (row.pinkStatus === null || row.pinkStatus === 2) && row.delete_time == null)||
			    (row.shipping_type == 2 &&
			      (row.status == 0 || row.status == 5) &&
			      row.paid == 1 && row.delete_time == null &&
			      row.refund_status === 0)
			  "
			/>
			<a @click="changeMenu(row,'2')">订单详情</a>
           <!-- <Divider
              type="vertical"
              v-if="(row._status === 8 || row.status === 4) && row.split.length"
            />
            <a @click="splitOrderDetail(row)" v-if="row.split.length"
              >查看子订单</a
            > -->

            <!-- <Divider
              type="vertical"
              v-if="
                row._status === 1 ||
                ((row._status === 2 || row.split.length) &&
                  (row.pinkStatus === null || row.pinkStatus === 2)) ||
                row._status === 4 ||
                (row.shipping_type == 2 &&
                  (row.status == 0 || row.status == 5) &&
                  row.paid == 1 &&
                  row.refund_status === 0)
              "
            /> -->
          </a>
          <template>
            <a v-if="currentTab == 3 || currentTab == 4" @click="marker(row)"
              >订单备注</a
            >
						<Divider
						  type="vertical"
						  v-if="(currentTab == 3 && (parseFloat(row.refund_price) || 0) < parseFloat(row.price)) && row.delete_time == null"
						/>
						<a v-if="(currentTab == 3 && (parseFloat(row.refund_price) || 0) < parseFloat(row.price)) && row.delete_time == null" @click="rechRefund(row)">立即退款</a>
            <!-- <Dropdown
              @on-click="changeMenu(row, $event)"
              v-if="currentTab == 5 || currentTab == 6 || currentTab == 7"
            >
              <a href="javascript:void(0)">
                更多
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem
                  name="1"
                  ref="ones"
                  v-show="
                    row._status === 1 &&
                    row.paid === 0 &&
                    row.pay_type === 'offline'
                  "
                  >立即支付</DropdownItem
                >
                <DropdownItem name="2" v-if="currentTab != 3 && currentTab != 4"
                  >订单详情</DropdownItem
                >
                <DropdownItem name="3" v-if="currentTab != 3"
                  >订单记录</DropdownItem
                >
                <DropdownItem
                  name="11"
                  v-show="row._status >= 3 && row.express_dump"
                  >电子面单打印
                </DropdownItem>
                <DropdownItem name="10" v-show="row._status >= 2"
                  >小票打印</DropdownItem
                >
                <DropdownItem
                  name="4"
                  v-show="
                    row._status !== 1 ||
                    (row._status === 3 &&
                      row.use_integral > 0 &&
                      row.use_integral >= row.back_integral)
                  "
                  >订单备注</DropdownItem
                >
                <DropdownItem
                  name="5"
                  v-show="
                    row.refund_type != 2 &&
                    row.refund_type != 4 &&
                    row.refund_type != 6 &&
                    row.paid == 1 &&
                    row.refund_status !== 2 &&
                    parseFloat(row.pay_price) > 0 &&
                    (row.split == null || row.split.length == 0)
                  "
                  >立即退款</DropdownItem
                >
                <DropdownItem name="55" v-show="row.refund_type == 2"
                  >同意退货</DropdownItem
                >
                <DropdownItem
                  name="8"
                  v-show="row._status === 4 && !row.split.length"
                  >已收货
                </DropdownItem>
                <DropdownItem
                  name="9"
                  v-if="row.is_del == 1 && currentTab != 3 && currentTab != 4"
                  >删除订单
                </DropdownItem>
              </DropdownMenu>
            </Dropdown> -->
          </template>
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page
          :total="total"
          :current="orderData.page"
          show-elevator
          show-total
          @on-change="pageChange"
          :page-size="orderData.limit"
          v-if="currentTab == 6 || currentTab == 7 || currentTab == 5"
        />
        <Page
          :total="total"
          :current="orderData.page"
          show-elevator
          show-total
          @on-change="pageChange"
          :page-size="rechargeData.limit"
          v-if="currentTab == 3"
        />
        <Page
          :total="total"
          :current="orderData.page"
          show-elevator
          show-total
          @on-change="pageChange"
          :page-size="vipData.limit"
          v-if="currentTab == 4"
        />
      </div>
    </Card>
    <orderWriteOff
      ref="writeOff"
      :orderNumId="orderNumId"
      @submitSuccess="submitSuccess"
    ></orderWriteOff>
    <!-- 用户详情-->
    <user-details ref="userDetails"></user-details>
    <!-- 编辑 配送信息表单数据 退款 退积分 不退款-->
    <edit-from
      ref="edits"
      :FromData="FromData"
      @submitFail="submitFail"
    ></edit-from>
    <!-- 详情 -->
    <details-from
      ref="detailss"
      :orderDatalist="orderDatalist"
      :orderId="orderId"
	  :row-active="rowActive"
	  :formType="1"
    ></details-from>
    <!-- 备注 -->
    <order-remark
      ref="remarks"
      :orderId="orderId"
      @submitFail="submitFail"
      :currentTab="currentTab"
    ></order-remark>
    <!-- 记录 -->
    <order-record ref="record"></order-record>
    <!-- 发送货 -->
    <order-send
      ref="send"
      :orderId="orderId"
      :status="status"
      :pay_type="pay_type"
      @submitFail="submitFail"
    >
    </order-send>
    <Modal v-model="modalCode" title="收款码" footer-hide>
      <div>
        <div v-viewer class="acea-row row-around code">
          <Spin fix v-if="spin"></Spin>
          <div class="acea-row row-column-around row-between-wrapper">
            <div class="QRpic">
              <img v-lazy="qrcode && qrcode.wechat" />
            </div>
            <span class="mt10">公众号收款码</span>
          </div>
          <div class="acea-row row-column-around row-between-wrapper">
            <div class="QRpic">
              <img v-lazy="qrcode && qrcode.routine" />
            </div>
            <span class="mt10">小程序收款码</span>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import expandRow from "./components/tableExpand.vue";
import userDetails from "@/pages/user/components/userDetails";
import editFrom from "@/components/from/from";
import orderSend from "./components/orderSend";
import detailsFrom from "./components/orderDetails";
import orderRecord from "./components/orderRecord";
import orderRemark from "./components/orderRemark";
import orderWriteOff from "./components/orderWriteOff";
import exportExcel from "@/utils/newToExcel.js";
import {
  orderList,
  orderChart,
  orderHeader,
  orderRecharge,
  orderVip,
  getOrdeDatas, //编辑表单数据
  getDistribution,
  writeUpdate,
  getDataInfo,
  orderExport,
  cashierScan,
  getRefundFrom,
	refundRecharge
} from "@/api/order";
import { staffallInfo } from "@/api/staff";
export default {
  name: "index",
  components: {
    userDetails,
    editFrom,
    detailsFrom,
    orderRecord,
    orderRemark,
    orderWriteOff,
    orderSend,
    expandRow,
  },
  data() {
    return {
      qrcode: {},
      spin: false,
      modalCode: false,
      delfromData: {},
      pay_type: "",
      status: 0, //发货状态判断
      FromData: null,
      orderDatalist: null,
      orderId: 0,
      orderNumId: "",
      treeSelect: [
        {
          id: "free",
          label: "试用",
        },
        {
          id: "month",
          label: "月卡",
        },
        {
          id: "quarter",
          label: "季卡",
        },
        {
          id: "year",
          label: "年卡",
        },
        {
          id: "ever",
          label: "永久",
        },
        // {
        // 	id: "card",
        // 	label: "卡密激活",
        // },
      ],
      staffData: [],
      tablists: {},
      orderChartType: {},
      fromList: {
        title: "选择时间",
        custom: true,
        fromTxt: [
          {
            text: "全部",
            val: "",
          },
          {
            text: "今天",
            val: "today",
          },
          {
            text: "昨天",
            val: "yesterday",
          },
          {
            text: "最近7天",
            val: "lately7",
          },
          {
            text: "最近30天",
            val: "lately30",
          },
          {
            text: "本月",
            val: "month",
          },
          {
            text: "本年",
            val: "year",
          },
        ],
      },
      timeVal: [],
      // 订单列表
      orderData: {
        page: 1,
        limit: 10,
        type: 6,
        status: "",
        time: "",
        real_name: "",
        staff_id: "",
      },
      // 充值订单搜索
      rechargeData: {
        nickname: "",
        limit: 15,
      },
      // 会员订单搜索
      vipData: {
        member_type: "",
        limit: 15,
      },
      currentTab: "6",
      tableList: [],
      total: 0,
      loading: false,
      rechargeColumns: [
        {
          title: "ID",
          key: "id",
          width: 60,
        },
        {
          title: "订单号",
          key: "order_id",
          minWidth: 180,
        },
        {
          title: "用户信息",
          slot: "userInfo",
          minWidth: 200,
        },
        {
          title: "支付金额",
          key: "price",
          minWidth: 110,
        },
        {
          title: "充值类型",
          key: "_recharge_type",
          minWidth: 100,
        },
        {
          title: "支付时间",
          key: "_pay_time",
          minWidth: 130,
        },
        {
          title: "关联店员",
          key: "staff_name",
          minWidth: 100,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          minWidth: 200,
          align: "center",
        },
      ],
      vipColumns: [
        {
          title: "订单号",
          key: "order_id",
          minWidth: 180,
        },
        {
          title: "用户信息",
          slot: "userInfo",
          minWidth: 200,
        },
        {
          title: "会员类型",
          key: "member_type",
          minWidth: 100,
        },
        {
          title: "有效期限（天）",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              params.row.vip_day === -1 ? "永久" : params.row.vip_day
            );
          },
        },
        {
          title: "支付金额",
          key: "pay_price",
          minWidth: 100,
        },
        {
          title: "支付方式",
          key: "pay_type",
          minWidth: 100,
        },
        {
          title: "购买时间",
          key: "pay_time",
          minWidth: 130,
        },
        {
          title: "关联店员",
          key: "staff_name",
          minWidth: 120,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          minWidth: 200,
          align: "center",
        },
      ],
      columns: [
        {
          type: "expand",
          width: 30,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
              },
            });
          },
        },
        {
          title: "订单号",
          slot: "order_id",
          minWidth: 160,
        },
        {
          title: "用户信息",
          slot: "userInfo",
          minWidth: 250,
        },
        {
          title: "商品信息",
          slot: "info",
          minWidth: 350,
        },
        {
          title: "实际支付",
          slot: "pay_price",
          minWidth: 120,
        },
        {
          title: "支付方式",
          key: "pay_type_name",
          minWidth: 120,
        },
        {
          title: "收银店员",
          key: "clerk_name",
          minWidth: 120,
        },
        {
          title: "下单时间",
          key: "add_time",
          minWidth: 130,
        },
        {
          title: "订单状态",
          slot: "statusName",
          minWidth: 120,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          minWidth: 200,
          align: "center",
        },
      ],
	  rowActive: {}
    };
  },
  watch: {
    $route() {
      if (this.$route.fullPath === "/store/order/index?type=7&status=1") {
        this.getPath();
      }
    },
  },
  computed: {
    ...mapState("store/layout", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 80;
    },
    labelPosition() {
      return this.isMobile ? "top" : "right";
    },
  },
  created() {
    this.getTabs();
    this.staffList();
    if (this.$route.fullPath === "/store/order/index?type=7&status=1") {
      this.getPath();
    } else {
      this.getList();
    }
  },
  mounted() {},
  methods: {
		rechRefund(row){
			this.$modalForm(refundRecharge(row.id)).then(() => this.getRecharge());
		},
    marker(row) {
      this.orderId = row.id;
      this.$refs.remarks.modals = true;
      if (this.currentTab == 3) {
        this.$refs.remarks.getRemark(row.id);
      }
      if (this.currentTab == 4) {
        this.$refs.remarks.getVipRemark(row.id);
      }
    },
    //跳转刷新
    getPath() {
      this.orderData.page = 1;
      this.currentTab = this.$route.query.type.toString();
      this.orderData.type = this.currentTab;
      this.orderData.status = this.$route.query.status;
      this.getList();
    },
    // 收银台跳移动端支付列表二维码
    qrcodeShow() {
      this.spin = true;
      this.modalCode = true;
      cashierScan()
        .then((res) => {
          this.spin = false;
          this.qrcode = res.data;
        })
        .catch((err) => {
          this.spin = false;
          this.$Message.error(err.msg);
        });
    },
    // 查看子订单
    splitOrderDetail(row) {
      this.$router.push({
        path: "split_list",
        query: {
          id: row.id,
          orderChartType: this.orderData.status,
        },
      });
    },
    // 操作更多
    changeMenu(row, name) {
      this.orderId = row.id;
      switch (name) {
        case "1":
          this.delfromData = {
            title: "修改立即支付",
            url: `/order/pay_offline/${row.id}`,
            method: "post",
            ids: "",
          };
          this.$modalSure(this.delfromData)
            .then((res) => {
              this.$Message.success(res.msg);
              this.getChart();
							this.getData(row.id,1);
              this.getList();
            })
            .catch((res) => {
              this.$Message.error(res.msg);
            });
          break;
        case "2":
		  this.rowActive = row;
          this.getData(row.id);
          break;
        case "3":
          this.$refs.record.modals = true;
          if (this.currentTab == 4) {
            this.$refs.record.getVip(row.id);
          } else {
            this.$refs.record.getList(row.id);
          }
          break;
        case "4":
          this.$refs.remarks.modals = true;
          if (this.currentTab == 3) {
            this.$refs.remarks.getRemark(row.id);
          }
          if (this.currentTab == 4) {
            this.$refs.remarks.getVipRemark(row.id);
          }
          this.$refs.remarks.formValidate.remark = row.remark;
          break;
        case "5":
          this.getOnlyRefundData(row.id, row.refund_type);
          break;
        case "55":
          this.getRefundData(row.id, row.refund_type);
          break;
        // case "6":
        // 	this.getRefundIntegral(row.id);
        // 	break;
        // case "7":
        // 	this.getNoRefundData(row.id);
        // 	break;
        case "8":
          this.delfromData = {
            title: "修改确认收货",
            url: `/order/take/${row.id}`,
            method: "put",
            ids: "",
          };
          this.$modalSure(this.delfromData)
            .then((res) => {
              this.$Message.success(res.msg);
              this.getList();
							this.getData(row.id,1);
            })
            .catch((res) => {
              this.$Message.error(res.msg);
            });
          break;
        case "10":
          this.delfromData = {
            title: "立即打印订单",
            info: "您确认打印此订单吗?",
            url: `/order/print/${row.id}`,
            method: "get",
            ids: "",
          };
          this.$modalSure(this.delfromData)
            .then((res) => {
              this.$Message.success(res.msg);
              this.getList();
            })
            .catch((res) => {
              this.$Message.error(res.msg);
            });
          break;
        case "11":
          this.delfromData = {
            title: "立即打印电子面单",
            info: "您确认打印此电子面单吗?",
            url: `/order/order_dump/${row.id}`,
            method: "get",
            ids: "",
          };
          this.$modalSure(this.delfromData)
            .then((res) => {
              this.$Message.success(res.msg);
              this.getList();
            })
            .catch((res) => {
              this.$Message.error(res.msg);
            });
          break;
        default:
          this.delfromData = {
            title: "删除订单",
            url: `/order/del/${row.id}`,
            method: "DELETE",
            ids: "",
          };
          // this.modalTitleSs = '删除订单';
          this.delOrder(row, this.delfromData);
      }
    },
    // 仅退款
    getOnlyRefundData(id, refund_type) {
      this.$modalForm(getRefundFrom(id)).then(() => {
        this.getChart();
        this.getList();
				this.$refs.detailss.modals = false;
      });
    },
    // 获取退款表单数据
    getRefundData(id, refund_type) {
      let orderChartType = this.orderData.status;
      this.delfromData = {
        title: "是否立即退货",
        url: `/refund/agree/${id}`,
        method: "get",
      };
      this.$modalSure(this.delfromData)
        .then((res) => {
          this.$Message.success(res.msg);
          this.getChart();
          this.getList();
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 删除单条订单
    delOrder(row, data) {
      if (row.is_del === 1) {
        this.$modalSure(data)
          .then((res) => {
            this.$Message.success(res.msg);
            this.getList();
						this.$refs.detailss.modals = false;
          })
          .catch((res) => {
            this.$Message.error(res.msg);
          });
      } else {
        const title = "错误！";
        const content =
          "<p>您选择的的订单存在用户未删除的订单，无法删除用户未删除的订单！</p>";
        this.$Modal.error({
          title: title,
          content: content,
        });
      }
    },
    // 获取详情表单数据
    getData(id,type) {
      getDataInfo(id)
        .then(async (res) => {
					if(!type){
						this.$refs.detailss.modals = true;
					}
					this.$refs.detailss.activeName = 'detail';
          this.orderDatalist = res.data;
          if (this.orderDatalist.orderInfo.refund_reason_wap_img) {
            try {
              this.orderDatalist.orderInfo.refund_reason_wap_img = JSON.parse(
                this.orderDatalist.orderInfo.refund_reason_wap_img
              );
            } catch (e) {
              this.orderDatalist.orderInfo.refund_reason_wap_img = [];
            }
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    submitSuccess() {
      this.getList();
      this.getChart();
      if (this.$refs.detailss.modals) {
          this.getData(this.orderId,1);   
      }
    },
    // 单个核销
    singleWrite(row) {
      let self = this;
      this.$Modal.confirm({
        title: "提示",
        content: "确定要核销该订单吗？",
        cancelText: "取消",
        closable: true,
        maskClosable: true,
        onOk: function () {
          writeUpdate(row.order_id)
            .then((res) => {
              self.$Message.success(res.msg);
              self.getList();
              self.getChart();
              if (self.$refs.detailss.modals) {
                  self.getData(self.orderId,1);   
              }
            })
            .catch((err) => {
              self.$Message.error(err.msg);
            });
        },
        onCancel: () => {},
      });
    },
    // 立即核销
    bindWrite(row) {
      if (row.total_num > 1) {
        this.orderNumId = row.order_id;
        this.$refs.writeOff.modals = true;
        this.$refs.writeOff.getWriteOff({ oid: row.id });
      } else {
        this.singleWrite(row);
      }
    },
    // 配送信息表单数据
    delivery(row) {
      getDistribution(row.id)
        .then(async (res) => {
          this.FromData = res.data;
          this.$refs.edits.modals = true;
					this.getData(this.orderId,1);
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 编辑
    edit(row) {
      this.getOrderData(row.id);
    },
    // 获取编辑表单数据
    getOrderData(id) {
      getOrdeDatas(id)
        .then(async (res) => {
          if (res.data.status === false) {
            return this.$authLapse(res.data);
          }
          this.$authLapse(res.data);
          this.FromData = res.data;
          this.$refs.edits.modals = true;
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 修改成功(编辑只有未支付时出现)
    submitFail() {
      this.status = 0;
      if (this.currentTab == 4) {
        this.getVipOrder();
      } else if (this.currentTab == 3) {
        this.getRecharge();
      } else {
        this.getList();
				this.getData(this.orderId,1);
      }
    },
    // 发送货
    sendOrder(row) {
      this.$store.commit("store/order/setSplitOrder", row.total_num);
      this.$refs.send.modals = true;
      this.orderId = row.id;
      this.status = row._status;
      this.pay_type = row.pay_type;
      this.$refs.send.getList();
      this.$refs.send.getDeliveryList();
      this.$nextTick((e) => {
        this.$refs.send.getCartInfo(row._status, row.id);
      });
    },
    // 详情
    showUserInfo(row) {
      this.$refs.userDetails.modals = true;
      this.$refs.userDetails.getDetails(row.uid);
    },
    // 初始化数据
    clearData() {
      this.orderData = {
        page: 1,
        limit: 10,
        type: 6,
        status: "",
        time: "",
        real_name: "",
      };
      this.rechargeData = {
        nickname: "",
        limit: 15,
      };
      this.vipData = {
        member_type: "",
        limit: 15,
      };
    },
    // 店员列表
    staffList() {
      let data = {
        page: 0,
        limit: 0,
      };
      staffallInfo()
        .then((res) => {
          this.staffData = res.data;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    // 获取门店订单头部统计
    getTabs() {
      orderHeader()
        .then((res) => {
          this.tablists = res.data;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    // 订单头部数据
    getChart() {
      orderChart({
        type: this.currentTab,
      })
        .then((res) => {
          this.orderChartType = res.data;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    },
    //点击切换头部
    onClickTab() {
      this.clearData();
      this.orderData.type = this.currentTab;
      this.orderData.page = 1;
      this.timeVal = [];
      // this.orderData.time = '';
      this.getChart();
      this.searchList();
    },
    // 不同类型订单调用列表；
    searchList() {
      if (this.currentTab == 3) {
        this.getRecharge();
      } else if (this.currentTab == 4) {
        this.getVipOrder();
      } else {
        this.getList();
      }
    },
    // 搜索店员或店员选择
    userSearchs() {
      this.orderData.page = 1;
      this.searchList();
    },
    // 切换订单状态
    selectStatus() {
      this.orderData.page = 1;
      this.getList();
    },
    // 付费会员订单列表
    getVipOrder() {
      this.loading = true;
      //this.tableList = [];
      this.vipData.name = this.rechargeData.nickname;
      this.vipData.add_time = this.orderData.time;
      this.vipData.staff_id = this.orderData.staff_id;
      this.vipData.page = this.orderData.page;
      orderVip(this.vipData)
        .then((res) => {
          let data = res.data;
          this.tableList = data.list;
          this.total = data.count;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$Message.error(err.msg);
        });
    },
    // 充值订单
    getRecharge() {
      this.loading = true;
      //this.tableList = [];
      this.rechargeData.data = this.orderData.time;
      this.rechargeData.staff_id = this.orderData.staff_id;
      this.rechargeData.page = this.orderData.page;
      orderRecharge(this.rechargeData)
        .then((res) => {
          let data = res.data;
          this.tableList = data.list;
          this.total = data.count;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$Message.error(err.msg);
        });
    },
    // 一般订单
    getList() {
      this.getChart();
      this.loading = true;
			//this.tableList = [];
      orderList(this.orderData)
        .then((res) => {
          let data = res.data;
					data.data.forEach((item)=>{
					  if(item.id == this.orderId){
					    this.rowActive = item;
					  }
					});
          this.tableList = data.data;
          this.total = data.count;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$Message.error(err.msg);
        });
    },
    pageChange(index) {
      this.orderData.page = index;
      this.searchList();
    },
    // 搜索
    orderSearch() {
      this.orderData.page = 1;
      this.searchList();
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.orderData.time = this.timeVal.join("-");
      this.orderData.page = 1;
      if (!e[0]) {
        this.orderData.time = "";
      }
      this.searchList();
    },
    // 选择时间
    selectChange() {
      this.orderData.page = 1;
      this.timeVal = [];
      this.searchList();
    },
    // 数据导出；
    async exports() {
      let orderData = {
        orderType: this.currentTab,
        staff_id: this.orderData.staff_id,
      };
      if (
        this.currentTab == 6 ||
        this.currentTab == 7 ||
        this.currentTab == 5
      ) {
        orderData.status = this.orderData.status;
        orderData.real_name = this.orderData.real_name;
        orderData.time = this.orderData.time;
      } else if (this.currentTab == 3) {
        orderData.nickname = this.rechargeData.nickname;
        orderData.data = this.orderData.time;
      } else {
        orderData.member_type = this.vipData.member_type;
        orderData.name = this.rechargeData.nickname;
        orderData.add_time = this.orderData.time;
      }
      let [th, filekey, data, fileName] = [[], [], [], ""];
      // let fileName = "";
      let excelData = JSON.parse(JSON.stringify(orderData));
      excelData.page = 1;
      for (let i = 0; i < excelData.page + 1; i++) {
        let lebData = await this.getExcelData(excelData);
        if (!fileName) fileName = lebData.filename;
        if (!filekey.length) {
          filekey = lebData.filekey;
        }
        if (!th.length) th = lebData.header;
        if (lebData.export.length) {
          data = data.concat(lebData.export);
          excelData.page++;
        } else {
          exportExcel(th, filekey, fileName, data);
          return;
        }
      }
    },
    getExcelData(excelData) {
      return new Promise((resolve, reject) => {
        let type = 1;
        if (
          this.currentTab == 6 ||
          this.currentTab == 7 ||
          this.currentTab == 5
        ) {
          type = 1;
        } else if (this.currentTab == 3) {
          type = 2;
        } else {
          type = 3;
        }
        orderExport(excelData, type).then((res) => {
          return resolve(res.data);
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.QRpic {
  width: 180px;
  height: 259px;

  img {
    width: 100%;
    height: 100%;
  }
}

.cardCon {
  /deep/.ivu-card-body {
    padding: 14px 20px 0 20px !important;
  }

  /deep/.ivu-tabs-bar {
    margin-bottom: 0 !important;
    border-bottom: 1px solid #E9E9E9 !important;
  }
}

.pictrue-box {
  display: flex;
  align-item: center;
}

.pictrue {
  width: 25px;
  height: 25px;
}

img {
  height: 36px;
  display: block;
}

.tabBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .tabBox_img {
    width: 36px;
    height: 36px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .tabBox_tit {
    max-width: 60%;
    font-size: 12px !important;
    margin: 0 2px 0 10px;
    letter-spacing: 1px;
    padding: 5px 0;
    box-sizing: border-box;
  }
}

.trip {
  color: orange;
}
</style>
