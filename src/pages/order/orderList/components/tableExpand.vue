<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">商品总价：</span>
                <span class="expand-value" v-text="row.total_price"></span>
            </Col>
            <Col span="8">
                <span class="expand-key">下单时间：</span>
                <span class="expand-value" v-text="row.add_time"></span>
            </Col>
            <Col span="8">
                <span class="expand-key">推广人：</span>
                <span class="expand-value" v-text="row.spread_nickname?row.spread_nickname:'无'"></span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="expand-key">用户备注：</span>
                <Tooltip max-width="300" placement="bottom" transfer>
                    <span class="line2">{{row.mark?row.mark:'无'}}</span>
                    <p slot="content">{{row.mark?row.mark:'无'}}</p>
                </Tooltip>
            </Col>
            <Col span="8">
                <span class="expand-key">商家备注：</span>
                <span class="expand-value" >
                    <Tooltip max-width="300" placement="bottom" transfer>
                        <span class="line2">{{row.remark}}</span>
                        <p slot="content">{{row.remark}}</p>
                    </Tooltip>
                </span>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'table-expand',
        props: {
            row: Object
        }
    }
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
    .ivu-col-span-8 {
        flex: 0 0 25%;
        max-width: 33.333333%;
    }
    .line2 {
        margin-left: 60px;
        margin-right: 80px;
    }
    .ivu-tooltip{
        position: absolute;
        display: inline-block;
        left: -2px;
    }
</style>