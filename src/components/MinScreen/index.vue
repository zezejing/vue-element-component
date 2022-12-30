<template>
  <div class="min-container">
    <img src="../../assets/logo.png" />
    <p>{{ title }}</p>
    <p>请使用电脑端登录该地址！</p>
    <p>服务热线: 950-139-22789</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: process.env.VUE_APP_TITLE
    };
  },
  created() {
    const token = sessionStorage.getItem("token");
    const link = sessionStorage.getItem("link");
    if (document.body.clientWidth < 768) {
      if (this.$route.path === "/min-screen") return;
      sessionStorage.setItem("link", this.$route.path);
      this.$router.push({ path: "/min-screen" });
    } else {
      if (this.$route.path === "/min-screen") {
        if (link) {
          this.$router.push({ path: link });
        } else {
          if (token) {
            this.$router.push({ path: "/" });
          } else {
            this.$router.push({ path: "/login" });
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.min-container {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  line-height: 28px;
  img {
    margin-bottom: 10px;
  }
  p {
    margin: 0;
  }
}
</style>
