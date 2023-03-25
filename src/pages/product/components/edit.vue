<template>
    <Modal v-model="modals"  scrollable title="编辑商品" :closable="false">
        <div>
			<Table :columns="columns" :data="orderList" ref="table" class="mt25"
			       :loading="loading" highlight-row
			       no-userFrom-text="暂无数据"
			       no-filtered-userFrom-text="暂无筛选结果">
			    <template slot-scope="{ row, index }" slot="action">
			        <a @click="edit(row)">删除</a>
			    </template>
			</Table>
		</div>
		<div slot="footer">
		    <Button  type="primary">提交</Button>
		    <Button>取消</Button>
		</div>
    </Modal>
</template>

<script>
    export default {
        name: 'edit',
        data () {
            return {
                modals: false,
				loading: false,
				columns: [
					{
					  title: "商品ID",
					  key: "id",
					  width: 60,
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
					  key: "sales",
					  sortable: true,
					  minWidth: 90,
					},
					{
					  title: "库存",
					  key: "stock",
					  minWidth: 80,
					},
					{
					  title: "排序",
					  key: "sort",
					  minWidth: 70,
					},
					{
					  title: "操作",
					  slot: "action",
					  fixed: "right",
					  minWidth: 50,
					}
				],
				orderList:[{id:1,price:"200",sales:"234"}],
            }
        },
        methods: {
			getlist(id){
				console.log(id)
			}
		}
           
    }
</script>

<style scoped>

</style>
