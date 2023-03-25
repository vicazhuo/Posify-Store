<template>
    <div style="width: 100%">
        <Modal v-model="modals" scrollable footer-hide closable title="配送员详情" :mask-closable="false"
               width="900">
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div class="acea-row">
                <div class="avatar mr15"><img :src="psInfo.avatar"></div>
                <div class="dashboard-workplace-header-tip">
                    <p class="dashboard-workplace-header-tip-title" v-text="psInfo.nickname || '-'"></p>
                    <div class="dashboard-workplace-header-tip-desc">
                        <span class="dashboard-workplace-header-tip-desc-sp" v-for="(item, index) in detailsData" :key="index">{{item.title+'：'+item.value+' '+item.key}}</span>
                    </div>
                </div>
            </div>
            <Row type="flex" justify="space-between" class="mt25">
                <Col span="24">
                    <Table :columns="columns" :data="userLists" max-height="400"
                           ref="table"
                           :loading="loading"
                           no-userFrom-text="暂无数据"
                           no-filtered-userFrom-text="暂无筛选结果"
                    ></Table>
                    <div class="acea-row row-right page">
                        <Page :total="total" :current="userFrom.page" show-elevator show-total @on-change="pageChange"
                              :page-size="userFrom.limit"  /></div>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import { deliveryInfoApi, infoApi } from '@/api/staff';

    export default {
        name: 'userDetails',
        data () {
            return {
                theme2: 'light',
                modals: false,
                spinShow: false,
                detailsData: [],
                userId: 0,
                loading: false,
                userFrom: {
                    type: 'cashier_order',
                    page: 1, // 当前页
                    limit: 10 // 每页显示条数
                },
                total: 0,
                columns: [
                    {
                        title: '订单ID',
                        key: 'order_id',
                        minWidth: 160
                    },
                    {
                        title: '收货人',
                        key: 'real_name',
                        minWidth: 100
                    },
                    {
                        title: '商品数量',
                        key: 'total_num',
                        minWidth: 90
                    },
                    {
                        title: '商品总价',
                        key: 'total_price',
                        minWidth: 110
                    },
                    {
                        title: '实付金额',
                        key: 'pay_price',
                        minWidth: 120
                    },
                    {
                        title: '交易完成时间',
                        key: 'pay_time',
                        minWidth: 120
                    }
                ],
                userLists: [],
                psInfo: {},
            }
        },
        created () {
        },
        methods: {
            // 会员详情
            getDetails (id) {
                this.userId = id;
                this.spinShow = true;
                this.loading = true;
                deliveryInfoApi(id,this.userFrom).then(async res => {
                    if (res.status === 200) {
                        let data = res.data
                        this.detailsData = data.data;
                        this.psInfo = data.info;
						this.userLists = data.list.list
						this.total = data.list.count
                        this.spinShow = false;
						this.loading = false;
                    } else {
                        this.spinShow = false;
						this.loading = false;
                        this.$Message.error(res.msg);
                    }
                }).catch(res => {
                    this.spinShow = false;
					this.loading = false;
                    this.$Message.error(res.msg);
                })
            },
            pageChange (index) {
                this.userFrom.page = index
				this.getDetails(this.userId)
            },
        }
    }
</script>

<style lang="less" scoped>
    .avatar{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        img{
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
                        color: #17233D;
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
    .user_menu >>> .ivu-menu
       width 100% !important
</style>
