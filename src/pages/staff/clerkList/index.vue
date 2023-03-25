<template>
  <div>
    <Card :bordered="false" dis-hover class="ivu-mt box">
      <Form
        ref="formValidate"
        :model="formValidate"
        :label-width="labelWidth"
        :label-position="labelPosition"
      >
        <Row type="flex" :gutter="24">
          <Col>
            <FormItem label="店员搜索：" :labelWidth="80">
              <Input
                v-model="formValidate.keyword"
                placeholder="请输入ID/手机号"
                clearable
              >
                <Select
                  v-model="formValidate.field_key"
                  slot="prepend"
                  style="width: 80px"
                >
                  <Option value="all">全部</Option>
                  <Option value="id">ID</Option>
                  <Option value="phone">手机号</Option>
                </Select>
              </Input>
            </FormItem>
          </Col>
          <Col>
            <div class="search" @click="search">搜索</div>
          </Col>
          <Col>
            <div class="reset" @click="reset">重置</div>
          </Col>
        </Row>
      </Form>
    </Card>

    <Card :bordered="false" dis-hover class="ive-mt tablebox">
      <div class="btnbox">
        <Button v-auth="['staff-staff-create']" type="primary" @click="add"
          >添加店员</Button
        >
      </div>
      <div class="table">
        <Table
          :columns="columns"
          :data="orderList"
          ref="table"
          class="mt25"
          :loading="loading"
          highlight-row
          no-userFrom-text="暂无数据"
          no-filtered-userFrom-text="暂无筛选结果"
        >
          <template slot-scope="{ row, index }" slot="avatars">
            <viewer>
              <div class="tabBox_img">
                <img v-lazy="row.avatar" />
              </div>
            </viewer>
          </template>
					<template slot-scope="{ row, index }" slot="staff_name">
					  <div>{{row.staff_name}}<span style="color: #ed4014;" v-if="row.delete_time != null"> (已注销)</span></div>
					</template>
		  <template slot-scope="{ row, index }" slot="label">
			  <div>{{row.workMember.name}}</div>
		  </template>
          <template slot-scope="{ row, index }" slot="status">
            <i-switch
              v-model="row.status"
              :value="row.status"
              :true-value="1"
              :false-value="0"
              @on-change="changeSwitch(row)"
              size="large"
            >
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a @click="goCashier(row)" v-if="row.status == 1 && row.delete_time == null">进入收银台</a>
            <Divider type="vertical" v-if="row.status == 1 && row.delete_time == null" />
            <a @click="edit(row.id)" v-if="row.delete_time == null">编辑</a>
            <Divider type="vertical" v-if="row.delete_time == null" />
            <a @click="del(row.id, '删除该店员', index)">删除</a>
            <Divider type="vertical" />
            <a @click="details(row)">查看详情</a>
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
    <Details ref="userDetails"></Details>
  </div>
</template>

<script>
import { mapState } from "vuex";
import util from "@/libs/util";
import Cookies from "js-cookie";

import {
  staffListInfo,
  staffcreate,
  staffEditApi,
  staffshowApi,
  cashierLogin,
} from "@/api/staff.js";
import Details from "../components/details";
export default {
  name: "clerkList",
  components: {
    Details,
  },
  data() {
    return {
      total: 0,
      a: 12,
      loading: false,
      columns: [
        {
          title: "ID",
          key: "id",
          width: 60,
        },
        {
          title: "头像",
          slot: "avatars",
          minWidth: 80,
        },
        {
          title: "昵称",
          slot: "staff_name",
          minWidth: 120,
        },
        {
          title: "店员身份",
          key: "roles",
          minWidth: 120,
        },
		{
		  title: "企微员工",
		  slot: "label",
		  minWidth: 120,
		},
        {
          title: "手机号",
          key: "phone",
          minWidth: 150,
        },
        {
          title: "账号状态",
          slot: "status",
          minWidth: 80,
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
        field_key: "all",
        keyword: "",
        page: 1,
        limit: 15,
      },
    };
  },
  computed: {
    ...mapState("store/layout", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 80;
    },
    labelPosition() {
      return this.isMobile ? "top" : "left";
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    goCashier(item) {
      cashierLogin(item.id)
        .then((res) => {
          Cookies.set("cashierData", JSON.stringify(res));
          window.open(
            window.location.protocol +
              "//" +
              window.location.host +
              "/cashier/login"
          );
        })
        .catch((err) => {
          console.log(err);
          this.$Message.error(err.msg);
        });
    },
    //列表
    getList() {
      this.loading = true;
      staffListInfo(this.formValidate)
        .then((res) => {
          this.total = res.data.count;
          this.orderList = res.data.list;
          this.loading = false;
        })
        .catch((err) => {
          this.$Message.error(err.msg);
          this.loading = false;
        });
    },
    //添加
    add() {
      this.$modalForm(staffcreate()).then(() => this.getList());
    },
    //编辑
    edit(id) {
      this.$modalForm(staffEditApi(id)).then(() => this.getList());
    },
    //删除
    del(id, tit, num) {
      let delfromData = {
        title: tit,
        num: num,
        url: `/staff/staff/${id}`,
        method: "DELETE",
        ids: "",
      };
      this.$modalSure(delfromData)
        .then((res) => {
          this.$Message.success(res.msg);
          // this.tabList.splice(num, 1);
          this.getList();
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    //搜索
    search() {
      this.getList();
    },
    //重置
    reset() {
      this.formValidate.field_key = "all";
      this.formValidate.keyword = "";
      this.getList();
    },
    //状态
    changeSwitch(row) {
      staffshowApi(row.id, row.status)
        .then((res) => {
          this.$Message.success(res.msg);
        })
        .catch((err) => {
          this.$Message.error(res.msg);
        });
    },
    //分页
    pageChange(status) {
      this.formValidate.page = status;
      this.getList();
    },
    //详情
    details(row) {
      this.$refs.userDetails.modals = true;
      this.$refs.userDetails.getDetails(row.id);
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
.box {
  padding: 20px;
  padding-bottom: 1px;
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
