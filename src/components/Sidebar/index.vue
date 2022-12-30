<template>
  <div>
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :wrap-class="['scrollbar-wrapper', typeSiderbar === 2 && 'hover-overflow']">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="typeSiderbar !== 2 ? variables.menuBg : variables.menuTopBg"
        :text-color="typeSiderbar !== 2 ? variables.menuText : variables.menuTopText"
        :active-text-color="variables.menuActiveText"
        :mode="mode"
        :collapse-transition="false"
        :unique-opened="false"
        class="menu-siderbar"
      >
        <sidebar-item
          v-for="route in routesList"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
    <version v-if="typeSiderbar === 1" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import Version from "@/components/Version";
import variables from "@/styles/variables.module.scss";
export default {
  components: { Logo, Version },
  props: {
    // 布局方式
    mode: {
      type: String,
      default: "vertical"
    },
    // 导航栏数据
    routerList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["routes", "sidebar"]),
    ...mapState({
      typeSiderbar: (state) => state.settings.typeSiderbar
    }),
    routesList() {
      const routers = this.typeSiderbar === 3 ? this.routerList : this.routes;
      return routers;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    typeSiderbar() {
      return this.$store.state.settings.typeSiderbar;
    }
  }
};
</script>
