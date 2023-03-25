<template>
    <div class="page-account">
        <div class="container">
            <div class="page-account-top ">
                <img :src="login_logo" alt="logo">
            </div>
        </div>
        <div class="index_from page-account-container">
            <div class="title">门店管理</div>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" @keyup.enter="handleSubmit('formInline')">
                <FormItem prop="username">
                    <Input type="text" v-model="formInline.username" prefix="ios-contact-outline" placeholder="请输入用户名"
                        size="default" />
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formInline.password" prefix="ios-lock-outline" placeholder="请输入密码"
                        size="default" />
                </FormItem>
                <FormItem prop="code">
                    <div class="code">
                        <Input type="text" v-model="formInline.code" prefix="ios-keypad-outline" placeholder="请输入验证码"
                            size="default" />
                        <img :src="imgcode" class="pictrue" @click="captchas" />
                    </div>
                </FormItem>
                <FormItem>
                    <Button type="primary" long size="default" @click="handleSubmit('formInline')" class="btn">{{
                            $t('page.login.submit')
                    }}
                    </Button>
                </FormItem>
            </Form>
            <div class="info">{{ site_url }} {{ site_name }}</div>
        </div>
        <Modal v-model="modals" scrollable footer-hide closable title="请完成安全校验" :mask-closable="false" :z-index="2"
            width="342">
            <div class="captchaBox">
                <div id="captcha" style="position: relative" ref="captcha"></div>
                <div id="msg"></div>
            </div>
        </Modal>
    </div>
</template>
<script>
import { AccountLogin, loginInfoApi } from '@/api/account';
import mixins from '../mixins';
import Setting from '@/setting';
import util from '@/libs/util';
import '../../../assets/js/jigsaw.js';

