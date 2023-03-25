<template>
  <div class="acea-row">
    <div
      class="i-layout-sider-logo"
      :class="{ 'i-layout-sider-logo-dark': siderTheme === 'dark' }"
    >
      <transition name="fade-quick">
        <i-link style="width: 100%;height: 60px;display: block;line-height: 60px;">
          <img :src="logoSmall" v-if="menuCollapse" />
          <img :src="logo" v-else-if="siderTheme === 'light'" />
          <img :src="logo" v-else />
        </i-link>
      </transition>
      <div class="list">
        <div :class="{on:parentCur == index}" class="parent-nav-item" v-for="(nav,index) in filterSider" :key="index" @click="handelParentClick(nav,index)">
          <Icon :type="nav.icon" v-if="nav.icon" class="icon" />
          <div>{{nav.title}}</div>
        </div>
      </div>
    </div>
    <div class="menu" v-if="filterSider[parentCur].children">
      <div class="title">{{ filterSider[parentCur].title}}</div>
      <Menu
              ref="menu"
              class="i-layout-menu-side i-scrollbar-hide"
              :theme="siderTheme"
              :accordion="menuAccordion"
              :active-name="activePath"
              :open-names="openNames"
              width="auto"
      >
        <template v-if="!menuCollapse" v-for="(item, index) in filterSider[parentCur].children">
          <i-menu-side-item
                  v-if="item.children === undefined || !item.children.length"
                  :menu="item"
                  :key="index"
          />
          <i-menu-side-submenu v-else :menu="item" :key="index" />
        </template>
        <template v-else>
          <Tooltip
                  :content="tTitle(item.title)"
                  placement="right"
                  v-if="item.children === undefined || !item.children.length"
                  :key="index"
          >
            <i-menu-side-item :menu="item" hide-title />
          </Tooltip>
          <i-menu-side-collapse v-else :menu="item" :key="index" top-level />
        </template>
      </Menu>
    </div>
  </div>
</template>
<script>
import iMenuSideItem from "./menu-item";
import iMenuSideSubmenu from "./submenu";
import iMenuSideCollapse from "./menu-collapse";
import tTitle from "../mixins/translate-title";

import { mapState, mapGetters } from "vuex";

