<template>
  <div id="app">
      <router-view />
      <!-- 返回顶部 -->
      <back-to-top/>
  </div>
</template>
<script>
import { delCookie } from "@/utils/auth";
export default {
  name: "App",
  data() {
    return {
      // 鼠标如不经过停留30分钟退出登录
      oldTime: Math.floor(new Date().getTime() / 1000),
      newTime: new Date().getTime(),
      // outTime: 10,
      outTime: 120 * 60,
      updata: true
    };
  },
  mounted() {
    if (document.body.clientWidth < 768) {
      if (this.$route.path === "/min-screen") return;
      sessionStorage.setItem("link", this.$route.path);
      this.$router.push({ path: "/min-screen" });
    }
    window.onresize = () => {
      return (() => {
        if (document.body.clientWidth < 768) {
          if (this.$route.path === "/min-screen") return;
          sessionStorage.setItem("link", this.$route.path);
          this.$router.push({ path: "/min-screen" });
        }
      })();
    };
    setInterval(this.OutTime, 5000);

    let app = document.getElementById("app");
    // 监听鼠标移动事件，鼠标移动，更新oldTime, 一分钟更新一次
    app.onmousemove = () => {
      if (this.updata) {
        this.oldTime = Math.floor(new Date().getTime() / 1000);
        this.updata = false;
        setTimeout(() => {
          this.updata = true;
        }, 1000);
      }
    };
  },
  methods: {
    OutTime() {
      if (this.outTime !== 0) {
        if (this.$router.currentRoute.path != "/login") {
          this.newTime = Math.floor(new Date().getTime() / 1000); //更新未进行操作的当前时间
          if (this.newTime - this.oldTime > this.outTime) {
            //判断是否超时不操作
            delCookie();
            this.$store.state.permission.addRoutes = {};
            this.$notify({
              title: "警告",
              duration: 0,
              message: "长时间未操作，请重新登录！",
              type: "warning"
            });
            this.outTime = 0;
            this.$router.push({ path: "/login" });
          }
        }
      } else {
        this.oldTime = Math.floor(new Date().getTime() / 1000);
        this.outTime = 60 * 60 * 2;
      }
    }
  }
};
</script>
