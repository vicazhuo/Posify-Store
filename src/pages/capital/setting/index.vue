<template>
	<div>
		<div class="box">
			<Form :model="formItem" :label-width="120" :rules="rules">
				<FormItem label="提现银行开户行：">
					<Input maxlength="20" show-word-limit type="text" v-model="formItem.bank_address" placeholder="不超过20字" class="input"></Input>
				</FormItem>
				<FormItem label="银行卡号：" prop="bank_code">
					<Input maxlength="20" show-word-limit v-model="formItem.bank_code" type="text" placeholder="不超过20字" class="input"></Input>
				</FormItem>
				<FormItem label="支付宝账号：">
					<Input maxlength="20" show-word-limit v-model="formItem.alipay_account" placeholder="不超过20字" class="input"></Input>
				</FormItem>
				<FormItem label="支付宝收款码：" class="imgbox">
					<div class="pictrueBox" @click="modalPicTap('dan', 'alipay')">
						<div class="pictrue" v-if="formItem.alipay_qrcode_url">
							<img v-lazy="formItem.alipay_qrcode_url" />
							<Input
							  v-model="formItem.alipay_qrcode_url"
							  style="display: none"
							></Input>
						</div>
						<div class="upLoad acea-row row-center-wrapper" v-else>
							<Input
							  v-model="formItem.alipay_qrcode_url"
							  style="display: none"
							></Input>
							<Icon type="ios-camera-outline" size="26" />
						</div>
					</div>
				</FormItem>
				<FormItem label="微信账号：">
					<Input maxlength="20" show-word-limit v-model="formItem.wechat" placeholder="不超过20字" class="input"></Input>
				</FormItem>
				<FormItem label="微信收款码：" class="imgbox">
					<div class="pictrueBox" @click="modalPicTap('dan', 'weixin')">
						<div class="pictrue" v-if="formItem.wechat_qrcode_url">
							<img v-lazy="formItem.wechat_qrcode_url" />
							<Input
							  v-model="formItem.wechat_qrcode_url"
							  style="display: none"
							></Input>
						</div>
						<div class="upLoad acea-row row-center-wrapper" v-else>
							<Input
							  v-model="formItem.wechat_qrcode_url"
							  style="display: none"
							></Input>
							<Icon type="ios-camera-outline" size="26" />
						</div>
					</div>
				</FormItem>
			</Form>
		</div>
		<Card :bordered="false" dis-hover class="ive-mt save">
			<div class="savebox"@click="save">保存</div>
		</Card>
		<Modal
		  v-model="modalPic"
		  width="950px"
		  scrollable
		  footer-hide
		  closable
		  title="上传商品图"
		  :mask-closable="false"
		  :z-index="1"
		>
		  <uploadPictures
		    :isChoice="isChoice"
		    @getPic="getPic"
		    :gridBtn="gridBtn"
		    :gridPic="gridPic"
		    v-if="modalPic"
		  ></uploadPictures>
		</Modal>
	</div>
</template>

<script>
	import { settingApi, settingSaveApi } from "@/api/capital"
	import uploadPictures from "@/components/uploadPictures";
	export default {
	    name: 'setting',
		components: {
		  uploadPictures,
		},
	    data () {
			return{
				modalPic: false,
				isChoice: "",
				gridBtn: {
				  xl: 4,
				  lg: 8,
				  md: 8,
				  sm: 8,
				  xs: 8,
				},
				gridPic: {
				  xl: 6,
				  lg: 8,
				  md: 12,
				  sm: 12,
				  xs: 12,
				},
				picTit: "",
				tableIndex: 0,
				formItem: {
					bank_address: "",
					bank_code: '',
					alipay_account: '',
					alipay_qrcode_url: '',//支付宝
					wechat: '',
					wechat_qrcode_url: '',//微信
				},
				rules: {
					bank_code: [
						{ pattern: /[^[0-9]*$/, message: "银行卡号格式不正确", trigger: "change" }
					]
				},
			}
		},
		mounted() {
			this.getList()
		},
		methods:{
			getList(){
				settingApi().then(res=>{
					this.formItem.bank_address = res.data.bank_address
					this.formItem.bank_code = res.data.bank_code
					this.formItem.alipay_account = res.data.alipay_account
					this.formItem.alipay_qrcode_url = res.data.alipay_qrcode_url
					this.formItem.wechat = res.data.wechat
					this.formItem.wechat_qrcode_url = res.data.wechat_qrcode_url
				})
			},
			save(){
				settingSaveApi(this.formItem).then(res=>{
					this.$Message.success(res.msg)
				}).catch(err=>{
					this.$Message.error(err.msg)
				})
			},
			// 获取单张图片信息
			getPic(pc) {
			  switch (this.picTit) {
			    case "weixin":
					  this.formItem.wechat_qrcode_url = pc.att_dir;
			     break;
				 case "alipay":
					this.formItem.alipay_qrcode_url = pc.att_dir
				 break
			  }
			  this.modalPic = false;
			},
			// 点击商品图
			modalPicTap(tit, picTit, index) {
			  this.modalPic = true;
			  this.isChoice = tit === "dan" ? "单选" : "多选";
			  this.picTit = picTit;
			  this.tableIndex = index;
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/input[type='number'] {
	    -moz-appearance:textfield;
	}
	/deep/input[type=number]::-webkit-inner-spin-button,
	/deep/input[type=number]::-webkit-outer-spin-button {
	    -webkit-appearance: none;
	    margin: 0;
	}
	img{
		width: 70px;
		height: 70px;
		border-radius: 4px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		float: left;
	}
	.height{
		line-height: 70px;
	}
	.box{
		
		// width: 1192px;
		// height: 741px;
		background: #FFFFFF;
		padding: 15px 14px 26px;
		text-align: center;
		display: flex;
		justify-content: center;
		padding-top: 70px;
		font-size: 13px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.85);
		.input{
			width: 400px;
			font-size: 13px;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.25);
		}
	}
	.save{
		border-top: 1px solid  #FFFFFF;
		box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
		.savebox{
			width: 86px;
			height: 30px;
			background: #1890FF;
			border-radius: 2px;
			text-align: center;
			cursor: pointer;
			line-height: 30px;
			color: #FFFFFF;
			margin: 0 auto;
				
		}
	}
	.imgbox{
		text-align: left;
		
		.pictrueBox{
			width: 70px;
			.pictrue {
			  width: 60px;
			  height: 60px;
			  border: 1px dotted rgba(0, 0, 0, 0.1);
			  margin-right: 15px;
			  display: inline-block;
			  position: relative;
			  cursor: pointer;
			
			  img {
			    width: 100%;
			    height: 100%;
			  }
			
			  .btndel {
			    position: absolute;
			    z-index: 1;
			    width: 20px !important;
			    height: 20px !important;
			    left: 46px;
			    top: -4px;
			  }
			}
			
		}
		
		.upLoad {
		  width: 70px;
		  height: 70px;
		  line-height: 70px;
		  border: 1px dotted rgba(0, 0, 0, 0.1);
		  border-radius: 4px;
		  background: rgba(0, 0, 0, 0.02);
		  cursor: pointer;
		}
	}
</style>
