<template>
  <div style="width: 100%">
    <Modal
      v-model="modals"
      scrollable
      footer-hide
      closable
      title="店员详情"
      :mask-closable="false"
      width="900"
    >
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="acea-row">
        <div class="avatar mr15"><img :src="psInfo.avatar" /></div>
        <div class="dashboard-workplace-header-tip">
          <p
            class="dashboard-workplace-header-tip-title"
            v-text="psInfo.staff_name || '-'"
          ></p>
          <div class="dashboard-workplace-header-tip-desc">
            <span
              class="dashboard-workplace-header-tip-desc-sp"
              v-for="(item, index) in detailsData"
              :key="index"
            >
              <span v-if="item.key != '元'">{{
                item.title + "：" + item.value + item.key
              }}</span>
              <span v-else>{{ item.title + "：￥" + item.value }}</span>
            </span>
          </div>
        </div>
      </div>
      <Row type="flex" justify="space-between" class="mt25">
        <Col span="4" class="user_menu">
          <Menu
            :theme="theme2"
            :active-name="activeName"
            @on-select="changeType"
          >
            <MenuItem
              :name="item.val"
              v-for="(item, index) in list"
              :key="index"
            >
              {{ item.label }}
            </MenuItem>
          </Menu>
        </Col>
        <Col span="20">
          <Table
            :columns="columns"
            :data="userLists"
            max-height="400"
            ref="table"
            :loading="loading"
            no-userFrom-text="暂无数据"
            no-filtered-userFrom-text="暂无筛选结果"
          >
            <template slot-scope="{ row, index }" slot="avatar">
              <viewer>
                <div class="tabBox_img">
                  <img v-lazy="row.avatar" />
                </div>
              </viewer>
            </template>
            <template slot-scope="{ row, index }" slot="real_name">
              <div>{{ row.uid ? row.real_name : "游客" }}</div>
            </template>
          </Table>
          <div class="acea-row row-right page">
            <Page
              :total="total"
              :current="userFrom.page"
              show-elevator
              show-total
              @on-change="pageChange"
              :page-size="userFrom.limit"
            />
          </div>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import { detailsApi, infoApi } from "@/api/staff";

