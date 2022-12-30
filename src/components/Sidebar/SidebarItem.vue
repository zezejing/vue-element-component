<template>
  <span v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="onlyOneChild.path">
        <el-menu-item :index="onlyOneChild.path" class="submenu-title-noDropdown">
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="item.path" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="child.path"
        class="nest-menu"
      />
    </el-submenu>
  </span>
</template>
<script>
// import path from "path";
// import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    // 路由数据
    item: {}
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      });
      if (showingChildren.length === 1) {
        return true;
      }
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: parent.path, noShowingChildren: true };
        return true;
      }
      return false;
    }
    // resolvePath(routePath) {
    //   if (isExternal(routePath)) {
    //     return routePath;
    //   }
    //   if (isExternal(this.basePath)) {
    //     return this.basePath;
    //   }
    //   return path.resolve(this.basePath, routePath);
    // }
  }
};
</script>
