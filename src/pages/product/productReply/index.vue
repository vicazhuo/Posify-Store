<template>
  <div class="article-manager">
    <div class="i-layout-page-header" v-if="$route.query.id">
      <PageHeader class="product_tabs" hidden-breadcrumb>
        <div slot="title">
          <router-link :to="{ path: '/store/product/index' }"><Button icon="ios-arrow-back" size="small"
              class="mr20">返回</Button></router-link>
          <span class="mr20">评论记录</span>
        </div>
      </PageHeader>
    </div>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <Form ref="formValidate" :model="formValidate" :label-width="labelWidth" :label-position="labelPosition"
        @submit.native.prevent>
        <Row type="flex" :gutter="24">

          <Col v-bind="grid">
          <FormItem label="评价状态：">
            <Select v-model="formValidate.is_reply" placeholder="请选择" clearable @on-change="userSearchs">
              <Option value="1">已回复</Option>
              <Option value="0">待回复</Option>
            </Select>
          </FormItem>
          </Col>
          <Col v-bind="grid" v-if="!$route.params.id">
          <FormItem label="商品信息：" label-for="store_name">
            <Input size="default" enter-button placeholder="请输入商品ID或者商品信息" clearable
              v-model="formValidate.store_name" />
          </FormItem>
          </Col>
          <Col v-bind="grid">
          <FormItem label="用户名称：" label-for="account">
            <Input size="default" enter-button placeholder="请输入" clearable v-model="formValidate.account" />
          </FormItem>
          </Col>
          <Col :xl="3" :lg="3" :md="12" :sm="12" :xs="24" class="search">
          <FormItem>
            <Button type="primary" icon="ios-search" @click="userSearchs">搜索</Button>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <Table ref="table" :columns="columns" :data="tableList" class="ivu-mt" :loading="loading"
        @on-sort-change="sortChanged" no-data-text="暂无数据" no-filtered-data-text="暂无筛选结果">
        <template slot-scope="{ row }" slot="info">
          <div class="imgPic acea-row row-middle">
            <viewer>
              <div class="pictrue"><img v-lazy="row.image" /></div>
            </viewer>
            <div class="info">{{ row.store_name }}</div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="content">
          <div class="mb5 content_font">{{ row.comment }}</div>
          <viewer>
            <div class="pictrue mr10" v-for="(item, index) in row.pics || []" :key="index">
              <img v-lazy="item" />
            </div>
          </viewer>
        </template>
        <template slot-scope="{ row }" slot="merchant_reply_content">
          <div class="mb5 content_font" v-if="row.replyComment">{{ row.replyComment.content }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a @click="reply(row)">回复</a>
          <!-- <Divider type="vertical" />
          <a @click="del(row, '删除评论', index)">删除</a> -->
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="total" :current="formValidate.page" show-elevator show-total @on-change="pageChange"
          :page-size="formValidate.limit" />
      </div>
    </Card>
    <Modal v-model="modals" scrollable title="回复内容" closable>
      <Form ref="contents" :model="contents" :rules="ruleInline" :label-position="labelPosition" @submit.native.prevent>
        <FormItem prop="content">
          <Input v-model="contents.content" type="textarea" :rows="4" placeholder="请输入回复内容" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="oks">确定</Button>
        <Button @click="cancels">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { productReplyApi, setReplyApi, fictitiousReply } from "@/api/product";
export default {
  name: "productReply",
  data() {
    return {
      modals: false,
      grid: {
        xl: 7,
        lg: 10,
        md: 12,
        sm: 12,
        xs: 24,
      },
      formValidate: {
        is_reply: "",
        store_name: "",
        account: "",
        product_id:
          this.$route.query.id === undefined ? 0 : this.$route.query.id,
        page: 1,
        limit: 15,
      },
      value: "45",
      tableList: [],
      total: 0,
      loading: false,
      columns: [
        {
          title: "评论ID",
          key: "id",
          width: 80,
        },
        {
          title: "商品信息",
          slot: "info",
          minWidth: 280,
        },
        {
          title: "用户名称",
          key: "nickname",
          minWidth: 150,
        },
        {
          title: "评分",
          key: "score",
          // sortable: 'custom',
          minWidth: 90,
        },
        {
          title: "评价内容",
          slot: "content",
          minWidth: 210,
        },
        {
          title: "回复内容",
          slot: "merchant_reply_content",
          minWidth: 250,
        },
        {
          title: "评价时间",
          key: "add_time",
          // sortable: true,
          minWidth: 150,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          minWidth: 150,
        },
      ],
      contents: {
        content: "",
      },
      ruleInline: {
        content: [
          { required: true, message: "请输入回复内容", trigger: "blur" },
        ],
      },
      rows: {},
    };
  },
  computed: {
    ...mapState("store/layout", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 75;
    },
    labelPosition() {
      return this.isMobile ? "top" : "left";
    },
  },
  created() {
    if (this.$route.query.is_reply == 0) {
      this.formValidate.is_reply = this.$route.query.is_reply;
    }
    this.getList();
  },
  watch: {
    "$route.params.id"(to, from) {
      this.formValidate.product_id = 0;
      this.getList();
    },
  },
  methods: {
    // 排序
    sortChanged(e) {
      this.formValidate[e.key] = e.order;
      this.getList();
    },
    // 添加虚拟评论；
    add() {
      this.$modalForm(fictitiousReply(this.formValidate.product_id)).then(() =>
        this.getList()
      );
    },
    oks() {
      this.modals = true;
      this.$refs["contents"].validate((valid) => {
        if (valid) {
          setReplyApi(this.contents, this.rows.id)
            .then(async (res) => {
              this.$Message.success(res.msg);
              this.modals = false;
              this.$refs["contents"].resetFields();
              this.getList();
            })
            .catch((res) => {
              this.$Message.error(res.msg);
            });
        } else {
          return false;
        }
      });
    },
    cancels() {
      this.modals = false;
      this.$refs["contents"].resetFields();
    },
    // 删除
    del(row, tit, num) {
      let delfromData = {
        title: tit,
        num: num,
        url: `product/reply/${row.id}`,
        method: "DELETE",
        ids: "",
      };
      this.$modalSure(delfromData)
        .then((res) => {
          this.$Message.success(res.msg);
          this.tableList.splice(num, 1);
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 回复
    reply(row) {
      this.modals = true;
      this.rows = row;
    },
    // 列表
    getList() {
      this.loading = true;
      this.formValidate.is_reply = this.formValidate.is_reply || "";
      this.formValidate.store_name = this.formValidate.store_name || "";
      productReplyApi(this.formValidate)
        .then(async (res) => {
          let data = res.data;
          this.tableList = data.list;
          this.total = res.data.count;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$Message.error(res.msg);
        });
    },
    pageChange(index) {
      this.formValidate.page = index;
      this.getList();
    },
    // 表格搜索
    userSearchs() {
      this.formValidate.page = 1;
      this.getList();
    },
    search() { },
  },
};
</script>
<style scoped lang="stylus">
	/deep/.ivu-card-body{padding-bottom: 0px}
	/deep/.acea-row.row-right{padding-bottom: 20px}
.content_font {
  color: #2b85e4;
}

.search {
  >>> .ivu-form-item-content {
    margin-left: 0 !important;
  }
}

.ivu-mt .Button .bnt {
  margin-right: 6px;
}

.ivu-mt .ivu-table-row {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.ivu-mt >>> .ivu-table-cell {
  padding: 10px 0 !important;
}

.pictrue {
  height: 36px;
  display: inline-block;
  cursor: pointer;
}

.pictrue img {
  height: 100%;
  display: block;
}

.ivu-mt .imgPic .info {
  width: 60%;
  margin-left: 10px;
}

.ivu-mt .picList .pictrue {
  height: 36px;
  margin: 7px 3px 0 3px;
}

.ivu-mt .picList .pictrue img {
  height: 100%;
  display: block;
}
</style>
