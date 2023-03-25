<template>
    <span class="i-layout-header-trigger i-layout-header-trigger-min">
        <Dropdown :trigger="isMobile ? 'hover' : 'hover'" class="i-layout-header-user" :class="{ 'i-layout-header-user-mobile': isMobile }" @on-click="handleClick">
            <Avatar size="small" :src="infor.avatar" v-if="infor.avatar" />
						<Avatar size="small" :src="headPic" v-else />
            <span class="i-layout-header-user-name">{{ infor.account }}</span>
            <DropdownMenu slot="list">
                <i-link to="/store/system/user">
                    <DropdownItem>
                        <Icon type="ios-contact-outline" />
                        <span>{{ $t('basicLayout.user.center') }}</span>
                    </DropdownItem>
                </i-link>
                <!--<i-link to="/setting/account">-->
                    <!--<DropdownItem>-->
                        <!--<Icon type="ios-settings-outline" />-->
                        <!--<span>{{ $t('basicLayout.user.setting') }}</span>-->
                    <!--</DropdownItem>-->
                <!--</i-link>-->
                <DropdownItem divided name="logout">
                    <Icon type="ios-log-out" />
                    <span>{{ $t('basicLayout.user.logOut') }}</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </span>
</template>
<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        name: 'iHeaderUser',
        data () {
            return {
								headPic: require('@/assets/images/yonghu.png'),
                infor: ''
            }
        },
        computed: {
            ...mapState('store/user', [
                'info'
            ]),
            ...mapState('store/layout', [
                'isMobile',
                'logoutConfirm'
            ])
        },
        methods: {
            ...mapActions('store/account', [
                'logout'
            ]),
            handleClick (name) {
                if (name === 'logout') {
                    this.logout({
                        confirm: this.logoutConfirm,
                        vm: this
                    });
                }
            }
        },
        async mounted () {
					let storage=window.localStorage;
					let value = storage.getItem('userInfoStore')
					this.infor = JSON.parse(value);
      //       const db = await this.$store.dispatch('store/db/database', {
      //           user: true
      //       });
      //       this.inforrr = db.get('user_info').value();
						// console.log('kkkkk',this.inforrr);
        }
    }
</script>
