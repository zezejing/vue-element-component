<template>
  <div>
    <div class="left—sidebar">
      <logo v-if="showLogo" :collapse="true" />
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          mode="vertical"
          :collapse-transition="false"
          :unique-opened="false"
          router
        >
          <div v-for="item in routes" :key="item.path">
            <el-menu-item
              v-if="!item.hidden"
              :item="item"
              :base-path="item.path"
              :index="item.path"
            >
              <template slot="title">
                <item
                  v-if="item.meta"
                  :icon="item.meta && item.meta.icon"
                  :title="item.meta.title"
                />
              </template>
            </el-menu-item>
          </div>
        </el-menu>
      </el-scrollbar>
      <version />
    </div>
    <sidebar
      :class="{ nosidebar: $route.meta.hideMenu }"
      class="sidebar-container"
      :router-list="routerList"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Sidebar from "@/components/Sidebar";
import variables from "@/styles/variables.module.scss";
import Logo from "./Logo";
import Item from "./Item.vue";
import Version from "@/components/Version";
export default {
  components: { Sidebar, Logo, Item, Version },
  data() {
    return {
      // 传入右边的导航数据
      routerList: []
    };
  },
  watch: {
    $route(to) {
      this.getMenuItem(to);
      if (to.path.startsWith("/redirect/")) {
        return;
      }
    }
  },
  created() {
    this.getMenuItem(this.$route);
  },
  computed: {
    ...mapGetters(["routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.routerParent) {
        return meta.routerParent;
      }
      return path;
    },
    variables() {
      return variables;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    }
  },
  methods: {
    getMenuItem(val) {
      this.routes.map((item) => {
        if (val.meta.routerParent === item.path) {
          this.routerList = item.children;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
