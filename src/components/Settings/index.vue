<template>
  <div class="drawer-container">
    <div class="drawer-wrapper-body">
      <div class="drawer-header">项目配置</div>
      <div class="drawer-body">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-divider class="divider-with-text" content-position="center">导航栏模式</el-divider>
          <div class="menu-type-picker">
            <el-tooltip
              v-for="item in siderbarList"
              :key="item.value"
              class="item"
              effect="dark"
              :content="item.name"
              placement="bottom"
            >
              <div
                class="menu-type-picker-item"
                :class="{
                  'type-active': typeSiderbar === item.value,
                  'left-siderbar': item.value === 1,
                  'top-siderbar': item.value === 2,
                  'mix-siderbar': item.value === 3
                }"
                @click="typeSiderbarChange(item.value)"
              >
                <div class="mix-sidebar"></div>
              </div>
            </el-tooltip>
          </div>
          <el-divider class="divider-with-text" content-position="center">页面功能</el-divider>
          <div class="drawer-item">
            <span>固定header</span>
            <el-switch v-model="fixedHeader" class="drawer-switch" />
          </div>
          <div class="drawer-item">
            <span>菜单折叠按钮</span>
            <el-switch v-model="isCollapse" class="drawer-switch" />
          </div>
          <el-divider class="divider-with-text" content-position="center">界面显示</el-divider>
          <div class="drawer-item">
            <span>面包屑导航</span>
            <el-switch v-model="breadcrumb" class="drawer-switch" />
          </div>
          <div class="drawer-item">
            <span>标签导航</span>
            <el-switch v-model="tagsView" class="drawer-switch" />
          </div>
          <div class="drawer-item">
            <span>Logo</span>
            <el-switch v-model="sidebarLogo" class="drawer-switch" />
          </div>
          <div class="drawer-item">
            <span>版本</span>
            <el-switch v-model="isVersion" class="drawer-switch" />
          </div>
          <div class="drawer-item">
            <span>页脚</span>
            <el-switch v-model="isFooter" class="drawer-switch" />
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      siderbarList: [
        { name: "左侧菜单模式", value: 1 },
        { name: "顶部菜单模式", value: 2 },
        { name: "左侧菜单混合模式", value: 3 }
      ]
    };
  },
  computed: {
    typeSiderbar() {
      return this.$store.state.settings.typeSiderbar;
    },
    // 固定顶部
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    // 菜单折叠按钮
    isCollapse: {
      get() {
        return this.$store.state.settings.isCollapse;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "isCollapse",
          value: val
        });
      }
    },
    // 是否显示面包屑导航
    breadcrumb: {
      get() {
        return this.$store.state.settings.breadcrumb;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "breadcrumb",
          value: val
        });
      }
    },
    // 是否开启标签导航
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    // 是否显示logo
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val
        });
      }
    },
    // 是否显示版本信息
    isVersion: {
      get() {
        return this.$store.state.settings.isVersion;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "isVersion",
          value: val
        });
      }
    },
    // 是否显示页脚信息
    isFooter: {
      get() {
        return this.$store.state.settings.isFooter;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "isFooter",
          value: val
        });
      }
    }
  },
  methods: {
    typeSiderbarChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "typeSiderbar",
        value: val
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.drawer-container {
  width: 100%;
  height: 100%;
  z-index: 9999999;
  background-color: #fff;
  overflow: auto;
  .drawer-wrapper-body {
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
    .drawer-header {
      padding: 16px 24px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      border-radius: 2px 2px 0 0;
      font-size: 16px;
      font-weight: bold;
    }
    .drawer-body {
      padding: 16px;
      background-color: #fff;
      flex-grow: 1;
      overflow: auto;
      font-size: 14px;
      line-height: 1.5715;
      word-wrap: break-word;
      .el-divider__text {
        font-size: 16px;
        font-weight: bold;
      }
      .drawer-item {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        padding: 12px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      // 菜单模式
      .menu-type-picker {
        display: flex;
        .type-active {
          border: 2px solid #0960bd;
        }
        .menu-type-picker-item {
          position: relative;
          width: 56px;
          height: 48px;
          margin-right: 16px;
          overflow: hidden;
          cursor: pointer;
          background-color: #f0f2f5;
          border-radius: 4px;
          box-shadow: 0 1px 2.5px #0000002e;
        }
        .menu-type-picker-item::before {
          position: absolute;
          content: "";
        }
        .menu-type-picker-item::after {
          position: absolute;
          content: "";
        }
        .left-siderbar::before {
          top: 0;
          left: 0;
          z-index: 1;
          width: 33%;
          height: 100%;
          background-color: #273352;
        }
        .left-siderbar::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #fff;
        }
        .top-siderbar::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #273352;
        }
        .mix-siderbar::before {
          top: 0;
          left: 0;
          z-index: 1;
          width: 25%;
          height: 100%;
          background-color: #273352;
        }
        .mix-siderbar::after {
          top: 0;
          left: 0;
          width: 100%;
          height: 25%;
          background-color: #fff;
        }
        .mix-siderbar {
          .mix-sidebar {
            position: absolute;
            left: 25%;
            width: 15%;
            height: 100%;
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>
