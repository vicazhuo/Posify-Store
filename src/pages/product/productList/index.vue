<template>
  <div>
    <Card :bordered="false" dis-hover>
      <div class="product_tabs tabbox">
        <Tabs v-model="formValidate.type" @on-click="onClickTab">
          <TabPane v-for="(item, index) in headerList" :key="index" :label="item.name + '(' + item.count + ')'"
            :name="item.type.toString()" />
        </Tabs>
      </div>
    </Card>

    <Card :bordered="false" dis-hover class="ivu-mt box">
      <Form ref="formValidate" :model="formValidate" :label-width="labelWidth" :label-position="labelPosition">
        <Row type="flex" :gutter="24">
          <Col>
          <FormItem label="商品分类：" :labelWidth="80" label-for="pid">
            <Cascader :data="data" v-model="value1" change-on-select @on-change="cascaderSearchs"></Cascader>
          </FormItem>
          </Col>
          <Col>
          <FormItem label="商品搜索：" :labelWidth="80" label-for="store_name">
            <Input enter-button placeholder="请输入商品名称,关键字,ID" v-model="formValidate.store_name" />
          </FormItem>
          </Col>
          <Col>
          <div class="search" @click="search">搜索</div>
          </Col>
          <Col>
          <div class="reset" @click="reset">重置</div>
          </Col>
          <Col>
          <div class="reset" @click="setStock">同步库存</div>
          </Col>
        </Row>
      </Form>
    </Card>

    <Card :bordered="false" dis-hover class="ive-mt tablebox">
      <div class="btnbox"></div>
      <div class="table">
        <Table :columns="columns" :data="orderList" ref="table" class="mt25" @on-select-all="selectall"
          @on-select-all-cancel="selectall" @on-selection-change="select" :loading="loading" highlight-row
          no-userFrom-text="暂无数据" no-filtered-userFrom-text="暂无筛选结果">
          <template slot-scope="{ row }" slot="image">
            <viewer>
              <div class="tabBox_img">
                <img v-lazy="row.image" />
              </div>
            </viewer>
          </template>
          <template slot-scope="{ row, index }" slot="state">
            <i-switch v-model="row.is_show" :value="row.is_show" :true-value="1" :false-value="0"
              @on-change="changeSwitch(row)" size="large" v-if="formValidate.type != 7">
              <span slot="open">上架</span>
              <span slot="close">下架</span>
            </i-switch>
            <div v-else>{{ row.is_del ? '已删除' : !row.is_show ? '已下架' : '' }}</div>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a @click="edit(row)">编辑</a>
            <Divider type="vertical" />
            <a @click="detail(row.id)">详情</a>
            <Divider type="vertical" />
            <a @click="reply(row.id)">查看评论</a>
            <Divider type="vertical" />
            <a @click="stockControl(row)">库存管理</a>
          </template>
        </Table>
        <div class="acea-row row-right page">
          <Page :total="total" :current="formValidate.page" show-elevator show-total @on-change="pageChange"
            :page-size="formValidate.limit" />
        </div>
      </div>
    </Card>
    <!-- 商品详情弹窗 -->
    <div v-if="isProductBox">
      <div class="bg" @click.stop="isProductBox = false"></div>
      <goodsDetail :goodsId="goodsId" :product="1"></goodsDetail>
    </div>
    <stockEdit ref="stock" @stockChange="stockChange"></stockEdit>
  </div>
</template>