export default {
  name: "userDetails",
  data() {
    return {
      theme2: "light",
      list: [
        { val: "cashier_order", label: "收银订单" },
        { val: "self_order", label: "配送订单" },
        { val: "writeoff_order", label: "核销订单" },
        { val: "recharge", label: "充值订单" },
        { val: "spread", label: "推广用户" },
        { val: "card", label: "激活会员卡" },
        { val: "svip", label: "付费会员" },
      ],
      modals: false,
      spinShow: false,
      detailsData: [],
      userId: 0,
      loading: false,
      userFrom: {
        type: "cashier_order",
        page: 1, // 当前页
        limit: 10, // 每页显示条数
      },
      total: 0,
      columns: [],
      userLists: [],
      psInfo: {},
      activeName: "cashier_order",
    };
  },
  created() {},
  methods: {
    // 会员详情
    getDetails(id) {
      this.activeName = "cashier_order";
      this.userId = id;
      this.spinShow = true;
      detailsApi(id)
        .then(async (res) => {
          if (res.status === 200) {
            let data = res.data;
            this.detailsData = data.headerList;
            this.psInfo = data.ps_info;
            this.changeType(this.activeName, this.userFrom.page);
            this.spinShow = false;
          } else {
            this.spinShow = false;
            this.$Message.error(res.msg);
          }
        })
        .catch((res) => {
          this.spinShow = false;
          this.$Message.error(res.msg);
        });
    },
    pageChange(index) {
      this.userFrom.page = index;
      this.changeType(this.userFrom.type, index);
    },
    // tab选项
    changeType(name, index) {
      this.loading = true;
      this.userFrom.type = name;
      this.activeName = name;
      if (!index) index = 1;
      this.userFrom.page = index;
      let data = {
        id: this.userId,
        datas: this.userFrom,
      };
      infoApi(data)
        .then(async (res) => {
          this.loading = false;
          if (res.status === 200) {
            let data = res.data;
            this.userLists = data.list;
            this.total = data.count;
            switch (this.userFrom.type) {
              case "cashier_order":
              case "writeoff_order":
              case "self_order":
                this.columns = [
                  {
                    title: "订单ID",
                    key: "order_id",
                    minWidth: 160,
                  },
                  {
                    title: "收货人",
                    slot: "real_name",
                    minWidth: 100,
                  },
                  {
                    title: "商品数量",
                    key: "total_num",
                    minWidth: 90,
                  },
                  {
                    title: "商品总价",
                    key: "total_price",
                    minWidth: 110,
                  },
                  {
                    title: "实付金额",
                    key: "pay_price",
                    minWidth: 120,
                  },
                  {
                    title: "交易完成时间",
                    key: "pay_time",
                    minWidth: 120,
                  },
                ];
                break;
              case "recharge":
                this.columns = [
                  {
                    title: "订单号",
                    key: "order_id",
                    minWidth: 180,
                  },
                  {
                    title: "用户昵称",
                    key: "nickname",
                    minWidth: 100,
                  },
                  {
                    title: "充值金额",
                    key: "price",
                    minWidth: 80,
                  },
                  {
                    title: "充值时间",
                    key: "_pay_time",
                    minWidth: 120,
                  },
                  {
                    title: "备注",
                    key: "remarks",
                    minWidth: 120,
                  },
                ];
                break;
              case "spread":
                this.columns = [
                  {
                    title: "ID",
                    key: "uid",
                    minWidth: 80,
                  },
                  {
                    title: "头像",
                    slot: "avatar",
                    minWidth: 80,
                  },
                  {
                    title: "用户昵称",
                    key: "nickname",
                    minWidth: 80,
                  },
                  {
                    title: "推广时间",
                    key: "spread_time",
                    minWidth: 120,
                  },
                ];
                break;
              case "svip":
                this.columns = [
                  {
                    title: "订单号",
                    key: "order_id",
                    minWidth: 180,
                  },
                  {
                    title: "支付金额",
                    key: "pay_price",
                    minWidth: 80,
                  },
                  {
                    title: "会员类型",
                    key: "member_type",
                    minWidth: 80,
                  },
                  {
                    title: "支付时间",
                    key: "pay_time",
                    minWidth: 120,
                  },
                  {
                    title: "备注",
                    key: "remarks",
                    minWidth: 120,
                  },
                ];
                break;
              case "card":
                this.columns = [
                  {
                    title: "ID",
                    key: "uid",
                    minWidth: 80,
                  },
                  {
                    title: "card_id",
                    key: "card_id",
                    minWidth: 80,
                  },
                  {
                    title: "会员卡号",
                    key: "code",
                    minWidth: 120,
                  },
                  {
                    title: "激活时间",
                    key: "submit_time",
                    minWidth: 120,
                  },
                  {
                    title: "添加时间",
                    key: "add_time",
                    minWidth: 120,
                  },
                ];
                break;
              default:
                this.columns = [
                  {
                    title: "ID",
                    key: "uid",
                    minWidth: 120,
                  },
                  {
                    title: "昵称",
                    key: "nickname",
                    minWidth: 120,
                  },
                  {
                    title: "等级",
                    key: "type",
                    minWidth: 120,
                  },
                  {
                    title: "加入时间",
                    key: "add_time",
                    minWidth: 120,
                  },
                ];
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.$Message.error(res.msg);
          }
        })
        .catch((res) => {
          this.loading = false;
          this.$Message.error(res.msg);
        });
    },
  },
};
</script>

<style lang="less" scoped>
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
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
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
          color: #17233d;
          font-size: 13px;
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
<style scoped lang="stylus">
.user_menu >>> .ivu-menu {
  width: 100% !important;
}
</style>
