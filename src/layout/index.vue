<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" v-if="typeSiderbar === 1" />
    <left-sidebar class="left-sidebar-container" v-if="typeSiderbar === 3" />
    <div
      :class="{
        hasTagsView: needTagsView,
        topSiderbar: typeSiderbar === 2,
        leftSiderbar: typeSiderbar === 3,
        noSiderbar: $route.meta.hideMenu && typeSiderbar === 3
      }"
      class="main-container"
    >
      <div
        :class="{
          'fixed-header': fixedHeader,
          topNavbar: typeSiderbar === 2,
          leftNavbar: typeSiderbar === 3,
          noNavbar: $route.meta.hideMenu && typeSiderbar === 3
        }"
      >
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <section class="app-main">
        <transition name="fade-transform" mode="out-in">
          <router-view :key="key" />
        </transition>
        <foot v-if="isFooter" />
      </section>
      <!-- 全局设置 -->
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import leftSidebar from "@/components/Sidebar/LeftSidebar.vue";
import Navbar from "@/components/Navbar";
import TagsView from "@/components/TagsView";
import Foot from "@/components/Footer";
import RightPanel from "@/components/RightPanel";
import Settings from "@/components/Settings";
import { mapState } from "vuex";

export default {
  components: { Sidebar, Navbar, TagsView, Foot, RightPanel, Settings, leftSidebar },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
      isFooter: (state) => state.settings.isFooter,
      typeSiderbar: (state) => state.settings.typeSiderbar
    }),
    key() {
      return this.$route.path;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      };
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.module.scss";
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
.leftNavbar {
  width: calc(100% - 260px);
}
.noNavbar {
  width: calc(100% - 100px);
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 0px);
  }
  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
.topSiderbar {
  margin-left: 0px;
}
.topSiderbar .fixed-header {
  width: 100%;
}
.topNavbar {
  .navbar {
    display: flex;
    justify-content: space-between;
  }
}
.leftSiderbar {
  margin-left: 260px;
}
.noSiderbar {
  margin-left: 100px;
}
</style>