export default {
    mixins: [mixins],
    data() {
        return {
            modals: false,
            autoLogin: true,
            imgcode: '',
            formInline: {
                username: '',
                password: '',
                code: ''
            },
            ruleInline: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            },
            errorNum: 0,
            jigsaw: null,
            login_logo: '',
            site_name: '',
            site_url: ''
        }
    },
    created() {
        var _this = this;
        top != window && (top.location.href = location.href);
        document.onkeydown = function (e) {
            if (_this.$route.name === 'login') {
                let key = window.event.keyCode;
                if (key === 13) {
                    _this.handleSubmit('formInline');
                }
            }
        };
    },
    watch: {
        $route(n) {
            this.captchas();
        }
    },
    mounted: function () {
        this.$nextTick(() => {
            // /* eslint-disable */
            let that = this;
            this.jigsaw = jigsaw.init({
                el: this.$refs.captcha,
                onSuccess() {
                    that.modals = false;
                    that.closeModel();
                },
                onFail: this.closefail,
                onRefresh() {
                }
            });
            this.swiperData();
        });
        this.captchas();
    },
    methods: {
        swiperData() {
            loginInfoApi().then(res => {
                let data = res.data || {};
                this.login_logo = data.login_logo ? data.login_logo : require('@/assets/images/logo.png');
                this.site_name = data.site_name;
                this.site_url = data.site_url;
                localStorage.setItem('file_size_max',data.upload_file_size_max);
            }).catch(res => {
                this.$Message.error(res.msg)
            })
        },
        // 关闭模态框
        closeModel() {
            let msg = this.$Message.loading({
                content: '登录中...',
                duration: 0
            });
            AccountLogin({
                account: this.formInline.username,
                pwd: this.formInline.password,
                imgcode: this.formInline.code
            }).then(async res => {
                this.$store.dispatch('store/account/setPageTitle')
                msg();
                let expires = res.data.expires_time;
                // 记录用户登陆信息
                util.cookies.set('uuid', res.data.user_info.id, {
                    expires: expires
                });
                util.cookies.set('token', res.data.token, {
                    expires: expires
                });
                util.cookies.set('expires_time', res.data.expires_time, {
                    expires: expires
                });
                const db = await this.$store.dispatch('store/db/database', {
                    user: true
                });
                // 保存菜单信息
                // db.set('menus', res.data.menus).set('unique_auth', res.data.unique_auth).set('user_info', res.data.user_info).write();
                db.set('unique_auth', res.data.unique_auth).set('user_info', res.data.user_info).write();

                this.$store.commit('store/menus/getmenusNav', res.data.menus);

                let userInfoStore = {
                    'account': res.data.user_info.account,
                    'avatar': res.data.user_info.avatar,
                    'logo': res.data.logo,
                    'logoSmall': res.data.logo_square
                }
                let storage = window.localStorage;
                storage.setItem('userInfoStore', JSON.stringify(userInfoStore));

                // 记录用户信息
                this.$store.dispatch('store/user/set', {
                    name: res.data.user_info.account,
                    avatar: res.data.user_info.avatar,
                    access: res.data.unique_auth,
                    logo: res.data.logo,
                    logoSmall: res.data.logo_square,
                    version: res.data.version,
                    newOrderAudioLink: res.data.newOrderAudioLink
                });
                if (this.jigsaw) this.jigsaw.reset();
                return this.$router.replace({ path: this.$route.query.redirect || '/store/' });
            }).catch(res => {
                msg();
                let data = res === undefined ? {} : res;
                this.errorNum++;
                this.captchas();
                this.$Message.error(data.msg || '登录失败');
                if (this.jigsaw) this.jigsaw.reset();
            });
        },
        getExpiresTime(expiresTime) {
            let nowTimeNum = Math.round(new Date() / 1000);
            let expiresTimeNum = expiresTime - nowTimeNum;
            return parseFloat(parseFloat(parseFloat(expiresTimeNum / 60) / 60) / 24);
        },
        closefail() {
            if (this.jigsaw) this.jigsaw.reset();
            this.$Message.error('校验错误');
        },
        captchas: function () {
            this.imgcode = Setting.apiBaseURL + '/captcha_store?' + Date.parse(new Date());
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.errorNum >= 2) {
                        this.modals = true;
                    } else {
                        this.closeModel();
                    }
                }
            })
        }
    }
};
</script>
<style scoped lang="stylus">
    .page-account {
        .container{
            width 100%;
            height 350px;
            background-image: url('../../../assets/images/bg.png');
            background-repeat no-repeat;
            background-position: center;
            background-size: cover;
            .page-account-top{
                padding-top 15px!important;
								padding-left 20px!important;
                img{
                    height 41px;
                }
            }
        }
    }

    .page-account .code {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .page-account .code .pictrue {
        height: 32px;
    }

    .swiperPic img {
        width: 100%;
        height: 100%;
    }

    .index_from {
        padding: 0 40px 32px 40px;
        height: 400px;
        box-sizing: border-box;
    }

    .page-account-container {
        box-shadow: 0 2px 9px 6px rgba(0, 0, 0, 0.03);
        border-radius: 5px;
        margin-top -210px;
        background-color #fff;
        .title{
            font-size: 24px;
            font-weight 500;
            color rgba(0, 0, 0, 0.85);
            padding-top 36px;
            margin-bottom 31px;
        }
        .info{
            color: #CCCCCC;
            font-size 12px;
            margin-top 53px;
        }
    }

    .btn {
        background: #1890FF !important;
    }

    .captchaBox {
        width: 310px;
    }

    input {
        display: block;
        width: 290px;
        line-height: 40px;
        margin: 10px 0;
        padding: 0 10px;
        outline: none;
        border: 1px solid #c8cccf;
        border-radius: 4px;
        color: #6a6f77;
    }

    #msg {
        width: 100%;
        line-height: 40px;
        font-size: 14px;
        text-align: center;
    }

    a:link, a:visited, a:hover, a:active {
        margin-left: 100px;
        color: #0366D6;
    }

    .index_from >>> .ivu-input-large
        font-size:14px!important

</style>