<script>
import { mapState } from "vuex";
import goodsDetail from "../components/goods_detail.vue";
import stockEdit from "../components/stockEdit.vue";
import {
  productListInfo,
  productHeaderInfo,
  cascaderListApi,
  setShowApi,
  synchStocks,
} from "@/api/product.js";
export default {
  name: "index",
  components: {
    goodsDetail,
    stockEdit,
  },
  data() {
    return {
      isProductBox: false,
      goodsId: "",
      data: [],
      value1: [],
      headerList: [],
      total: 0,
      loading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "商品ID",
          key: "id",
          width: 80,
        },
        {
          title: "商品图",
          slot: "image",
          minWidth: 80,
        },
        {
          title: "商品名称",
          key: "store_name",
          minWidth: 250,
        },
        {
          title: "商品售价",
          key: "price",
          minWidth: 90,
        },
        {
          title: "销量",
          key: "branch_sales",
          sortable: true,
          minWidth: 90,
        },
        {
          title: "库存",
          key: "branch_stock",
          minWidth: 80,
        },
        {
          title: "排序",
          key: "sort",
          minWidth: 70,
        },
        {
          title: "状态",
          slot: "state",
          width: 100,
          filters: [
            {
              label: "上架",
              value: 1,
            },
            {
              label: "下架",
              value: 0,
            },
          ],
          filterMethod(value, row) {
            return row.is_show === value;
          },
          filterMultiple: false,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          minWidth: 250,
        },
      ],
      orderList: [],
      formValidate: {
        store_name: "",
        cate_id: "",
        type: "1",
        page: 1,
        limit: 15,
      },
      datanew: [],
      dataid: [],
    };
  },
  watch: {
    $route() {
      if (this.$route.fullPath === "/store/product/index?type=5") {
        this.getPath();
      }
    },
  },
  computed: {
    ...mapState("store/layout", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 120;
    },
    labelPosition() {
      return this.isMobile ? "top" : "right";
    },
  },
  mounted() {
    this.goodsCategory();
    this.getHeader();
  },
  methods: {
    // 批量设置标签；
    setStock() {
      if (this.datanew.length == 0) {
        this.$Message.warning("请选择要同步的商品");
      } else {
        console.log(this.dataid);
        let a = [];
        a = this.dataid.join(",");

        let ids = { ids: [] };
        ids.ids = this.dataid;
        this.$Modal.confirm({
          title: "同步库存",
          content: "<p>此操作会覆盖商品的库存数量，请谨慎使用！</p>",
          onOk: () => {
            synchStocks(ids).then((res) => {
              this.datanew = [];
              this.getList();
              this.$Message.success(res.msg);
            });
          },
          onCancel: () => {
            this.$Message.info("已取消");
          },
        });
      }
    },
    select(e) {
      this.datanew = e;
      let data = [];
      this.datanew.map((item) => {
        data.push(item.id);
      });
      this.dataid = data;
    },
    selectall(e) {
      if (e.length == 0) {
        this.dataid = [];
      } else {
        this.datanew = e;
        let data = [];
        this.datanew.map((item) => {
          data.push(item.id);
        });
        this.dataid = data;
      }
    },
    stockChange(stock) {
      this.orderList.forEach((item) => {
        if (this.goodsId == item.id) {
          item.branch_stock = stock;
        }
      });
    },
    // 库存管理
    stockControl(row) {
      this.goodsId = row.id;
      this.$refs.stock.modals = true;
      this.$refs.stock.productAttrs(row);
    },
    //跳转刷新
    getPath() {
      this.formValidate.page = 1;
      this.formValidate.type = this.$route.query.type.toString();
      this.getList();
    },
    // 上下架
    changeSwitch(row) {
      setShowApi(row.id, row.is_show)
        .then((res) => {
          this.$Message.success(res.msg);
          this.getHeader();
          this.getList();
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    //获取列表
    getList() {
      this.loading = true;
      productListInfo(this.formValidate).then((res) => {
        this.orderList = res.data.list;
        this.total = res.data.count;
        this.loading = false;
      });
    },
    //头部列表
    getHeader() {
      this.loading = true;
      productHeaderInfo().then((res) => {
        this.headerList = res.data.list;
        console.log(this.$route.fullPath)
        if (this.$route.fullPath === "/store/product/index?type=5") {
          this.getPath();
        } else {
          this.getList();
        }
      });
    },
    // 商品分类；
    goodsCategory() {
      cascaderListApi()
        .then((res) => {
          this.data = res.data;
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    //详情
    detail(id) {
      this.goodsId = id;
      this.isProductBox = true;
    },
    // 编辑
    edit(row) {
      this.$router.push({ path: "/store/product/edit_product/" + row.id });
    },
    // 编辑
    reply(id) {
      this.$router.push({ path: '/store/product/product_reply?id=' + id });
    },
    //搜索
    search() {
      this.formValidate.page = 1;
      this.getList();
    },
    //重置
    reset() {
      this.formValidate.page = 1;
      this.value1 = [];
      this.formValidate.store_name = "";
      this.formValidate.cate_id = "";
      this.getList();
    },
    //获取商品分类列表
    cascaderSearchs(value) {
      this.formValidate.page = 1;
      this.formValidate.cate_id = value[value.length - 1];
      this.getList();
    },
    //切换头部列表
    onClickTab(e) {
      this.formValidate.type = e;
      this.formValidate.page = 1;
      this.getList();
    },
    //分页
    pageChange(page) {
      this.formValidate.page = page;
      this.getList();
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ivu-form-label-left .ivu-form-item-label {
  text-align: right;
}

/deep/.ivu-page-header,
/deep/.ivu-tabs-bar {
  border-bottom: 1px solid #ffffff;
}

/deep/.ivu-card-body {
  padding: 0;
}

/deep/.ivu-tabs-nav {
  height: 45px;
}

.bg {
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.tabbox {
  padding: 16px 20px 0px;
}

.box {
  padding: 20px;
  padding-bottom: 0px;
}

.tablebox {
  margin-top: 15px;
}

.btnbox {
  padding: 20px 0px 0px 30px;

  .btns {
    width: 99px;
    height: 32px;
    background: #1890ff;
    border-radius: 4px;
    text-align: center;
    line-height: 32px;
    color: #ffffff;
    cursor: pointer;
  }
}

.table {
  padding: 0px 30px 15px 30px;
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

.search {
  width: 86px;
  height: 32px;
  background: #1890ff;
  border-radius: 4px;
  text-align: center;
  line-height: 32px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}

.reset {
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
</style>
