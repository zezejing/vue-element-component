<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      v-if="isCollapse && typeSiderbar !== 2"
      :class="{ 'no-hamburger': $route.meta.hideMenu && typeSiderbar === 3}"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="needBreadcrumb && typeSiderbar !== 2"
    />
    <sidebar class="top-sidebar-container" mode="horizontal" v-if="typeSiderbar === 2" />
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <img src="@/assets/user.png" class="user-avatar" />
          <h3 class="user-name-version">小镜子</h3>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="is_show = !is_show">
            <span style="display: block" >锁定屏幕</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <lock-screen :is_show="is_show"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Sidebar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { Logout as utilsLogout } from "@/utils/";
import LockScreen from "@/components/LockScreen/index";
export default {
  components: {
    Sidebar,
    Breadcrumb,
    Hamburger,
    LockScreen
  },
  computed: {
    ...mapGetters(["sidebar"]),
    ...mapState({
      needBreadcrumb: (state) => state.settings.breadcrumb,
      isCollapse: (state) => state.settings.isCollapse,
      typeSiderbar: (state) => state.settings.typeSiderbar
    })
  },
  data() {
    return {
      is_show: false
    };
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    // 退出登录
    logout() {
      this.$confirm("此操作将退出登录， 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          utilsLogout();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/variables.module.scss";
.navbar {
  height: $navHeight;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: $navHeight;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .no-hamburger{
    display: none;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: $navHeight;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        /* margin-top: 5px; */
        position: relative;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .user-name-version {
          font-size: 14px;
          font-weight: 400;
          margin: 0 0 0 10px;
          cursor: pointer;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