export default {
  name: "iMenuSide",
  mixins: [tTitle],
  components: { iMenuSideItem, iMenuSideSubmenu, iMenuSideCollapse },
  props: {
    hideLogo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      logo: require("@/assets/images/logo.png"),
      logoSmall: require("@/assets/images/logo-small.png"),
      parentCur:0,
    };
  },
  computed: {
    ...mapState("store/layout", [
      "siderTheme",
      "menuAccordion",
      "menuCollapse",
      "isChildren"
    ]),
    ...mapState("store/menu", ["activePath", "openNames"]),
    ...mapGetters("store/menu", ["filterSider"]),
  },
  watch: {
		$route: {
		  handler(n) {
				let that = this;
				let activeLink = n.path;
				let storage=window.localStorage;
				storage.setItem('chiidLinkStore',activeLink);
				let funLink = function (children,index) {
					children.forEach((item)=>{
						if(activeLink == item.path){
						    that.parentCur = index
								storage.setItem('parentLinkStore',that.filterSider[index].path);
								if (that.filterSider[index].hasOwnProperty('children')) {
									storage.setItem('isChildren', true);
								} else {
									storage.setItem('isChildren', false);
								}
								return false;
						}
						if(item.children){
							funLink(item.children,index);
						}
					})
				}
				
				this.filterSider.forEach((item,index)=>{
					if(item.children){
						funLink(item.children,index);
					}else{
						if(activeLink == item.path){
						    that.parentCur = index
						    that.$store.commit('admin/layout/setParentCur', index);
								that.$store.commit('admin/layout/setChildren', false);
								return false;
						}
					}
				})
				this.handleUpdateMenuState();
		  },
		  immediate: true,
		},
    // 在展开/收起侧边菜单栏时，更新一次 menu 的状态
    menuCollapse() {
      this.handleUpdateMenuState();
    },
  },
  mounted() {
    this.getLogo();
    this.activeMenu();
  },
  methods: {
    activeMenu(){
      let storage=window.localStorage;
			let activeLink = storage.getItem('parentLinkStore');
			let chiidLink = storage.getItem('chiidLinkStore');
			if(storage.getItem('isChildrenStore') == null || activeLink == this.filterSider[0].path){
				if(this.filterSider[0].hasOwnProperty('children')){
					 this.$store.commit('store/layout/setChildren', true);
				}else{
					this.$store.commit('store/layout/setChildren', false);
				}
			}else{
				this.$store.commit('store/layout/setChildren', JSON.parse(storage.getItem('isChildrenStore')));
				this.filterSider.forEach((item,index)=>{
				  if(activeLink == item.path){
				     this.parentCur = index
				  }
				})
				this.$router.push({
				  path:chiidLink
				})
			}
    },
    handelParentClick(nav,index){
      this.parentCur = index;
      let chiidLink = '';
      let storage=window.localStorage;
      if(nav.children){
        if(nav.children[0].children){
          var recursiveFunction = function () {
            const getStr = function (list) {
              list.children.forEach(function (row, index) {
                if (list.children[0].children) {
                  getStr(list.children[0])
                } else {
                  if(index == 0) return chiidLink = row.path
                }
              })
            }
            getStr(nav.children[0])
          }
          recursiveFunction()
        }else {
           chiidLink = nav.children[0].path
        }
        this.$store.commit('store/layout/setChildren', true);
        storage.setItem('isChildrenStore',true);
      }else {
        chiidLink = nav.path
        this.$store.commit('store/layout/setChildren', false);
        storage.setItem('isChildrenStore',false);
      }
      this.$router.push({
        path:chiidLink
      })
      storage.setItem('parentLinkStore',nav.path);
			storage.setItem('chiidLinkStore',chiidLink);
    },
    handleUpdateMenuState() {
      this.$nextTick(() => {
        if (this.$refs.menu) {
          this.$refs.menu.updateActiveName();
          if (this.menuAccordion) this.$refs.menu.updateOpened();
        }
      });
    },
    getLogo() {
			let storage=window.localStorage;
			let value = storage.getItem('userInfoStore')
			let infoUser = JSON.parse(value);
			this.logo = infoUser.logoSmall ? infoUser.logoSmall : this.logoSmall;
			this.logoSmall = infoUser.logoSmall ? infoUser.logoSmall : this.logoSmall;
      // this.$store
      //   .dispatch("store/db/get", {
      //     dbName: "sys",
      //     path: "user.info",
      //     user: true,
      //   })
      //   .then((res) => {
      //     this.logo = res.logo ? res.logo : this.logo;
      //     this.logoSmall = res.logoSmall ? res.logoSmall : this.logoSmall;
      //   });
    },
  },
};
</script>
<style scoped lang="stylus">
  ::-webkit-scrollbar-thumb{
    -webkit-box-shadow: inset 0 0 6px #fff;
  }
  ::-webkit-scrollbar {
    width: 0!important; /*对垂直流动条有效*/
  }
  /deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
    background: #F0F2F5;
    color #515a6e;
  }
  /deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after{
    background: #F0F2F5;
  }
  /deep/.i-layout-menu-side .ivu-menu-submenu-title, /deep/.i-layout-menu-side .ivu-menu-item{
    height 40px!important;
    line-height 40px;
    padding 0 10px 0 20px!important;
  }
  .menu{
    width 160px;
    .title{
       height 61px;
       width 100%;
      text-align center;
      line-height 61px;
      font-size 15px;
      font-weight 600;
      border-bottom: 1px solid #e9e9e9;
      border-right 1px solid #f7f7f7;
    }
  }
  .i-layout-sider-logo{
    height calc(100vh);
    line-height unset;
    width 60px;
    background-color #001529;
    color #fff;
    font-size 14px;
    border-bottom unset;
    overflow-y auto;
    overflow-x: hidden;
    .list{
      // margin-top 30px;
      .parent-nav-item{
        width 100%;
        /*height 60px;*/
        padding 11px 0;
        margin-bottom 5px;
        cursor pointer;
        &.on{
          background-color #1890FF;
        }
        .icon{
          font-size 18px;
        }
      }
    }
    img{
      width 41px;
      height 41px;
      border-radius 50%;
    }
  }
</style>
